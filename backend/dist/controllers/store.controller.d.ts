/**
 * @desc    Public mart discovery (active + OPEN or BUSY only; excludes CLOSED/HIDDEN).
 * @route   GET /api/v1/marts
 * @access  Public
 */
export declare const getStores: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
/**
 * @desc    All marts for admin pickers (includes inactive / CLOSED / HIDDEN).
 * @route   GET /api/v1/marts/admin/directory
 * @access  Private — ADMIN
 */
export declare const getMartsAdminDirectory: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
/**
 * @desc    Fetch detailed store hub (categories + products). Only OPEN/BUSY, active marts.
 * @route   GET /api/v1/marts/:id
 * @access  Public
 */
export declare const getStoreDetails: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export declare const getStoreSettings: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export declare const updateStoreSettings: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=store.controller.d.ts.map