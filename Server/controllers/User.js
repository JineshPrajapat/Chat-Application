const User  = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async (req, res)=>{
    const {username, email, password, fullName}  = req.body;

    try{
        if(!username  || !email || !password || !fullName )
        {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User already exist."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            username,
            email, 
            password: hashedPassword,
            profileImage : `https://api.dicebear.com/5.x/initials/svg?seed=${username}`
        });
        user.password = undefined;

        const payload={
            username: user.username,
            email: user.email,
            id : user._id,
            fullName: user.fullName,
            profileImage: user.profileImage
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "2h"
        });

        const options = {
            expires : new Date(Date.now() + 2*60*60*1000),
            httpOnly:true
        }

        return res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            payload,
            message: "Registered Successfully"
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Registration Failure, try agian",
        });
    }
};

exports.login = async (req, res)=>{
    console.log(req.body);
    const {email, password}= req.body;
    try{
        if(!email || !password)
        {
            return res.status(403).json({
                success: false,
                message:"Email and password are required."
            });
        }

        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message: "User not exist, Please signUp"
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const payload={
                id : user._id,
                email: user.email,
                username : user.username,
                fullName : user.fullName,
                profileImage: user.profileImage
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn: "2h"
            });

            const options = {
                expires: new Date(Date.now() + 2*60*60*1000),
                httpOnly: true
            }

            return res.status(200).json({
                success: true,
                token,
                payload,
                message:"Logged in Successfully"
            });
        }
        else{
            return res.status(402).json({
                success: false,
                message: "Password do not match."
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login failure, try again."
        })
    }
};
