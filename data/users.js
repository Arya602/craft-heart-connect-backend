const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['admin', 'buyer'],
        bio: 'Administrator of Craft Heart Connect.',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
    {
        username: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['buyer'],
        bio: 'Love handcrafted items!',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    },
    // Textiles Artisan
    {
        username: 'Ravi Kumar',
        email: 'ravi@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Weaving stories into textiles. Specialist in traditional Indian prints.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
        craft: 'Textiles',
        story: 'I come from a family of weavers in Pochampally. For generations, we have been keeping the art of Ikat alive.',
        workshop: {
            name: 'Lakshmi Textiles',
            location: 'Pochampally, Telangana',
            description: 'A traditional loom setup where we dye and weave our own yarns.',
            image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800&auto=format&fit=crop&q=60'
        },
        sellerRequest: { status: 'approved', requestDate: new Date() },
    },
    // Pottery Artisan
    {
        username: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Passionate potter creating unique clay pieces inspired by nature.',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60',
        craft: 'Pottery',
        story: 'I started pottery as a hobby and fell in love with the tactile nature of clay. Now I run a small studio.',
        workshop: {
            name: 'Earthly Crafts',
            location: 'Jaipur, Rajasthan',
            description: 'A sunny studio with 3 wheels and a kiln.',
            image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=60'
        },
        sellerRequest: { status: 'approved', requestDate: new Date() },
    },
    // Woodwork Artisan
    {
        username: 'Mohan Lal',
        email: 'mohan@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Carving dreams out of wood. Expert in Channapatna toys.',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60',
        craft: 'Woodwork',
        story: 'My father taught me how to turn wood when I was 10. I use safe vegetable dyes for my toys.',
        workshop: {
            name: 'Ravi Crafts',
            location: 'Channapatna, Karnataka',
            description: 'A small workshop filled with the smell of sandalwood and lacquer.',
            image: 'https://images.unsplash.com/photo-1615876063860-d971f6dca5dc?w=800&auto=format&fit=crop&q=60'
        },
        sellerRequest: { status: 'approved', requestDate: new Date() },
    },
    // Jewelry Artisan
    {
        username: 'Priya Sharma',
        email: 'priya@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Jewelry designer blending modern aesthetics with traditional techniques.',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60',
        craft: 'Jewelry',
        story: 'I love working with silver and semi-precious stones to create statement pieces.',
        workshop: {
            name: 'Meera Designs',
            location: 'Jaipur, Rajasthan',
            description: 'A cozy studio in the heart of the Pink City.',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=60'
        },
        sellerRequest: { status: 'approved', requestDate: new Date() },
    },
    // Paintings Artisan
    {
        username: 'Amit Patel',
        email: 'amit@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Bringing folk art to life on canvas. Madhubani and Warli artist.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
        craft: 'Paintings',
        story: 'Art is my meditation. I paint stories from Indian mythology.',
        workshop: {
            name: 'Mithila Art',
            location: 'Madhubani, Bihar',
            description: 'My home studio where I teach local children.',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60'
        },
        sellerRequest: { status: 'approved', requestDate: new Date() },
    },
    // Metalwork Artisan
    {
        username: 'Suresh Gupta',
        email: 'suresh@example.com',
        password: bcrypt.hashSync('123456', 10),
        roles: ['seller', 'buyer'],
        bio: 'Master of brass and copper artifacts.',
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60',
        craft: 'Metalwork',
        story: 'Metalwork requires patience and strength. I make traditional lamps and vessels.',
        workshop: {
            name: 'Golden Hands',
            location: 'Moradabad, Uttar Pradesh',
            description: 'A busy workshop with furnaces and casting molds.',
            image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&auto=format&fit=crop&q=60'
        },
        sellerRequest: { status: 'approved', requestDate: new Date() },
    },
];

module.exports = users;
