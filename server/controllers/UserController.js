import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";


const generateToken = (userId)=>{
    const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : '7d'})
    return token
}

// controller for user registration
// post : /api/users/register
export const registerUser = async(req , res ) =>{
    try{
        const {name , email , password} = req.body;

        //check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({Message: 'missing required fields'})
        }

        //check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({Message : 'user already exists'})
        }

        // create new user 
        const hashedPassowrd  = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name , email , password : hashedPassowrd
        })


        // return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;
        

        return res.status(201).json({Message: 'User created successfully' , token , user:newUser})

    } catch(error){
        return res.status(400).json({Message: error.Message})

    }

}


// controller for user login
// post : /api/users/login
export const loginUser = async(req , res ) =>{
    try{
        const { email , password} = req.body;

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({Message : 'Invalid email or password'})
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({Message : 'Invalid email or password'})
        }

        // return success message
        const token = generateToken(User._id)
        user.password = undefined;
        return res.status(201).json({Message: 'Login successful' , token , user})

    } catch(error){
        return res.status(400).json({Message: error.Message})

    }

}

//controller for getting user by id 
// get : /api/user/data
export const getUserById = async(req , res ) =>{
    try{

        const userId = req.userId;

        //check if user exits
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({Message : 'user not found'})
        }
        // return user
        user.password = undefined;
        return res.status(200).json({user})
        

    } catch(error){
        return res.status(400).json({Message: error.Message})

    }

}

// controller for getting use resumes
// get : /api/ users/resumes
export const getUserResumes = async(req, res) => {
    try{
        const userId = req.userId;

        // retirn user resumes 
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch(error){
        return res.status(400).json({message : error.message})
    }
}