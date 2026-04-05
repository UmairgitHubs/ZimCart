(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/stores/authStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const VALID_ROLES = [
    "ADMIN",
    "MERCHANT",
    "STORE_MANAGER"
];
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "Home.useAuthStore[token]": (s)=>s.token
    }["Home.useAuthStore[token]"]);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "Home.useAuthStore[user]": (s)=>s.user
    }["Home.useAuthStore[user]"]);
    const _hasHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "Home.useAuthStore[_hasHydrated]": (s)=>s._hasHydrated
    }["Home.useAuthStore[_hasHydrated]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!_hasHydrated) return;
            if (token && user && VALID_ROLES.includes(user.role)) {
                router.replace("/dashboard");
            } else {
                router.replace("/login");
            }
        }
    }["Home.useEffect"], [
        _hasHydrated,
        token,
        user,
        router
    ]);
    return null;
}
_s(Home, "5HPSPuGxzwYwiQGIUMLgpclUsGQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=OneDrive_Documents_GitHub_ZimCart_zimCart_admin-dashboard_f984e28b._.js.map