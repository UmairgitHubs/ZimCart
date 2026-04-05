(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "isAxiosError",
    ()=>isAxiosError,
    "setAuthTokenGetter",
    ()=>setAuthTokenGetter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const api = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});
let getToken = null;
function setAuthTokenGetter(fn) {
    getToken = fn;
}
api.interceptors.request.use((config)=>{
    const token = ("TURBOPACK compile-time value", "object") !== "undefined" && getToken ? getToken() : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use((res)=>res, async (err)=>{
    const message = err.response?.data?.message || err.message;
    if (err.response?.status === 401) {
        if ("TURBOPACK compile-time truthy", 1) {
            window.dispatchEvent(new CustomEvent("auth:logout"));
        }
    }
    return Promise.reject(new Error(message || "Request failed"));
});
function isAxiosError(e) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(e);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/stores/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isMartRole",
    ()=>isMartRole,
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
"use client";
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        token: null,
        refreshToken: null,
        user: null,
        _hasHydrated: false,
        setCredentials: (data)=>set({
                token: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user
            }),
        setHasHydrated: (value)=>set({
                _hasHydrated: value
            }),
        logout: ()=>set({
                token: null,
                refreshToken: null,
                user: null
            }),
        getToken: ()=>get().token
    }), {
    name: "zimcart-mart-auth",
    partialize: (s)=>({
            token: s.token,
            refreshToken: s.refreshToken,
            user: s.user
        }),
    onRehydrateStorage: ()=>(state)=>{
            useAuthStore.getState().setHasHydrated(true);
        }
}));
function isMartRole(role) {
    return [
        "ADMIN",
        "MERCHANT",
        "STORE_MANAGER"
    ].includes(role);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/stores/authStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: 1
        }
    }
});
function Providers({ children }) {
    _s();
    const getToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "Providers.useAuthStore[getToken]": (s)=>s.getToken
    }["Providers.useAuthStore[getToken]"]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "Providers.useAuthStore[logout]": (s)=>s.logout
    }["Providers.useAuthStore[logout]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthTokenGetter"])(getToken);
        }
    }["Providers.useEffect"], [
        getToken
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Providers.useEffect": ()=>{
            const onLogout = {
                "Providers.useEffect.onLogout": ()=>logout()
            }["Providers.useEffect.onLogout"];
            window.addEventListener("auth:logout", onLogout);
            return ({
                "Providers.useEffect": ()=>window.removeEventListener("auth:logout", onLogout)
            })["Providers.useEffect"];
        }
    }["Providers.useEffect"], [
        logout
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/OneDrive/Documents/GitHub/ZimCart/zimCart/admin-dashboard/src/app/providers.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(Providers, "mi6txjUqbv5FXSu1FAwGmGevxT4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Documents$2f$GitHub$2f$ZimCart$2f$zimCart$2f$admin$2d$dashboard$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Documents_GitHub_ZimCart_zimCart_admin-dashboard_src_de522f5e._.js.map