import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                // ZodError usually has .errors (or .issues in strictly newer/older versions compatibility)
                // We safely check for existence before mapping to prevent crashes
                const zodErrors = error.errors || error.issues || [];
                if (!Array.isArray(zodErrors)) {
                    return next(new ApiError(400, "Validation Error"));
                }
                const errorMessages = zodErrors.map((err) => ({
                    field: err.path ? err.path.join('.') : 'unknown',
                    message: err.message,
                }));
                const message = errorMessages.map((e) => `${e.field}: ${e.message}`).join(', ');
                return next(new ApiError(400, `Validation Error: ${message}`));
            }
            return next(error);
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map