const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
    try {
        const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!defaultAdminEmail || !defaultAdminPassword) {
            console.error('Default admin email or password not set in environment variables');
            return;
        }

        const adminExists = await Admin.findOne({email: defaultAdminEmail});

        if (!adminExists) {
            // Create default admin
            await Admin.create({
                email: defaultAdminEmail,
                password: defaultAdminPassword // Will be hashed 
            });
            console.log('Default admin created successfully');
        } else {
            console.log('Default admin already exists');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = createDefaultAdmin;