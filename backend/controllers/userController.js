import User from "../models/user.js";
import bcrypt from 'bcrypt';

export async function createUsers(req, res) {
    try {
        const newUserData = req.body;
        newUserData.password = bcrypt.hashSync(newUserData.password, 10);

        const user = new User(newUserData);
        await user.save();

        res.json({
            message: "User created successfully"
        });

    } catch (error) {
        res.json({
            message: "User creation failed"
        });
    }
}

