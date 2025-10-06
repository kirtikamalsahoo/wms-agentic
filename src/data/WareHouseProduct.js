const warehouseProducts = [
  {
    "product_id": 1,
    "product_name": "iPhone 14 Pro",
    "category": "Electronics",
    "sub_category": "Phones",
    "brand": "Apple",
    "description": "Latest iPhone with A16 Bionic chip",
    "color": "Black",
    "price": 129999,
    "stock": 50,
    "reorder_level": 5,
    "tags": {
      "5G": true,
      "storage": "128GB"
    },
    "popularity_score": 90,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 2,
    "product_name": "Samsung Galaxy S23",
    "category": "Electronics",
    "sub_category": "Phones",
    "brand": "Samsung",
    "description": "Flagship Android phone with Snapdragon 8 Gen 2",
    "color": "Green",
    "price": 74999,
    "stock": 60,
    "reorder_level": 5,
    "tags": {
      "5G": true,
      "storage": "256GB"
    },
    "popularity_score": 85,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 3,
    "product_name": "OnePlus 11R",
    "category": "Electronics",
    "sub_category": "Phones",
    "brand": "OnePlus",
    "description": "High performance phone with OxygenOS",
    "color": "Gray",
    "price": 44999,
    "stock": 80,
    "reorder_level": 10,
    "tags": {
      "5G": true,
      "storage": "128GB"
    },
    "popularity_score": 75,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 4,
    "product_name": "Google Pixel 7",
    "category": "Electronics",
    "sub_category": "Phones",
    "brand": "Google",
    "description": "Pixel with Tensor G2 and great camera",
    "color": "White",
    "price": 59999,
    "stock": 40,
    "reorder_level": 5,
    "tags": {
      "5G": true,
      "storage": "128GB"
    },
    "popularity_score": 70,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 5,
    "product_name": "Redmi Note 12 Pro",
    "category": "Electronics",
    "sub_category": "Phones",
    "brand": "Xiaomi",
    "description": "Affordable mid-range 5G phone",
    "color": "Blue",
    "price": 24999,
    "stock": 100,
    "reorder_level": 15,
    "tags": {
      "5G": true,
      "storage": "128GB"
    },
    "popularity_score": 65,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 6,
    "product_name": "MacBook Air M2",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "Apple",
    "description": "Lightweight laptop with M2 chip",
    "color": "Silver",
    "price": 114999,
    "stock": 30,
    "reorder_level": 5,
    "tags": {
      "ram": "8GB",
      "storage": "256GB"
    },
    "popularity_score": 88,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 7,
    "product_name": "Dell XPS 13",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "Dell",
    "description": "Premium ultrabook with Intel i7",
    "color": "Black",
    "price": 99999,
    "stock": 25,
    "reorder_level": 5,
    "tags": {
      "ram": "16GB",
      "storage": "512GB"
    },
    "popularity_score": 82,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 8,
    "product_name": "HP Spectre x360",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "HP",
    "description": "Convertible laptop with touchscreen",
    "color": "Blue",
    "price": 89999,
    "stock": 40,
    "reorder_level": 5,
    "tags": {
      "ram": "16GB",
      "storage": "512GB"
    },
    "popularity_score": 78,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 9,
    "product_name": "Lenovo ThinkPad X1 Carbon",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "Lenovo",
    "description": "Business laptop with durability",
    "color": "Black",
    "price": 119999,
    "stock": 20,
    "reorder_level": 5,
    "tags": {
      "ram": "16GB",
      "storage": "1TB"
    },
    "popularity_score": 84,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 10,
    "product_name": "Asus ROG Zephyrus G14",
    "category": "Electronics",
    "sub_category": "Laptop",
    "brand": "Asus",
    "description": "Gaming laptop with Ryzen 9 and RTX 4070",
    "color": "Gray",
    "price": 139999,
    "stock": 15,
    "reorder_level": 5,
    "tags": {
      "gpu": "RTX 4070",
      "ram": "32GB"
    },
    "popularity_score": 92,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 11,
    "product_name": "Basmati Rice 5kg",
    "category": "Household",
    "sub_category": "Grocery",
    "brand": "IndiaGate",
    "description": "Premium quality long grain basmati rice",
    "color": "White",
    "price": 599,
    "stock": 200,
    "reorder_level": 20,
    "tags": {
      "type": "staple",
      "weight": "5kg"
    },
    "popularity_score": 60,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 12,
    "product_name": "Wheat Flour 10kg",
    "category": "Household",
    "sub_category": "Grocery",
    "brand": "Aashirvaad",
    "description": "Whole wheat flour for daily use",
    "color": "Brown",
    "price": 499,
    "stock": 180,
    "reorder_level": 20,
    "tags": {
      "type": "staple",
      "weight": "10kg"
    },
    "popularity_score": 55,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 13,
    "product_name": "Toor Dal 2kg",
    "category": "Household",
    "sub_category": "Grocery",
    "brand": "Tata Sampann",
    "description": "Protein-rich split pigeon peas",
    "color": "Yellow",
    "price": 399,
    "stock": 150,
    "reorder_level": 15,
    "tags": {
      "type": "pulses",
      "weight": "2kg"
    },
    "popularity_score": 50,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 14,
    "product_name": "Sunflower Oil 1L",
    "category": "Household",
    "sub_category": "Grocery",
    "brand": "Fortune",
    "description": "Refined sunflower cooking oil",
    "color": "Yellow",
    "price": 150,
    "stock": 220,
    "reorder_level": 25,
    "tags": {
      "type": "oil",
      "volume": "1L"
    },
    "popularity_score": 65,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 15,
    "product_name": "Sugar 5kg",
    "category": "Household",
    "sub_category": "Grocery",
    "brand": "Madhur",
    "description": "Refined sugar for household use",
    "color": "White",
    "price": 350,
    "stock": 170,
    "reorder_level": 20,
    "tags": {
      "type": "staple",
      "weight": "5kg"
    },
    "popularity_score": 52,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 16,
    "product_name": "Colgate Toothpaste 200g",
    "category": "Household",
    "sub_category": "Daily Needs",
    "brand": "Colgate",
    "description": "Anti-cavity toothpaste",
    "color": "White",
    "price": 120,
    "stock": 250,
    "reorder_level": 30,
    "tags": {
      "type": "toiletries"
    },
    "popularity_score": 70,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 17,
    "product_name": "Dettol Handwash 500ml",
    "category": "Household",
    "sub_category": "Daily Needs",
    "brand": "Dettol",
    "description": "Antiseptic liquid handwash",
    "color": "Green",
    "price": 99,
    "stock": 300,
    "reorder_level": 40,
    "tags": {
      "type": "toiletries"
    },
    "popularity_score": 72,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 18,
    "product_name": "Surf Excel 2kg",
    "category": "Household",
    "sub_category": "Daily Needs",
    "brand": "Unilever",
    "description": "Powerful stain remover detergent powder",
    "color": "Blue",
    "price": 450,
    "stock": 180,
    "reorder_level": 20,
    "tags": {
      "type": "detergent"
    },
    "popularity_score": 68,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 19,
    "product_name": "Harpic Toilet Cleaner 1L",
    "category": "Household",
    "sub_category": "Daily Needs",
    "brand": "Reckitt",
    "description": "Powerful toilet cleaner liquid",
    "color": "Blue",
    "price": 180,
    "stock": 140,
    "reorder_level": 15,
    "tags": {
      "type": "cleaning"
    },
    "popularity_score": 64,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 20,
    "product_name": "Lifebuoy Soap Pack of 4",
    "category": "Household",
    "sub_category": "Daily Needs",
    "brand": "Lifebuoy",
    "description": "Germ protection bathing soap",
    "color": "Red",
    "price": 160,
    "stock": 200,
    "reorder_level": 20,
    "tags": {
      "type": "soap"
    },
    "popularity_score": 66,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 21,
    "product_name": "Men T-Shirt",
    "category": "Fashion",
    "sub_category": "Mens",
    "brand": "Nike",
    "description": "Comfortable cotton T-shirt",
    "color": "Black",
    "price": 1999,
    "stock": 100,
    "reorder_level": 10,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 75,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 22,
    "product_name": "Men Jeans",
    "category": "Fashion",
    "sub_category": "Mens",
    "brand": "Levis",
    "description": "Slim fit denim jeans",
    "color": "Blue",
    "price": 3999,
    "stock": 80,
    "reorder_level": 10,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 78,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 23,
    "product_name": "Men Formal Shirt",
    "category": "Fashion",
    "sub_category": "Mens",
    "brand": "Van Heusen",
    "description": "Formal cotton shirt for office",
    "color": "White",
    "price": 2999,
    "stock": 70,
    "reorder_level": 10,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 72,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 24,
    "product_name": "Men Jacket",
    "category": "Fashion",
    "sub_category": "Mens",
    "brand": "Adidas",
    "description": "Stylish winter jacket",
    "color": "Gray",
    "price": 4999,
    "stock": 50,
    "reorder_level": 5,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 80,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 25,
    "product_name": "Men Sneakers",
    "category": "Fashion",
    "sub_category": "Mens",
    "brand": "Puma",
    "description": "Comfortable casual sneakers",
    "color": "White",
    "price": 3499,
    "stock": 90,
    "reorder_level": 10,
    "tags": {
      "type": "shoes"
    },
    "popularity_score": 85,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 26,
    "product_name": "Women Kurti",
    "category": "Fashion",
    "sub_category": "Womens",
    "brand": "Biba",
    "description": "Stylish cotton kurti",
    "color": "Pink",
    "price": 2499,
    "stock": 100,
    "reorder_level": 10,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 74,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 27,
    "product_name": "Women Saree",
    "category": "Fashion",
    "sub_category": "Womens",
    "brand": "FabIndia",
    "description": "Elegant silk saree",
    "color": "Red",
    "price": 5999,
    "stock": 60,
    "reorder_level": 5,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 85,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 28,
    "product_name": "Women Top",
    "category": "Fashion",
    "sub_category": "Womens",
    "brand": "Zara",
    "description": "Trendy casual top",
    "color": "Blue",
    "price": 1999,
    "stock": 90,
    "reorder_level": 10,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 70,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 29,
    "product_name": "Women Dress",
    "category": "Fashion",
    "sub_category": "Womens",
    "brand": "H&M",
    "description": "Chic evening dress",
    "color": "Black",
    "price": 3999,
    "stock": 80,
    "reorder_level": 10,
    "tags": {
      "type": "clothing"
    },
    "popularity_score": 82,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 30,
    "product_name": "Women Heels",
    "category": "Fashion",
    "sub_category": "Womens",
    "brand": "Catwalk",
    "description": "Stylish high heels",
    "color": "Red",
    "price": 2999,
    "stock": 70,
    "reorder_level": 5,
    "tags": {
      "type": "shoes"
    },
    "popularity_score": 77,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 31,
    "product_name": "Running Shoes",
    "category": "Fashion",
    "sub_category": "Shoes",
    "brand": "Nike",
    "description": "Lightweight running shoes",
    "color": "Blue",
    "price": 4999,
    "stock": 100,
    "reorder_level": 10,
    "tags": {
      "type": "sports"
    },
    "popularity_score": 85,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 32,
    "product_name": "Casual Sneakers",
    "category": "Fashion",
    "sub_category": "Shoes",
    "brand": "Adidas",
    "description": "Everyday casual sneakers",
    "color": "White",
    "price": 3499,
    "stock": 120,
    "reorder_level": 15,
    "tags": {
      "type": "casual"
    },
    "popularity_score": 80,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 33,
    "product_name": "Formal Shoes",
    "category": "Fashion",
    "sub_category": "Shoes",
    "brand": "Bata",
    "description": "Leather formal shoes for office wear",
    "color": "Black",
    "price": 2999,
    "stock": 90,
    "reorder_level": 10,
    "tags": {
      "type": "formal"
    },
    "popularity_score": 70,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 34,
    "product_name": "High Heels",
    "category": "Fashion",
    "sub_category": "Shoes",
    "brand": "Metro",
    "description": "Elegant high heel shoes",
    "color": "Red",
    "price": 3999,
    "stock": 70,
    "reorder_level": 5,
    "tags": {
      "type": "party"
    },
    "popularity_score": 75,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 35,
    "product_name": "Sports Shoes",
    "category": "Fashion",
    "sub_category": "Shoes",
    "brand": "Reebok",
    "description": "Durable sports shoes",
    "color": "Gray",
    "price": 4499,
    "stock": 85,
    "reorder_level": 10,
    "tags": {
      "type": "sports"
    },
    "popularity_score": 78,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 36,
    "product_name": "iPhone Case",
    "category": "Accessories",
    "sub_category": "Phone",
    "brand": "Spigen",
    "description": "Protective case for iPhone 14",
    "color": "Black",
    "price": 1499,
    "stock": 200,
    "reorder_level": 20,
    "tags": {
      "type": "case"
    },
    "popularity_score": 68,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 37,
    "product_name": "Samsung Charger",
    "category": "Accessories",
    "sub_category": "Phone",
    "brand": "Samsung",
    "description": "Fast charging adapter",
    "color": "White",
    "price": 1999,
    "stock": 150,
    "reorder_level": 10,
    "tags": {
      "type": "charger"
    },
    "popularity_score": 72,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 38,
    "product_name": "OnePlus Earbuds",
    "category": "Accessories",
    "sub_category": "Phone",
    "brand": "OnePlus",
    "description": "Wireless earbuds with noise cancellation",
    "color": "Black",
    "price": 4999,
    "stock": 100,
    "reorder_level": 10,
    "tags": {
      "type": "earbuds"
    },
    "popularity_score": 80,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 39,
    "product_name": "Redmi Power Bank 10000mAh",
    "category": "Accessories",
    "sub_category": "Phone",
    "brand": "Xiaomi",
    "description": "Portable power bank with fast charging",
    "color": "Blue",
    "price": 2499,
    "stock": 120,
    "reorder_level": 15,
    "tags": {
      "type": "powerbank"
    },
    "popularity_score": 74,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 40,
    "product_name": "Pixel Screen Protector",
    "category": "Accessories",
    "sub_category": "Phone",
    "brand": "Google",
    "description": "Tempered glass screen protector",
    "color": "Transparent",
    "price": 999,
    "stock": 180,
    "reorder_level": 20,
    "tags": {
      "type": "protector"
    },
    "popularity_score": 66,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 41,
    "product_name": "Laptop Sleeve 15.6\"",
    "category": "Accessories",
    "sub_category": "Laptop",
    "brand": "AmazonBasics",
    "description": "Protective laptop sleeve",
    "color": "Black",
    "price": 1299,
    "stock": 200,
    "reorder_level": 20,
    "tags": {
      "type": "sleeve"
    },
    "popularity_score": 65,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 42,
    "product_name": "Dell Docking Station",
    "category": "Accessories",
    "sub_category": "Laptop",
    "brand": "Dell",
    "description": "Universal docking station for laptops",
    "color": "Black",
    "price": 8999,
    "stock": 50,
    "reorder_level": 5,
    "tags": {
      "type": "dock"
    },
    "popularity_score": 78,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 43,
    "product_name": "HP Laptop Bag",
    "category": "Accessories",
    "sub_category": "Laptop",
    "brand": "HP",
    "description": "Durable laptop backpack",
    "color": "Gray",
    "price": 2999,
    "stock": 100,
    "reorder_level": 10,
    "tags": {
      "type": "bag"
    },
    "popularity_score": 70,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 44,
    "product_name": "Lenovo Wireless Mouse",
    "category": "Accessories",
    "sub_category": "Laptop",
    "brand": "Lenovo",
    "description": "Ergonomic wireless mouse",
    "color": "Black",
    "price": 1499,
    "stock": 150,
    "reorder_level": 10,
    "tags": {
      "type": "mouse"
    },
    "popularity_score": 72,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  },
  {
    "product_id": 45,
    "product_name": "Asus Cooling Pad",
    "category": "Accessories",
    "sub_category": "Laptop",
    "brand": "Asus",
    "description": "Cooling pad with dual fans",
    "color": "Blue",
    "price": 1999,
    "stock": 120,
    "reorder_level": 15,
    "tags": {
      "type": "cooling"
    },
    "popularity_score": 74,
    "created_at": "2025-09-22T03:58:51.610297",
    "updated_at": "2025-09-22T03:58:51.610297"
  }
];

export default warehouseProducts;