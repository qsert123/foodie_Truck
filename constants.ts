import { Product } from './types';

export const PRODUCTS: Product[] = [
  // --- SAVOURY ---
  {
    id: 's1',
    name: 'Chicken Strips',
    price: 100.00,
    weight: '4 pcs',
    image: 'https://drive.google.com/file/d/1HkdWmqEfvp5I2gh8oE-lvL_6uLxOBoIA/view?usp=sharing',
    category: 'savoury',
    isHot: true,
    ingredients: ['Broasted chicken breast', 'Secret spice blend', 'Garlic dip']
  },
  {
    id: 's2',
    name: 'Loaded Fries',
    price: 10.00,
    weight: 'Large',
    image: 'images/savoury/loadedFries.jpeg',
    category: 'savoury',
    ingredients: ['Crispy fries', 'Cheddar cheese sauce', 'Jalapenos', 'Bacon bits', 'Ranch']
  },
  {
    id: 's3',
    name: 'Hamburger',
    price: 14.00,
    weight: 'Single',
    image: 'images/savoury/hamburger.jpeg',
    category: 'savoury',
    ingredients: ['Beef patty', 'Lettuce', 'Tomato', 'Onion', 'House sauce']
  },
  {
    id: 's4',
    name: 'Nashville Burger',
    price: 16.00,
    weight: 'Spicy',
    image: 'images/savoury/nashville (2).jpeg',
    category: 'savoury',
    isNew: true,
    ingredients: ['Spicy fried chicken', 'Coleslaw', 'Pickles', 'Brioche bun']
  },
  {
    id: 's5',
    name: 'Classic Burger',
    price: 13.00,
    weight: 'Regular',
    image: 'images/savoury/classicBurger.jpeg',
    category: 'savoury',
    ingredients: ['Grilled chicken patty', 'Cheese', 'Lettuce', 'Mayo']
  },
  {
    id: 's6',
    name: 'Street Tacos',
    price: 11.00,
    weight: '3 pcs',
    image: 'images/savoury/tacos.jpeg',
    category: 'savoury',
    ingredients: ['Soft corn tortilla', 'Seasoned beef', 'Cilantro', 'Onion', 'Lime']
  },
  {
    id: 's7',
    name: 'Loaded Chips',
    price: 9.00,
    weight: 'Bowl',
    image: 'images/savoury/loadedChips.jpeg',
    category: 'savoury',
    ingredients: ['Potato chips', 'Melted cheese', 'Salsa', 'Sour cream']
  },

  // --- DESSERTS ---
  {
    id: 'd1',
    name: 'Triple Choc Brownie',
    price: 6.00,
    weight: '1 pc',
    image: 'images/Desserts/brownieTriple.jpeg',
    category: 'dessert',
    isHot: true,
    ingredients: ['Dark chocolate', 'Milk chocolate', 'White chocolate chunks']
  },
  {
    id: 'd2',
    name: 'Classic Brownie',
    price: 5.00,
    weight: '1 pc',
    image: 'images/Desserts/brownieClassic.jpeg',
    category: 'dessert'
  },
  {
    id: 'd3',
    name: 'Nutella Brownie',
    price: 6.50,
    weight: '1 pc',
    image: 'images/Desserts/Nutella Brownie.jpeg',
    category: 'dessert',
    ingredients: ['Fudgy brownie', 'Nutella swirl', 'Hazelnuts']
  },
  {
    id: 'd4',
    name: 'Lotus Biscoff Brownie',
    price: 6.50,
    weight: '1 pc',
    image: 'images/Desserts/Lotus Biscoff Brownie.jpeg',
    category: 'dessert',
    isNew: true,
    ingredients: ['Brownie base', 'Lotus Biscoff spread', 'Biscoff crumbs']
  },
  {
    id: 'd5',
    name: 'Rose Tres Leches',
    price: 8.00,
    weight: 'Slice',
    image: 'images/Desserts/rose cheesecake.jpeg',
    category: 'dessert',
    ingredients: ['Sponge cake', 'Rose milk soak', 'Whipped cream', 'Pistachios']
  },
  {
    id: 'd6',
    name: 'Badam Tres Leches',
    price: 8.00,
    weight: 'Slice',
    image: 'images/Desserts/The Best Tres Leches Cake Recipe.jpeg',
    category: 'dessert',
    ingredients: ['Sponge cake', 'Almond milk soak', 'Toasted almonds']
  },
  {
    id: 'd7',
    name: 'Lava Cup Triple Choc',
    price: 7.00,
    weight: 'Cup',
    image: 'images/Desserts/lava_cup.jpeg',
    category: 'dessert',
    isHot: true
  },
  {
    id: 'd8',
    name: 'Classic Lava Cup',
    price: 6.50,
    weight: 'Cup',
    image: 'images/Desserts/Classic Lava Cup.jpeg',
    category: 'dessert',
    isHot: true
  },

  // --- JUICE ---
  {
    id: 'j1',
    name: 'Green Apple Mojito',
    price: 5.00,
    weight: '400ml',
    image: 'images/juice/mojitoGreen.jpeg',
    category: 'juice',
    ingredients: ['Green apple syrup', 'Mint', 'Lime', 'Soda']
  },
  {
    id: 'j2',
    name: 'Blue Curacao Mojito',
    price: 5.00,
    weight: '400ml',
    image: 'images/juice/mojitoBlue.jpeg',
    category: 'juice',
    isNew: true,
    ingredients: ['Blue Curacao', 'Lemon', 'Mint', 'Soda']
  },
  {
    id: 'j3',
    name: 'Watermelon Mojito',
    price: 5.00,
    weight: '400ml',
    image: 'images/juice/mojitoWatermelon.jpeg',
    category: 'juice',
    ingredients: ['Fresh watermelon', 'Mint', 'Lime', 'Sparkling water']
  },
  {
    id: 'j4',
    name: 'Classic Cola',
    price: 3.00,
    weight: '330ml',
    image: 'images/juice/cola.jpeg',
    category: 'juice'
  },
  {
    id: 'j5',
    name: 'Classic Cola',
    price: 20,
    weight: '500ml',
    image: 'images/juice/cola.jpeg',
    category: 'juice',
    isNew: true,
  }
];

export const NAV_LINKS = [
  { name: 'Menu', href: '#menu' },
  { name: 'Location', href: '#locations' },
  { name: 'Contact', href: '#contacts' },
];