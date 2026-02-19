export interface Product {
    id: string;
    store: {
        id: string;
        name: string;
        image: string;
    };
    category: string;
    name: string;
    price: number; // e.g. 29.99
    discountPrice?: number; // e.g. 24.99
    image: string; // URL
    rating: number; // e.g. 4.8
    reviews: number; // e.g. 1245
    description?: string;
    stock: number; // 0 = out of stock
    isNew?: boolean; // New arrival
}

export interface FavouriteItem extends Product {
    addedDate: string; // ISO 8601
}
