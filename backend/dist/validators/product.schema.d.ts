import { z } from 'zod';
export declare const productBodySchema: z.ZodObject<{
    name: z.ZodString;
    brand: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    discountPrice: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    costPrice: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    taxPercentage: z.ZodDefault<z.ZodNumber>;
    sku: z.ZodString;
    barcode: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    category: z.ZodString;
    subCategory: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    inventory: z.ZodNumber;
    status: z.ZodEnum<{
        Draft: "Draft";
        "In Stock": "In Stock";
        "Low Stock": "Low Stock";
        "Out of Stock": "Out of Stock";
    }>;
    images: z.ZodArray<z.ZodString>;
    discountPercentage: z.ZodDefault<z.ZodNumber>;
    isDeal: z.ZodDefault<z.ZodBoolean>;
    weight: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    baseUnit: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        ml: "ml";
        g: "g";
        piece: "piece";
        kg: "kg";
        litre: "litre";
        metre: "metre";
        box: "box";
    }>>>;
    sales: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    variants: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        sellingUnit: z.ZodString;
        baseUnitQuantity: z.ZodNumber;
        sku: z.ZodString;
        barcode: z.ZodOptional<z.ZodString>;
        costPrice: z.ZodNumber;
        sellingPrice: z.ZodNumber;
        discountPrice: z.ZodOptional<z.ZodNumber>;
        stockQuantity: z.ZodNumber;
        lowStockThreshold: z.ZodDefault<z.ZodNumber>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        weight: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const productSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        brand: z.ZodString;
        description: z.ZodString;
        price: z.ZodNumber;
        discountPrice: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        costPrice: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        taxPercentage: z.ZodDefault<z.ZodNumber>;
        sku: z.ZodString;
        barcode: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        category: z.ZodString;
        subCategory: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        inventory: z.ZodNumber;
        status: z.ZodEnum<{
            Draft: "Draft";
            "In Stock": "In Stock";
            "Low Stock": "Low Stock";
            "Out of Stock": "Out of Stock";
        }>;
        images: z.ZodArray<z.ZodString>;
        discountPercentage: z.ZodDefault<z.ZodNumber>;
        isDeal: z.ZodDefault<z.ZodBoolean>;
        weight: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        baseUnit: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            ml: "ml";
            g: "g";
            piece: "piece";
            kg: "kg";
            litre: "litre";
            metre: "metre";
            box: "box";
        }>>>;
        sales: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        variants: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            sellingUnit: z.ZodString;
            baseUnitQuantity: z.ZodNumber;
            sku: z.ZodString;
            barcode: z.ZodOptional<z.ZodString>;
            costPrice: z.ZodNumber;
            sellingPrice: z.ZodNumber;
            discountPrice: z.ZodOptional<z.ZodNumber>;
            stockQuantity: z.ZodNumber;
            lowStockThreshold: z.ZodDefault<z.ZodNumber>;
            isDefault: z.ZodDefault<z.ZodBoolean>;
            isActive: z.ZodDefault<z.ZodBoolean>;
            weight: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ProductInput = z.infer<typeof productBodySchema>;
//# sourceMappingURL=product.schema.d.ts.map