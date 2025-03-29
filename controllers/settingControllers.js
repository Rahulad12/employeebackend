import User from "../models/User.js"
import logger from "../utils/logger.js"
import bcrypt from "bcryptjs";

const updateUserEmail = async (req, res) => {
    const { email } = req.body;
    const Id = req.user.userId;
    logger.info(`Updating the ${email} of user ${req.user.userId}`)

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // const existEmail = await User.findOne({ email: email, _id: { $ne: Id } });
        const existEmail = await User.findOne({
            email: email,
            _id: { $ne: Id } // Exclude current user
        });
        if (existEmail) {
            logger.warn("Email Must be Unique")
            return res.status(400).json({
                success: false,
                message: "Email Must be Unique"
            })
        }

        const user = await User.findByIdAndUpdate(Id, { email }, {
            new: true,
        })
        if (!user) {
            logger.error("Failed to update email")
            return res.status(400).json({
                success: false,
                message: "Failed to update email"
            })
        }
        logger.info("Email update successfully")
        return res.status(200).json({
            success: true,
            message: "Email updated successfully"
        })
    } catch (error) {
        logger.error(`Error: ${error.message}`)
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateUserPassword = async (req, res) => {
    const { password } = req.body;
    const Id = req.user.userId;
    console.log(password)

    logger.info(`Updating password of user ${Id}`);

    try {
        const user = await User.findById(Id);

        if (!user) {
            logger.error(`User does not exist: ${Id}`);
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }


        const isSamePassword = await user.comparePassword(password);
        console.log(isSamePassword)
        if (isSamePassword) {
            logger.warn("Password is the same as the current password");
            return res.status(400).json({
                success: false,
                message: "New password must be different from the old password"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(
            Id,
            { password: hashedPassword }, // Save hashed password
            { new: true }
        );

        if (!updatedUser) {
            logger.error("Password update failed");
            return res.status(400).json({
                success: false,
                message: "Password update failed"
            });
        }

        logger.info("Password updated successfully");
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        logger.error(`Server error: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { updateUserEmail, updateUserPassword };