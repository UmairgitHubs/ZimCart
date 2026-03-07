import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as categoryService from '../services/category.service.js';

export const getCategories = asyncHandler(async (req, res) => {
  const { search, status } = req.query;

  const data = await categoryService.getCategories({
    search: search as string,
    status: status as string,
    user: req.user
  });

  return res.status(200).json(
    new ApiResponse(200, data, "Categories fetched successfully")
  );
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user);

  return res.status(201).json(
    new ApiResponse(201, category, "Category created successfully")
  );
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.updateCategory(String(id), req.body, req.user);

  return res.status(200).json(
    new ApiResponse(200, category, "Category updated successfully")
  );
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategory(String(id), req.user);

  return res.status(200).json(
    new ApiResponse(200, {}, "Category deleted successfully")
  );
});
