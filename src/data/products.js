// Mock product data with categories and subcategories
export const productData = {
  electronics: {
    phones: [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 79999,
        originalPrice: 89999,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        reviews: 1250,
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        features: ['A17 Pro Chip', '48MP Camera', '5G Connectivity', 'Face ID'],
        inStock: true,
        discount: 11
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24',
        price: 69999,
        originalPrice: 79999,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        reviews: 890,
        description: 'Premium Android phone with AI features and excellent display',
        features: ['Snapdragon 8 Gen 3', '50MP Camera', 'AI Features', '120Hz Display'],
        inStock: true,
        discount: 13
      },
      {
        id: 3,
        name: 'OnePlus 12',
        price: 54999,
        originalPrice: 64999,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.5,
        reviews: 650,
        description: 'Fast charging flagship with premium design',
        features: ['100W Fast Charging', 'Hasselblad Camera', 'OxygenOS', '12GB RAM'],
        inStock: true,
        discount: 15
      }
    ],
    laptops: [
      {
        id: 4,
        name: 'MacBook Pro 14"',
        price: 169999,
        originalPrice: 189999,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        reviews: 2100,
        description: 'Professional laptop with M3 chip for creative professionals',
        features: ['M3 Chip', '16GB RAM', 'Liquid Retina Display', '18hr Battery'],
        inStock: true,
        discount: 11
      },
      {
        id: 5,
        name: 'Dell XPS 13',
        price: 89999,
        originalPrice: 99999,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.4,
        reviews: 780,
        description: 'Ultra-portable laptop with stunning InfinityEdge display',
        features: ['Intel i7', '16GB RAM', '13.4" Display', 'Windows 11'],
        inStock: true,
        discount: 10
      }
    ]
  },
  household: {
    grocery: [
      {
        id: 6,
        name: 'Basmati Rice 5KG',
        price: 899,
        originalPrice: 1099,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.3,
        reviews: 340,
        description: 'Premium quality basmati rice, long grain and aromatic',
        features: ['5KG Pack', 'Premium Quality', 'Long Grain', 'Aromatic'],
        inStock: true,
        discount: 18
      },
      {
        id: 7,
        name: 'Cooking Oil 1L',
        price: 249,
        originalPrice: 299,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.1,
        reviews: 520,
        description: 'Healthy sunflower oil for cooking',
        features: ['1L Bottle', 'Sunflower Oil', 'Heart Healthy', 'No Trans Fat'],
        inStock: true,
        discount: 17
      }
    ],
    dailyNeeds: [
      {
        id: 8,
        name: 'Hand Soap Pack',
        price: 199,
        originalPrice: 249,
        image: 'https://www.bing.com/th?id=OPAC.Rdw5G2YN85aFFA474C474&o=5&pid=21.1&w=128&h=198&rs=1&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF',
        rating: 4.2,
        reviews: 890,
        description: 'Antibacterial hand soap for daily use',
        features: ['Pack of 3', 'Antibacterial', 'Gentle Formula', 'Pleasant Fragrance'],
        inStock: true,
        discount: 20
      },
      {
        id: 9,
        name: 'Toothpaste 150gm',
        price: 89,
        originalPrice: 109,
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.4,
        reviews: 1200,
        description: 'Complete oral care with fluoride protection',
        features: ['150gm Tube', 'Fluoride Protection', 'Fresh Mint', 'Cavity Protection'],
        inStock: true,
        discount: 18
      }
    ]
  },
  fashion: {
    mens: [
      {
        id: 10,
        name: 'Cotton Casual Shirt',
        price: 1299,
        originalPrice: 1799,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.3,
        reviews: 450,
        description: 'Comfortable cotton shirt for casual wear',
        features: ['100% Cotton', 'Regular Fit', 'Machine Wash', 'Breathable Fabric'],
        inStock: true,
        discount: 28
      },
      {
        id: 11,
        name: 'Denim Jeans',
        price: 2499,
        originalPrice: 3499,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.5,
        reviews: 680,
        description: 'Classic blue denim jeans with modern fit',
        features: ['Denim Fabric', 'Modern Fit', 'Blue Wash', 'Durable'],
        inStock: true,
        discount: 29
      }
    ],
    womens: [
      {
        id: 12,
        name: 'Floral Summer Dress',
        price: 1899,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        reviews: 320,
        description: 'Beautiful floral dress perfect for summer occasions',
        features: ['Floral Print', 'Summer Fabric', 'Comfortable Fit', 'Machine Wash'],
        inStock: true,
        discount: 24
      }
    ],
    shoes: [
      {
        id: 13,
        name: 'Running Sports Shoes',
        price: 3999,
        originalPrice: 5999,
        image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-air-max-90-by-you.png',
        rating: 4.7,
        reviews: 890,
        description: 'Lightweight running shoes with advanced cushioning',
        features: ['Lightweight', 'Cushioned Sole', 'Breathable Mesh', 'Anti-Slip'],
        inStock: true,
        discount: 33
      }
    ]
  },
  accessories: {
    phoneAccessories: [
      {
        id: 14,
        name: 'Wireless Phone Charger',
        price: 1999,
        originalPrice: 2999,
        image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MHXH3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1661275650893',
        rating: 4.2,
        reviews: 560,
        description: 'Fast wireless charging pad for all Qi-enabled devices',
        features: ['15W Fast Charging', 'Universal Compatibility', 'LED Indicator', 'Safe Charging'],
        inStock: true,
        discount: 33
      }
    ],
    laptopAccessories: [
      {
        id: 15,
        name: 'Laptop Backpack',
        price: 2499,
        originalPrice: 3499,
        image: 'https://www.bing.com/th?id=OPAC.KlCx1xBAX9cjcQ474C474&o=5&pid=21.1&w=128&h=188&rs=1&qlt=100&dpr=1&o=2&bw=6&bc=FFFFFF',
        rating: 4.5,
        reviews: 420,
        description: 'Professional laptop backpack with multiple compartments',
        features: ['Fits 15.6" Laptop', 'Water Resistant', 'Multiple Pockets', 'Ergonomic Design'],
        inStock: true,
        discount: 29
      }
    ]
  }
};

export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    subCategories: [
      { id: 'phones', name: 'Phones', icon: '📱' },
      { id: 'laptops', name: 'Laptops', icon: '💻' }
    ]
  },
  {
    id: 'household',
    name: 'Household',
    icon: '🏠',
    subCategories: [
      { id: 'grocery', name: 'Grocery', icon: '🛒' },
      { id: 'dailyNeeds', name: 'Daily Needs', icon: '🧴' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👕',
    subCategories: [
      { id: 'mens', name: 'Mens', icon: '👔' },
      { id: 'womens', name: 'Womens', icon: '👗' },
      { id: 'shoes', name: 'Shoes', icon: '👟' }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: '🎒',
    subCategories: [
      { id: 'phoneAccessories', name: 'Phone Accessories', icon: '🔌' },
      { id: 'laptopAccessories', name: 'Laptop Accessories', icon: '🎒' }
    ]
  }
];

// Get trending products from all categories
export const getTrendingProducts = () => {
  const allProducts = [];
  Object.keys(productData).forEach(category => {
    Object.keys(productData[category]).forEach(subCategory => {
      allProducts.push(...productData[category][subCategory]);
    });
  });
  
  // Sort by rating and return top 8
  return allProducts.sort((a, b) => b.rating - a.rating).slice(0, 8);
};
