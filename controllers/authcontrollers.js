const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let users = []; 
exports.registerUser = (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });

    res.json({ message: "User registered successfully" });
};

exports.loginUser = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "shhhh", { expiresIn: "1h" });

    res.json({ token });
};
