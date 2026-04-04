const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewellify', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected for Seeding (Jewellify)'))
    .catch(err => console.log(err));

const products = [
    {
        "name": "Diamond Solitaire Ring",
        "description": "Elegant 1-carat diamond ring in 18k white gold.",
        "price": 938,
        "category": "Rings",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&w=600&q=80",
        "rating": 4.9,
        "stock": true
    },
    {
        "name": "Pearl Drop Earrings",
        "description": "Classic freshwater pearl earrings with silver posts.",
        "price": 150,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
        "rating": 4.5,
        "stock": true
    },
    {
        "name": "Gold Chain Necklace",
        "description": "14k solid gold minimalist chain necklace.",
        "price": 312,
        "category": "Necklaces",
        "image": "https://images.unsplash.com/photo-1599643478514-4a420ee9db25?auto=format&fit=crop&w=600&q=80",
        "rating": 4.8,
        "stock": true
    },
    {
        "name": "Sapphire Pendant",
        "description": "Deep blue sapphire pendant on a platinum chain.",
        "price": 562,
        "category": "Necklaces",
        "image": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80",
        "rating": 4.7,
        "stock": true
    },
    {
        "name": "Tennis Bracelet",
        "description": "Sparkling diamond tennis bracelet in white gold.",
        "price": 1188,
        "category": "Bracelets",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
        "rating": 4.9,
        "stock": true
    },
    {
        "name": "Ruby Stud Earrings",
        "description": "Vibrant ruby gemstones set in 18k yellow gold.",
        "price": 400,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1579960488661-f3b190f84cb7?auto=format&fit=crop&w=600&q=80",
        "rating": 4.6,
        "stock": true
    },
    {
        "name": "Rose Gold Bangle",
        "description": "Sleek and modern rose gold bangle bracelet.",
        "price": 225,
        "category": "Bracelets",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
        "rating": 4.4,
        "stock": true
    },
    {
        "name": "Emerald Cut Engagement Ring",
        "description": "Stunning emerald-cut diamond engagement ring.",
        "price": 1500,
        "category": "Rings",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&w=600&q=80",
        "rating": 4.9,
        "stock": true
    },
    {
        "name": "Silver Hoop Earrings",
        "description": "Simple and elegant sterling silver hoop earrings.",
        "price": 56,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
        "rating": 4.3,
        "stock": true
    },
    {
        "name": "Platinum Wedding Band",
        "description": "Classic platinum wedding band with a polished finish.",
        "price": 438,
        "category": "Rings",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&w=600&q=80",
        "rating": 4.7,
        "stock": true
    },
    {
        "name": "Amethyst Necklace",
        "description": "Beautiful purple amethyst gemstone necklace.",
        "price": 194,
        "category": "Necklaces",
        "image": "https://images.unsplash.com/photo-1599643478514-4a420ee9db25?auto=format&fit=crop&w=600&q=80",
        "rating": 4.5,
        "stock": true
    },
    {
        "name": "Charm Bracelet",
        "description": "Customizable silver charm bracelet.",
        "price": 106,
        "category": "Bracelets",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
        "rating": 4.6,
        "stock": true
    },
    {
        "name": "Diamond Drop Earrings",
        "description": "Exquisite diamond drop earrings for special occasions.",
        "price": 1062,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
        "rating": 4.9,
        "stock": false
    },
    {
        "name": "Twisted Vine Ring",
        "description": "Intricate 18k rose gold ring with a delicate twisted vine design and tiny pavé diamonds.",
        "price": 688,
        "category": "Rings",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&w=600&q=80",
        "rating": 4.8,
        "stock": true
    },
    {
        "name": "Black Diamond Ring",
        "description": "Bold 1.5-carat black diamond set in blackened 18k white gold for a dramatic statement.",
        "price": 1225,
        "category": "Rings",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&w=600&q=80",
        "rating": 4.7,
        "stock": true
    },
    {
        "name": "Moonstone Stackable Ring",
        "description": "Ethereal rainbow moonstone set in a thin sterling silver band, perfect for stacking.",
        "price": 122,
        "category": "Rings",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&w=600&q=80",
        "rating": 4.5,
        "stock": true
    },
    {
        "name": "Layered Diamond Bar Necklace",
        "description": "Minimalist 14k gold horizontal bar necklace accented with a row of brilliant-cut diamonds.",
        "price": 475,
        "category": "Necklaces",
        "image": "https://images.unsplash.com/photo-1599643478514-4a420ee9db25?auto=format&fit=crop&w=600&q=80",
        "rating": 4.8,
        "stock": true
    },
    {
        "name": "Opal Teardrop Necklace",
        "description": "Iridescent Australian opal teardrop pendant suspended on a fine 18k white gold chain.",
        "price": 356,
        "category": "Necklaces",
        "image": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80",
        "rating": 4.6,
        "stock": true
    },
    {
        "name": "Pearl Choker Necklace",
        "description": "Lustrous Akoya pearl choker with an 18k gold diamond-set clasp.",
        "price": 650,
        "category": "Necklaces",
        "image": "https://images.unsplash.com/photo-1599643478514-4a420ee9db25?auto=format&fit=crop&w=600&q=80",
        "rating": 4.9,
        "stock": true
    },
    {
        "name": "Emerald Chandelier Earrings",
        "description": "Cascading Colombian emerald drops framed in intricate 18k yellow gold filigree.",
        "price": 900,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
        "rating": 4.8,
        "stock": true
    },
    {
        "name": "Gold Huggie Earrings",
        "description": "Sleek 14k gold huggie hoop earrings with a smooth polished finish.",
        "price": 138,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1579960488661-f3b190f84cb7?auto=format&fit=crop&w=600&q=80",
        "rating": 4.4,
        "stock": true
    },
    {
        "name": "Aquamarine Stud Earrings",
        "description": "Brilliant sky-blue aquamarine stones in a classic four-prong platinum setting.",
        "price": 300,
        "category": "Earrings",
        "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
        "rating": 4.6,
        "stock": true
    },
    {
        "name": "Gold Beaded Bracelet",
        "description": "Handcrafted 18k gold beaded bracelet with a smooth matte finish, adjustable fit.",
        "price": 275,
        "category": "Bracelets",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
        "rating": 4.5,
        "stock": true
    },
    {
        "name": "Diamond Cuff Bracelet",
        "description": "Open-ended 18k white gold cuff paved with 2 carats of brilliant-cut diamonds.",
        "price": 1688,
        "category": "Bracelets",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
        "rating": 4.9,
        "stock": true
    },
    {
        "name": "Leather & Gold Wrap Bracelet",
        "description": "Italian leather wrap bracelet with 14k gold bar clasp — effortlessly bohemian.",
        "price": 94,
        "category": "Bracelets",
        "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
        "rating": 4.3,
        "stock": true
    }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Database Seeded Successfully into Jewellify');
    } catch (error) {
        console.error('Seeding Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
