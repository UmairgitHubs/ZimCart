import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const uploadPromises = (req.files as Express.Multer.File[]).map(file => 
    CloudinaryService.uploadBuffer(file.buffer)
  );

  const results = await Promise.all(uploadPromises);
  const urls = results.map(result => result.url);

  return res.status(200).json(
    new ApiResponse(200, { urls }, "Images uploaded successfully")
  );
});

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const result = await CloudinaryService.uploadBuffer(req.file.buffer);

  return res.status(200).json(
    new ApiResponse(200, { url: result.url }, "Image uploaded successfully")
  );
});
