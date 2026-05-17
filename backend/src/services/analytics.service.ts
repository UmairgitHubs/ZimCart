import { Prisma } from '@prisma/client';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const LOW_STOCK_THRESHOLD = 10;

type StaffUser = { id: string; role: string };

async function getManagedStoreId(managerId: string): Promise<string | null> {
  const store = await prisma.store.findFirst({
    where: { managerId },
    select: { id: true },
  });
  return store?.id ?? null;
}

/** Resolved store filter: null = all marts (admin), string = single mart, undefined = no access (SM without store) */
async function resolveStoreScope(
  user: StaffUser,
  queryStoreId?: string
): Promise<string | null | undefined> {
  if (user.role === 'STORE_MANAGER') {
    return (await getManagedStoreId(user.id)) ?? undefined;
  }
  if (user.role === 'ADMIN') {
    return queryStoreId ?? null;
  }
  throw new ApiError(403, 'Not authorized');
}

async function assertAdminStoreExists(storeId: string) {
  const exists = await prisma.store.findUnique({ where: { id: storeId }, select: { id: true } });
  if (!exists) throw new ApiError(404, 'Store not found');
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Last N full days including today: start 00:00 (today - (n-1)), end endOfToday */
function rollingDaysStart(n: number): Date {
  const end = endOfToday();
  const start = new Date(end);
  start.setDate(start.getDate() - (n - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

function quarterStart(d: Date): Date {
  const m = d.getMonth();
  const q = Math.floor(m / 3) * 3;
  return new Date(d.getFullYear(), q, 1, 0, 0, 0, 0);
}

function yearStart(d: Date): Date {
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function prevWindow(start: Date, end: Date): { prevStart: Date; prevEnd: Date } {
  const ms = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  prevEnd.setHours(23, 59, 59, 999);
  const prevStart = new Date(prevEnd.getTime() - ms);
  prevStart.setHours(0, 0, 0, 0);
  return { prevStart, prevEnd };
}

function pctDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Extra AND for single mart; admin (all marts) passes null → no filter. */
function sqlOrderStore(storeId: string | null | undefined): Prisma.Sql {
  if (storeId === undefined || storeId === null) return Prisma.sql``;
  return Prisma.sql`AND o."storeId" = ${storeId}`;
}

function normalizeRange(raw: string | undefined): '7d' | '30d' | 'quarter' | 'ytd' {
  if (raw === '7d' || raw === '30d' || raw === 'quarter' || raw === 'ytd') return raw;
  return 'ytd';
}

function windowForRange(range: '7d' | '30d' | 'quarter' | 'ytd'): { start: Date; end: Date } {
  const end = endOfToday();
  switch (range) {
    case '7d':
      return { start: rollingDaysStart(7), end };
    case '30d':
      return { start: rollingDaysStart(30), end };
    case 'quarter':
      return { start: quarterStart(end), end };
    case 'ytd':
    default:
      return { start: yearStart(end), end };
  }
}

async function orderKpis(
  start: Date,
  end: Date,
  storeId: string | null | undefined
): Promise<{ orders: number; revenue: number; completed: number; activeOrders: number }> {
  if (storeId === undefined) {
    return { orders: 0, revenue: 0, completed: 0, activeOrders: 0 };
  }

  const rows = await prisma.$queryRaw<
    { orders: number; revenue: number; completed: number; active_orders: number }[]
  >`
    SELECT
      COUNT(*)::int AS orders,
      COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue,
      COUNT(*) FILTER (WHERE o.status = 'COMPLETED')::int AS completed,
      COUNT(*) FILTER (WHERE o.status <> 'CANCELLED')::int AS active_orders
    FROM "Order" o
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
  `;

  const r = rows[0];
  return {
    orders: r?.orders ?? 0,
    revenue: r?.revenue ?? 0,
    completed: r?.completed ?? 0,
    activeOrders: r?.active_orders ?? 0,
  };
}

async function lowStockCount(storeId: string | null | undefined): Promise<number> {
  if (storeId === undefined) return 0;
  const where =
    storeId === null
      ? { inventory: { lte: LOW_STOCK_THRESHOLD } }
      : { storeId, inventory: { lte: LOW_STOCK_THRESHOLD } };
  return prisma.product.count({ where });
}

async function salesLast6Months(
  storeId: string | null | undefined
): Promise<{ name: string; sales: number }[]> {
  if (storeId === undefined) return [];

  const end = endOfToday();
  const start = new Date(end.getFullYear(), end.getMonth() - 5, 1, 0, 0, 0, 0);

  const rows = await prisma.$queryRaw<{ ym: Date; revenue: number }[]>`
    SELECT
      DATE_TRUNC('month', o."createdAt") AS ym,
      COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue
    FROM "Order" o
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
    GROUP BY ym
    ORDER BY ym ASC
  `;

  const byMonth = new Map<string, number>();
  for (const row of rows) {
    const key = `${row.ym.getFullYear()}-${row.ym.getMonth()}`;
    byMonth.set(key, Number(row.revenue));
  }

  const out: { name: string; sales: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const short = d.toLocaleString('en-US', { month: 'short' });
    out.push({ name: short, sales: Math.round(byMonth.get(key) ?? 0) });
  }
  return out;
}

async function categoryBarsLast30(
  storeId: string | null | undefined
): Promise<{ name: string; sales: number; orders: number }[]> {
  if (storeId === undefined) return [];

  const end = endOfToday();
  const start = rollingDaysStart(30);
  const rows = await prisma.$queryRaw<{ name: string; revenue: number; qty: number; orders: number }[]>`
    SELECT
      c.name AS name,
      COALESCE(SUM(oi.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue,
      COALESCE(SUM(oi.quantity) FILTER (WHERE o.status <> 'CANCELLED'), 0)::int AS qty,
      COUNT(DISTINCT o.id) FILTER (WHERE o.status <> 'CANCELLED')::int AS orders
    FROM "OrderItem" oi
    INNER JOIN "Order" o ON o.id = oi."orderId"
    INNER JOIN "Product" p ON p.id = oi."productId"
    INNER JOIN "Category" c ON c.id = p."categoryId"
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
    LIMIT 8
  `;

  return rows.map((r) => ({
    name: r.name,
    sales: Math.round(Number(r.revenue)),
    orders: Number(r.orders),
  }));
}

async function statusCounts(
  start: Date,
  end: Date,
  storeId: string | null | undefined
): Promise<Record<string, number>> {
  if (storeId === undefined) return {};

  const rows = await prisma.$queryRaw<{ status: string; c: number }[]>`
    SELECT o.status::text AS status, COUNT(*)::int AS c
    FROM "Order" o
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
    GROUP BY o.status
  `;

  const acc: Record<string, number> = {};
  for (const row of rows) {
    acc[row.status] = row.c;
  }
  return acc;
}

function toPieData(counts: Record<string, number>) {
  const delivered = counts.COMPLETED ?? 0;
  const shipped = counts.SHIPPING ?? 0;
  const confirmed = (counts.CONFIRMED ?? 0) + (counts.PREPARING ?? 0);
  const pending = counts.PENDING ?? 0;
  const cancelled = counts.CANCELLED ?? 0;

  const base = [
    { name: 'Delivered', value: delivered, color: '#10B981' },
    { name: 'Shipped', value: shipped, color: '#3B82F6' },
    { name: 'Confirmed', value: confirmed, color: '#F59E0B' },
    { name: 'Pending', value: pending, color: '#94A3B8' },
  ];
  if (cancelled > 0) {
    base.push({ name: 'Cancelled', value: cancelled, color: '#64748B' });
  }
  return base.filter((x) => x.value > 0);
}

async function revenueTimeline(
  range: '7d' | '30d' | 'quarter' | 'ytd',
  storeId: string | null | undefined
): Promise<{ date: string; revenue: number; orders: number }[]> {
  if (storeId === undefined) return [];

  const { start, end } = windowForRange(range);

  const rows =
    range === 'ytd'
      ? await prisma.$queryRaw<{ bucket: Date; revenue: number; orders: number }[]>`
          SELECT
            DATE_TRUNC('month', o."createdAt") AS bucket,
            COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue,
            COUNT(*) FILTER (WHERE o.status <> 'CANCELLED')::int AS orders
          FROM "Order" o
          WHERE o."createdAt" >= ${start}
            AND o."createdAt" <= ${end}
            ${sqlOrderStore(storeId)}
          GROUP BY bucket
          ORDER BY bucket ASC
        `
      : await prisma.$queryRaw<{ bucket: Date; revenue: number; orders: number }[]>`
          SELECT
            DATE_TRUNC('day', o."createdAt") AS bucket,
            COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue,
            COUNT(*) FILTER (WHERE o.status <> 'CANCELLED')::int AS orders
          FROM "Order" o
          WHERE o."createdAt" >= ${start}
            AND o."createdAt" <= ${end}
            ${sqlOrderStore(storeId)}
          GROUP BY bucket
          ORDER BY bucket ASC
        `;

  return rows.map((r) => {
    const label =
      range === 'ytd'
        ? r.bucket.toLocaleString('en-US', { month: 'short' })
        : r.bucket.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: label,
      revenue: Math.round(Number(r.revenue)),
      orders: Number(r.orders),
    };
  });
}

async function categoryPerformance(
  range: '7d' | '30d' | 'quarter' | 'ytd',
  storeId: string | null | undefined
): Promise<{ name: string; sales: number; revenue: number; percentage: number }[]> {
  if (storeId === undefined) return [];

  const { start, end } = windowForRange(range);

  const rows = await prisma.$queryRaw<{ name: string; revenue: number; qty: number }[]>`
    SELECT
      c.name AS name,
      COALESCE(SUM(oi.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue,
      COALESCE(SUM(oi.quantity) FILTER (WHERE o.status <> 'CANCELLED'), 0)::int AS qty
    FROM "OrderItem" oi
    INNER JOIN "Order" o ON o.id = oi."orderId"
    INNER JOIN "Product" p ON p.id = oi."productId"
    INNER JOIN "Category" c ON c.id = p."categoryId"
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
    LIMIT 12
  `;

  const totalRev = rows.reduce((s, r) => s + Number(r.revenue), 0) || 1;
  return rows.map((r) => ({
    name: r.name,
    sales: Number(r.qty),
    revenue: Math.round(Number(r.revenue)),
    percentage: Math.round((Number(r.revenue) / totalRev) * 1000) / 10,
  }));
}

async function topProducts(
  range: '7d' | '30d' | 'quarter' | 'ytd',
  storeId: string | null | undefined
): Promise<
  { id: string; name: string; sold: number; revenue: number; trend: 'up' | 'down' | 'neutral'; trendValue: number }[]
> {
  if (storeId === undefined) return [];

  const { start, end } = windowForRange(range);

  const rows = await prisma.$queryRaw<
    { productId: string; name: string; sold: number; revenue: number }[]
  >`
    SELECT
      oi."productId" AS "productId",
      MAX(COALESCE(NULLIF(TRIM(oi.name), ''), NULLIF(TRIM(p.name), ''), 'Product')) AS name,
      COALESCE(SUM(oi.quantity) FILTER (WHERE o.status <> 'CANCELLED'), 0)::int AS sold,
      COALESCE(SUM(oi.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue
    FROM "OrderItem" oi
    INNER JOIN "Order" o ON o.id = oi."orderId"
    INNER JOIN "Product" p ON p.id = oi."productId"
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
    GROUP BY oi."productId"
    ORDER BY revenue DESC
    LIMIT 5
  `;

  return rows.map((r) => ({
    id: r.productId,
    name: r.name,
    sold: Number(r.sold),
    revenue: Math.round(Number(r.revenue)),
    trend: 'neutral' as const,
    trendValue: 0,
  }));
}

async function regionBreakdown(
  range: '7d' | '30d' | 'quarter' | 'ytd',
  storeId: string | null | undefined
): Promise<{ region: string; sales: number; revenue: number; percentage: number }[]> {
  if (storeId === undefined) return [];

  const { start, end } = windowForRange(range);

  const rows = await prisma.$queryRaw<{ region: string; orders: number; revenue: number }[]>`
    SELECT
      COALESCE(NULLIF(TRIM(u.country), ''), 'Unknown') AS region,
      COUNT(DISTINCT o.id) FILTER (WHERE o.status <> 'CANCELLED')::int AS orders,
      COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'CANCELLED'), 0)::float AS revenue
    FROM "Order" o
    INNER JOIN "User" u ON u.id = o."userId"
    WHERE o."createdAt" >= ${start}
      AND o."createdAt" <= ${end}
      ${sqlOrderStore(storeId)}
    GROUP BY region
    ORDER BY revenue DESC
    LIMIT 6
  `;

  const totalRev = rows.reduce((s, r) => s + Number(r.revenue), 0) || 1;
  return rows.map((r) => ({
    region: r.region,
    sales: Number(r.orders),
    revenue: Math.round(Number(r.revenue)),
    percentage: Math.round((Number(r.revenue) / totalRev) * 1000) / 10,
  }));
}

export async function getStaffOverview(user: StaffUser, queryStoreId?: string) {
  if (user.role === 'ADMIN' && queryStoreId) {
    await assertAdminStoreExists(queryStoreId);
  }

  const storeId = await resolveStoreScope(user, queryStoreId);

  const end = endOfToday();
  const start30 = rollingDaysStart(30);
  const { prevStart, prevEnd } = prevWindow(start30, end);

  const [cur, prev, lowStock, sales6m, cat30, statusMap] = await Promise.all([
    orderKpis(start30, end, storeId),
    orderKpis(prevStart, prevEnd, storeId),
    lowStockCount(storeId),
    salesLast6Months(storeId),
    categoryBarsLast30(storeId),
    statusCounts(start30, end, storeId),
  ]);

  const aov = cur.activeOrders > 0 ? Math.round((cur.revenue / cur.activeOrders) * 100) / 100 : 0;
  const prevAov =
    prev.activeOrders > 0 ? Math.round((prev.revenue / prev.activeOrders) * 100) / 100 : 0;

  const fulfillment =
    cur.activeOrders > 0 ? Math.round((cur.completed / cur.activeOrders) * 1000) / 10 : 0;
  const prevFulfillment =
    prev.activeOrders > 0 ? Math.round((prev.completed / prev.activeOrders) * 1000) / 10 : 0;

  return {
    windowLabel: 'Last 30 days',
    kpis: {
      totalOrders: cur.activeOrders,
      grossRevenue: Math.round(cur.revenue * 100) / 100,
      lowStockItems: lowStock,
      ordersGrowthPct: pctDelta(cur.activeOrders, prev.activeOrders),
      revenueGrowthPct: pctDelta(cur.revenue, prev.revenue),
      averageOrderValue: aov,
      aovGrowthPct: pctDelta(aov, prevAov),
      fulfillmentRatePct: fulfillment,
      fulfillmentGrowthPct: pctDelta(fulfillment, prevFulfillment),
    },
    salesLast6Months: sales6m,
    performanceLast30Days: {
      categorySales: cat30,
      orderStatus: toPieData(statusMap),
    },
  };
}

export async function getStaffInsights(
  user: StaffUser,
  opts: { range: string; queryStoreId?: string }
) {
  const range = normalizeRange(opts.range);

  if (user.role === 'ADMIN' && opts.queryStoreId) {
    await assertAdminStoreExists(opts.queryStoreId);
  }

  const storeId = await resolveStoreScope(user, opts.queryStoreId);
  const { start, end } = windowForRange(range);
  const { prevStart, prevEnd } = prevWindow(start, end);

  const [cur, prev, timeline, categories, products, regions] = await Promise.all([
    orderKpis(start, end, storeId),
    orderKpis(prevStart, prevEnd, storeId),
    revenueTimeline(range, storeId),
    categoryPerformance(range, storeId),
    topProducts(range, storeId),
    regionBreakdown(range, storeId),
  ]);

  const aov = cur.activeOrders > 0 ? Math.round((cur.revenue / cur.activeOrders) * 100) / 100 : 0;
  const prevAov =
    prev.activeOrders > 0 ? Math.round((prev.revenue / prev.activeOrders) * 100) / 100 : 0;

  const fulfillment =
    cur.activeOrders > 0 ? Math.round((cur.completed / cur.activeOrders) * 1000) / 10 : 0;
  const prevFulfillment =
    prev.activeOrders > 0 ? Math.round((prev.completed / prev.activeOrders) * 1000) / 10 : 0;

  return {
    range,
    summary: {
      totalRevenue: Math.round(cur.revenue * 100) / 100,
      revenueGrowth: pctDelta(cur.revenue, prev.revenue),
      totalOrders: cur.activeOrders,
      ordersGrowth: pctDelta(cur.activeOrders, prev.activeOrders),
      averageOrderValue: aov,
      aovGrowth: pctDelta(aov, prevAov),
      conversionRate: fulfillment,
      conversionGrowth: pctDelta(fulfillment, prevFulfillment),
    },
    revenueTimeline: timeline.length ? timeline : [{ date: '—', revenue: 0, orders: 0 }],
    categoryPerformance: categories,
    topProducts: products,
    regionStats: regions,
  };
}

export async function getRecentActivity(user: StaffUser, queryStoreId?: string) {
  const storeId = await resolveStoreScope(user, queryStoreId);
  if (storeId === undefined) return [];

  const orderWhere: Prisma.OrderWhereInput = storeId ? { storeId } : {};

  const [recentOrders, recentPayments, lowStock] = await Promise.all([
    prisma.order.findMany({
      where: orderWhere,
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { name: true } } },
    }),
    prisma.payment.findMany({
      where: { order: orderWhere },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { order: { select: { orderNumber: true } } },
    }),
    prisma.product.findMany({
      where: {
        ...(storeId ? { storeId } : {}),
        inventory: { lte: LOW_STOCK_THRESHOLD },
        status: 'Published',
      },
      take: 3,
      select: { name: true, inventory: true },
    }),
  ]);

  const activities: {
    title: string;
    subtitle: string;
    time: string;
    color: string;
  }[] = [];

  for (const o of recentOrders) {
    activities.push({
      title: 'New order',
      subtitle: `${o.user.name} · ${o.orderNumber}`,
      time: o.createdAt.toISOString(),
      color: 'bg-emerald-500',
    });
  }

  for (const p of recentPayments) {
    if (p.status !== 'PAID') continue;
    activities.push({
      title: 'Payment received',
      subtitle: `${p.order.orderNumber} · $${p.amount.toFixed(0)}`,
      time: (p.paidAt ?? p.updatedAt).toISOString(),
      color: 'bg-blue-500',
    });
  }

  for (const prod of lowStock) {
    activities.push({
      title: 'Low stock',
      subtitle: `${prod.name} (${prod.inventory} left)`,
      time: new Date().toISOString(),
      color: 'bg-amber-500',
    });
  }

  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 12)
    .map((a) => ({
      ...a,
      time: formatRelativeTime(new Date(a.time)),
    }));
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}
