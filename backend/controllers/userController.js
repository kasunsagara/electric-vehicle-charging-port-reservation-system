import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const newUserData = req.body;
        newUserData.password = bcrypt.hashSync(newUserData.password, 10);

        const user = new User(newUserData);
        await user.save();

        res.status(201).json({
            message: "User created successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "User creation failed"
        });
    }
}

export async function loginUser(req, res) {
    try {
        const users = await User.find({ email: req.body.email });

        if (users.length == 0) {
            res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

        if (isPasswordCorrect) {
            const token = jwt.sign({
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }, "20010924");

            res.status(200).json({
                message: "Login successful",
                token: token
            });
        }
    } catch (error) {
        res.status(401).json({
            message: "Login failed"
        });
    }
}
