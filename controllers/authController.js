const User = require('../models/User');

const register = async (req, res) => {
    try {
        const user = await User.create({ ...req.body });
        const token = user.createJWT();
        res.status(201).json({ user: { name: user.name }, token });
    } catch (error) {
        // Send back a more informative error
        res.status(500).json({ msg: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // Use return to stop execution and send a clear error
            return res.status(400).json({ msg: 'Please provide email and password' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        
        const token = user.createJWT();
        res.status(200).json({ user: { name: user.name }, token });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = { register, login };
