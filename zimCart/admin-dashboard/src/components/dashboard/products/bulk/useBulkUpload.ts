"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { useAddProduct } from "@/hooks/useProducts";

export function useBulkUpload(onClose: () => void) {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: addProduct } = useAddProduct();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        Name: "Premium Organic Coffee",
        SKU: "COF-ORG-001",
        Barcode: "123456789",
        Brand: "EcoRoast",
        Category: "Beverages",
        SubCategory: "Organic Coffee",
        Price: 15.99,
        DiscountPrice: 12.99,
        CostPrice: 8.50,
        TaxPercentage: 5,
        Stock: 50,
        Status: "In Stock",
        Weight: "500g",
        Description: "Rich, aromatic organic coffee beans sourced from sustainable farms.",
        Images: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e",
        IsDeal: "TRUE",
        DiscountPercentage: 15,
        Sales: 150,
        Variants: '[{"type":"Grind","values":["Whole Bean","Ground"]},{"type":"Roast","values":["Light","Dark"]}]'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Template");
    XLSX.writeFile(wb, "ZimCart_Bulk_Upload_Full_Manifest.xlsx");
  };

  const handleUpload = async () => {
    if (data.length === 0) return;

    setIsProcessing(true);
    let s = 0;
    let e = 0;

    for (let i = 0; i < data.length; i++) {
       const row = data[i];
       try {
          if (!row.Name || !row.Category || !row.Price || !row.SKU) {
             throw new Error("Missing required fields");
          }

          // Safe JSON parsing for variants
          let parsedVariants = [];
          if (row.Variants) {
            try {
              parsedVariants = typeof row.Variants === 'string' ? JSON.parse(row.Variants) : row.Variants;
            } catch (vErr) {
              console.warn("Invalid variants JSON for SKU:", row.SKU);
            }
          }

          const productData = {
             name: String(row.Name),
             brand: String(row.Brand || "Generic"),
             sku: String(row.SKU),
             barcode: String(row.Barcode || ""),
             category: String(row.Category),
             subCategory: String(row.SubCategory || ""),
             price: Number(row.Price),
             discountPrice: Number(row.DiscountPrice) || 0,
             costPrice: Number(row.CostPrice) || 0,
             taxPercentage: Number(row.TaxPercentage) || 0,
             inventory: Number(row.Stock) || 0,
             description: String(row.Description || ""),
             status: ["Draft", "In Stock", "Low Stock", "Out of Stock"].includes(row.Status) ? row.Status : "Draft",
             images: row.Images ? String(row.Images).split(",").map(url => url.trim()) : ["https://placehold.co/400x400/png?text=No+Image"],
             isDeal: String(row.IsDeal).toUpperCase() === "TRUE",
             discountPercentage: Number(row.DiscountPercentage) || 0,
             weight: String(row.Weight || ""),
             sales: Number(row.Sales) || 0,
             variants: parsedVariants,
          };

          await addProduct(productData as any);
          s++;
       } catch (err) {
          console.error("Row import error:", err);
          e++;
       }
       
       const progress = Math.round(((i + 1) / data.length) * 100);
       setUploadProgress(progress);
       setSuccessCount(s);
       setErrorCount(e);
    }

    setIsFinished(true);
    setIsProcessing(false);
  };

  const resetModal = () => {
    setFile(null);
    setData([]);
    setIsProcessing(false);
    setUploadProgress(0);
    setSuccessCount(0);
    setErrorCount(0);
    setIsFinished(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    file,
    data,
    isProcessing,
    uploadProgress,
    successCount,
    errorCount,
    isFinished,
    fileInputRef: fileInputRef as React.RefObject<HTMLInputElement>,
    handleFileChange,
    handleUpload,
    downloadTemplate,
    resetModal,
    setFile,
    setData
  };
}
