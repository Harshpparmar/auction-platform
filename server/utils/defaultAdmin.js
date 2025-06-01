const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await Admin.findOne({ email: 'admin@auction.com' });

        if (!adminExists) {
            // Create default admin
            await Admin.create({
                email: 'admin@auction.com',
                password: 'admin123' // Will be hashed 
            });
            console.log('Default admin created successfully');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = createDefaultAdmin;