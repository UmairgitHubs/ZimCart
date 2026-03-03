import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as productService from '../services/product.service.js';


export const createProduct = asyncHandler(async (req, res) => {
  const { 
    name, brand, description, images, price, discountPrice, 
    costPrice, taxPercentage, sku, barcode, category, 
    subCategory, inventory, status, isDeal, discountPercentage, 
    weight, sales, variants 
  } = req.body;

  const product = await productService.createProduct({
    name, brand, description, images, price, discountPrice,
    costPrice, taxPercentage, sku, barcode, category,
    subCategory, inventory, status, isDeal, discountPercentage,
    weight, sales, variants
  });
  
  if (!product) {
    throw new ApiError(500, "Failed to create product");
  }

  return res.status(201).json(
    new ApiResponse(201, product, "Product created successfully")
  );
});


export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const { 
    name, brand, description, images, price, discountPrice, 
    costPrice, taxPercentage, sku, barcode, category, 
    subCategory, inventory, status, isDeal, discountPercentage, 
    weight, sales, variants 
  } = req.body;

  const product = await productService.updateProduct(id, {
    name, brand, description, images, price, discountPrice,
    costPrice, taxPercentage, sku, barcode, category,
    subCategory, inventory, status, isDeal, discountPercentage,
    weight, sales, variants
  });
  
  if (!product) {
    throw new ApiError(404, "Product not found or update failed");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product updated successfully")
  );
});


export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(String(req.query.page || '1')) || 1;
  const limit = parseInt(String(req.query.limit || '20')) || 20;
  const { search, category, status } = req.query as { search?: string, category?: string, status?: string };
  
  const data = await productService.getProducts(page, limit, { search, category, status });

  return res.status(200).json(
    new ApiResponse(200, {
      products: data.products,
      pagination: data.pagination
    }, "Products fetched successfully")
  );
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const product = await productService.getProductById(id);
  
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
});
