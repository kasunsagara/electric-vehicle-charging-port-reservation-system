import User from "../models/user.js";

export async function createUsers(req, res) {
    try {
        const user = new User(req.body)
        await user.save()
        res.json({
            message: "User created successfully"
        });

    } catch (error) {
        res.json({
            message: "User creation failed"
        });
    }
}