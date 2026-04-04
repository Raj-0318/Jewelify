const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelify', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminUser = await User.findOne({ email: 'admin@jewelify.com' });
        console.log('Admin User in DB:', adminUser);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
