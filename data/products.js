const products = [
    {
        name: 'Handcrafted Clay Pot',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description:
            'Beautiful handmade clay pot perfect for indoor plants. Crafted with care using traditional techniques.',
        brand: 'Earthly Crafts',
        category: 'Pottery',
        price: 1200,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
        location: {
            type: 'Point',
            coordinates: [77.209, 28.6139], // New Delhi
        },
    },
    {
        name: 'Ceramic Vase',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Elegant ceramic vase with intricate patterns.',
        brand: 'Earthly Crafts',
        category: 'Pottery',
        price: 2500,
        countInStock: 5,
        rating: 4.8,
        numReviews: 8,
        location: {
            type: 'Point',
            coordinates: [77.209, 28.6139],
        },
    },
    {
        name: 'Terracotta Mug Set',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Set of 4 terracotta mugs, perfect for tea lovers.',
        brand: 'Earthly Crafts',
        category: 'Pottery',
        price: 800,
        countInStock: 20,
        rating: 4.2,
        numReviews: 15,
        location: {
            type: 'Point',
            coordinates: [77.209, 28.6139],
        },
    },
    {
        name: 'Handwoven Silk Scarf',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Luxurious silk scarf woven by skilled artisans.',
        brand: 'Silk Route',
        category: 'Textiles',
        price: 3500,
        countInStock: 8,
        rating: 4.9,
        numReviews: 20,
        location: {
            type: 'Point',
            coordinates: [75.8577, 22.7196], // Indore
        },
    },
    {
        name: 'Cotton Block Print Bedsheet',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Traditional block print bedsheet, 100% cotton.',
        brand: 'Jaipur Prints',
        category: 'Textiles',
        price: 1800,
        countInStock: 15,
        rating: 4.6,
        numReviews: 25,
        location: {
            type: 'Point',
            coordinates: [75.7873, 26.9124], // Jaipur
        },
    },
    {
        name: 'Embroidered Cushion Covers',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Set of 2 embroidered cushion covers with mirror work.',
        brand: 'Kutch Crafts',
        category: 'Textiles',
        price: 900,
        countInStock: 12,
        rating: 4.7,
        numReviews: 10,
        location: {
            type: 'Point',
            coordinates: [69.6693, 23.242], // Bhuj
        },
    },
    {
        name: 'Silver Oxidized Necklace',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Traditional silver oxidized necklace with tribal design.',
        brand: 'Tribal Ornaments',
        category: 'Jewelry',
        price: 1500,
        countInStock: 7,
        rating: 4.4,
        numReviews: 18,
        location: {
            type: 'Point',
            coordinates: [73.8567, 18.5204], // Pune
        },
    },
    {
        name: 'Beaded Bracelet',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Colorful beaded bracelet, handmade with love.',
        brand: 'Boho Chic',
        category: 'Jewelry',
        price: 400,
        countInStock: 30,
        rating: 4.1,
        numReviews: 5,
        location: {
            type: 'Point',
            coordinates: [72.8777, 19.076], // Mumbai
        },
    },
    {
        name: 'Terracotta Earrings',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Hand-painted terracotta earrings, lightweight and trendy.',
        brand: 'Earthly Crafts',
        category: 'Jewelry',
        price: 300,
        countInStock: 25,
        rating: 4.3,
        numReviews: 14,
        location: {
            type: 'Point',
            coordinates: [88.3639, 22.5726], // Kolkata
        },
    },
    {
        name: 'Madhubani Painting',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Authentic Madhubani painting on handmade paper.',
        brand: 'Mithila Art',
        category: 'Paintings',
        price: 5000,
        countInStock: 3,
        rating: 5.0,
        numReviews: 6,
        location: {
            type: 'Point',
            coordinates: [85.324, 25.0961], // Patna
        },
    },
    {
        name: 'Warli Art Wall Hanging',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Traditional Warli art painted on canvas.',
        brand: 'Tribal Strokes',
        category: 'Paintings',
        price: 2200,
        countInStock: 6,
        rating: 4.6,
        numReviews: 9,
        location: {
            type: 'Point',
            coordinates: [72.9612, 20.3893], // Vapi
        },
    },
    {
        name: 'Pattachitra Scroll',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        description: 'Intricate Pattachitra scroll painting depicting mythology.',
        brand: 'Odisha Crafts',
        category: 'Paintings',
        price: 8000,
        countInStock: 2,
        rating: 4.9,
        numReviews: 4,
        location: {
            type: 'Point',
            coordinates: [85.8245, 20.2961], // Bhubaneswar
        },
    },
];

module.exports = products;
