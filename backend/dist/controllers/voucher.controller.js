import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as voucherService from '../services/voucher.service.js';
export const listVouchers = asyncHandler(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const rows = await voucherService.listVouchers(req.user, search);
    const vouchers = rows.map((v) => ({
        id: v.id,
        code: v.code,
        name: v.campaignName,
        description: v.campaignDescription,
        discountType: v.discountType,
        value: v.value,
        minSpend: v.minSpend,
        maxDiscount: v.maxDiscount,
        expiryDate: v.expiryDate.toISOString(),
        isActive: v.isActive,
        storeId: v.storeId,
        store: v.store,
        usageCount: v.usageCount,
    }));
    return res.status(200).json(new ApiResponse(200, { vouchers }, 'Vouchers fetched successfully'));
});
export const createVoucher = asyncHandler(async (req, res) => {
    const created = await voucherService.createVoucher(req.user, req.body);
    const { name, description } = voucherService.unpackVoucherDescription(created.description, created.code);
    return res.status(201).json(new ApiResponse(201, {
        voucher: {
            id: created.id,
            code: created.code,
            name,
            description,
            discountType: created.discountType,
            value: created.value,
            minSpend: created.minSpend,
            maxDiscount: created.maxDiscount,
            expiryDate: created.expiryDate.toISOString(),
            isActive: created.isActive,
            storeId: created.storeId,
            store: created.store,
            usageCount: 0,
        },
    }, 'Voucher created successfully'));
});
export const updateVoucher = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updated = await voucherService.updateVoucher(id, req.user, req.body);
    const { name, description } = voucherService.unpackVoucherDescription(updated.description, updated.code);
    const used = await voucherService.countVoucherRedemptions(updated.id);
    return res.status(200).json(new ApiResponse(200, {
        voucher: {
            id: updated.id,
            code: updated.code,
            name,
            description,
            discountType: updated.discountType,
            value: updated.value,
            minSpend: updated.minSpend,
            maxDiscount: updated.maxDiscount,
            expiryDate: updated.expiryDate.toISOString(),
            isActive: updated.isActive,
            storeId: updated.storeId,
            store: updated.store,
            usageCount: used,
        },
    }, 'Voucher updated successfully'));
});
export const deleteVoucher = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await voucherService.deleteVoucher(id, req.user);
    return res.status(200).json(new ApiResponse(200, null, 'Voucher deleted successfully'));
});
//# sourceMappingURL=voucher.controller.js.map