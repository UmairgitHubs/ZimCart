import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const getHealth = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, { status: "ok" }, "Server is running smoothly"));
});
export { getHealth };
//# sourceMappingURL=health.controller.js.map