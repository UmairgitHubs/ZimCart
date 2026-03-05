import { Mart } from '@/types/customer';

export const QUICK_LINKS = [
    { id: 1, name: 'Offers', icon: 'tag-outline', color: '#ffecf2', iconColor: '#e11d48' },
    { id: 2, name: 'Marts', icon: 'storefront-outline', color: '#ecfdf5', iconColor: '#059669' },
    { id: 3, name: 'New In', icon: 'star-outline', color: '#fff7ed', iconColor: '#ea580c' },
    { id: 4, name: 'Pickup', icon: 'shopping-outline', color: '#eff6ff', iconColor: '#2563eb' },
];

export const CATEGORY_CIRCLES = [
    { id: '1', name: 'Grocery', image: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png' },
    { id: '2', name: 'Tech', image: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png' },
    { id: '3', name: 'Fashion', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050253.png' },
    { id: '4', name: 'Beauty', image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png' },
    { id: '5', name: 'Home', image: 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png' },
    { id: '6', name: 'Pet Care', image: 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png' },
];

export const PROMO_CARDS = [
    { 
        id: '1', 
        title: 'Super\nTech Sale', 
        subtitle: 'Up to 30% off', 
        color: '#f472b6', // Pinkish
        image: 'https://cdn-icons-png.flaticon.com/512/2972/2972382.png',
        brandLogo: 'https://cdn-icons-png.flaticon.com/512/732/732221.png'
    },
    { 
        id: '2', 
        title: 'Grocery\nBundle', 
        subtitle: 'Free Delivery', 
        color: '#fb923c', // Orange
        image: 'https://cdn-icons-png.flaticon.com/512/1625/1625048.png', 
        brandLogo: 'https://cdn-icons-png.flaticon.com/512/891/891462.png' 
    },
    { 
        id: '3', 
        title: 'Fashion\nWeek', 
        subtitle: 'Flat 50%', 
        color: '#60a5fa', // Blue
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050239.png',
        brandLogo: 'https://cdn-icons-png.flaticon.com/512/1040/1040225.png'
    },
];

export const STORES: Mart[] = [
    {
      id: "1",
      name: "Mega Hypermarket",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop",
      rating: 4.8,
      deliveryTime: "30-45 min",
      deliveryFee: "Free",
      minOrder: "Rs. 1000",
      tags: ["Groceries", "Electronics", "Home"],
    },
    {
      id: "2",
      name: "TechWorld Express",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop",
      rating: 4.7,
      deliveryTime: "45-60 min",
      deliveryFee: "Rs. 200",
      minOrder: "Rs. 5000",
      tags: ["Mobiles", "Laptops", "Gadgets"],
    },
    {
      id: "3",
      name: "Style Avenue",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
      rating: 4.5,
      deliveryTime: "25-40 min",
      deliveryFee: "Rs. 150",
      minOrder: "Rs. 3000",
      tags: ["Clothing", "Shoes", "Accessories"],
    },
];

export const DAILY_DEALS = [
    { id: '1', name: 'Whole Chicken', mart: 'Fresh Meat', price: 'Rs. 450', oldPrice: 'Rs. 600', discount: '25%', image: 'https://images.unsplash.com/photo-1587593810167-a6b06800aa43?q=80&w=400&auto=format&fit=crop', time: '30 min' },
    { id: '2', name: 'Bananas (1 Doz)', mart: 'Green Valley', price: 'Rs. 150', oldPrice: 'Rs. 200', discount: '20%', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86279?q=80&w=400&auto=format&fit=crop', time: '15 min' },
    { id: '3', name: 'Surf Excel 1kg', mart: 'Hyperstar', price: 'Rs. 450', oldPrice: 'Rs. 500', discount: '10%', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=400&auto=format&fit=crop', time: '40 min' },
];

export const TOP_BRANDS = [
    { id: '1', name: 'Nestlé', time: '15-25 min', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png' },
    { id: '2', name: 'P&G', time: '20-30 min', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968361.png' },
    { id: '3', name: 'Unilever', time: '25-40 min', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968379.png' },
    { id: '4', name: 'Pepsi', time: '10-20 min', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968366.png' }, 
];

export const AISLES = [
    { id: '1', name: 'Fruits & Veg', color: '#ecfccb', image: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png' },
    { id: '2', name: 'Meats', color: '#fee2e2', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png' },
    { id: '3', name: 'Dairy', color: '#fff7ed', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050253.png' },
    { id: '4', name: 'Bakery', color: '#fef9c3', image: 'https://cdn-icons-png.flaticon.com/512/992/992747.png' },
    { id: '5', name: 'Pet Care', color: '#fff7ed', image: 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png' },
];

export const FRESH_ARRIVALS = [
    { id: '1', name: 'Organic Honey 500g', store: 'Nature Store', price: 'Rs. 850', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400&auto=format&fit=crop', category: 'Organic' },
    { id: '2', name: 'Greek Yogurt 1kg', store: 'Dairy King', price: 'Rs. 320', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop', category: 'Dairy' },
    { id: '3', name: 'Sourdough Bread', store: 'Artisan Bakery', price: 'Rs. 400', image: 'https://images.unsplash.com/photo-1585476644321-b97621c8a16d?q=80&w=400&auto=format&fit=crop', category: 'Bakery' },
    { id: '4', name: 'Organic Kale 250g', store: 'Urban Farms', price: 'Rs. 150', image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?q=80&w=400&auto=format&fit=crop', category: 'Organic' },
    { id: '5', name: 'Almond Milk 1L', store: 'Healthy Life', price: 'Rs. 580', image: 'https://images.unsplash.com/photo-1550583726-226ff22580fc?q=80&w=400&auto=format&fit=crop', category: 'Dairy' },
];

export const SHOP_CATEGORIES = [
    { id: '1', name: 'Meat & Poultry', items: '12 Stores', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'Bakery & Cake', items: '8 Stores', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop' },
    { id: '3', name: 'Dairy & Eggs', items: '5 Stores', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=400&auto=format&fit=crop' },
    { id: '4', name: 'Fruits & Veg', items: '15 Stores', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop' },
    { id: '5', name: 'Pet Care', items: '7 Stores', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=400&auto=format&fit=crop' },
];

export const RECOMMENDED_PRODUCTS = [
    { id: '1', name: 'Fresh Whole Milk 1L', weight: '1 Litre', price: 'Rs. 220', oldPrice: 'Rs. 240', image: 'https://images.unsplash.com/photo-1635436322965-48ff2c6b17ce?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'Brown Bread Large', weight: '800g', price: 'Rs. 180', oldPrice: 'Rs. 200', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' },
    { id: '3', name: 'Farm Fresh Eggs', weight: '1 Dozen', price: 'Rs. 350', oldPrice: 'Rs. 380', image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?q=80&w=400&auto=format&fit=crop' },
    { id: '4', name: 'Basmati Rice Premium', weight: '5 kg', price: 'Rs. 1800', oldPrice: 'Rs. 2000', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop' },
    { id: '5', name: 'Lays Masala Chips', weight: '100g', price: 'Rs. 100', oldPrice: '', image: 'https://images.unsplash.com/photo-1566478919030-26d9e5473e65?q=80&w=400&auto=format&fit=crop' }, // Generic chips
    { id: '6', name: 'Coca Cola Regular', weight: '1.5 Litre', price: 'Rs. 140', oldPrice: 'Rs. 150', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
];

export const EXPLORE_MARTS = [
    {
        id: '1',
        name: 'Grocery Plus - Blue Area',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop', // Burger equivalent
        rating: 4.8,
        ratingCount: '(500+)',
        time: '30-45 min',
        tags: ['Groceries', 'Bakery', 'Fresh'],
        delivery: 'Free for first order',
        deliveryStrike: 'Rs. 199',
        promos: ['Rs. 700 off Rs. 700', '50% off Rs. 499: pehlaorder'],
        isAd: true
    },
    {
        id: '2',
        name: 'Al-Fatah Electronics',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        ratingCount: '(1k+)',
        time: '45-60 min',
        tags: ['Electronics', 'Home', 'Gadgets'],
        delivery: 'Rs. 99',
        promos: ['Flat 20% off'],
        isAd: false
    },
    {
        id: '3',
        name: 'Green Leaf Organics',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        ratingCount: '(200+)',
        time: '15-25 min',
        tags: ['Organic', 'Veg', 'Fruits'],
        delivery: 'Free delivery',
        promos: [],
        isAd: false
    },
];
