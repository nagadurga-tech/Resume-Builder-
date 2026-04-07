import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Resume from '../models/Resume.js'

const generateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
    return token;
}


//contrller for user registeration
//POST: /apu/users/register
export const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'Missing required fields'})
        }
        
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({message:'User already exists'})
        }

        //create new user
        const hashedPassword =await bcrypt.hash(password,10)
        const newUser=await User.create({
            name,email,password:hashedPassword
        })

        //return success message
        const token=generateToken(newUser._id)
        newUser.password=undefined;
        return res.status(200).json({message:'user created successfully',token,user:newUser})

    }catch(error){
        return res.status(400).json({message:error.message})
    }
}

//contrller for user login
//POST: /apu/users/login

export const loginUser=async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'Invalid email or password'})
        }
        if(!user.comparePassword(password)){
            return res.status(400).json({message:'Invalid email or password'})
        }

        const token=generateToken(user._id)
        user.password=undefined;

        return res.status(200).json({message:'user logged in successfully',token,user})

    }catch(error){
        return res.status(400).json({message:error.message})
    }
}

//controller for getting user id
//GET:/api/users/data

export const getUserById =async(req,res)=>{
    try{
        const userId=req.userId;
        //check if user exists
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        user.password=undefined;
        return res.status(200).json({user})

    }catch(error){
        return res.status(400).json({message:error.message})
    }
}

//controller for getting user resumes
//GET:/api/users/resumes

export const getUserResumes=async(req,res)=>{
    try{
        const userId=req.userId;
        
        //return user resumes
        const resumes=await Resume.find({userId}).sort({updatedAt:-1})
        return res.status(200).json({resumes})
    }catch(error){
        return res.status(400).json({message:error.message})
    }
}


