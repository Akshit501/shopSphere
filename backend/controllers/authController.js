const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const sendEmail=require('../utils/sendEmail');
const  dotenv=require('dotenv');
dotenv.config();


//generate JWT token

const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:"30d"
  });
}








//register a new user

const registerUser=async(req,res)=>{
  const {name,email,password}=req.body;

  try{
    //check if user already exists
    const existingUser=await User.findOne({email});

    if(existingUser){
      return res.status(400).json({
        message:"User already exists"
      });
      
    }
    //todos : hash the password before saving to database
    //todos: generate a JWT token for authentication
    //todos : otp sending and verification for email confirmation
    //todos: welcome mail
    

    //hashing the password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    



    const user=await User.create({name,email,password:hashedPassword,verified:false});

    if(user){
      //otp generation and sending email
      const otp=Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

      const message=`Your OTP for email confirmation is: ${otp}`;
      //send OTP to user's email
      try{
        await sendEmail(email,"Welcome to ShopSphere - Email Confirmation",message);
      } catch (emailError){
        console.error('Error sending welcome email:', emailError);
      }

      return res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        token:generateToken(user._id)
      });
    }
    




  } catch (error) {
    res.status(500).json({
      message:"Error registering user"
    });
    

  }
}

//login user

const loginUser=async(req,res)=>{
  const {email,password}=req.body;

try{
  const user=await User.findOne({email});

  if(user && (await bcrypt.compare(password,user.password))){
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id)
    });
  } 
  
  else {
    return res.status(400).json({
      message:"Invalid email or password"
    });
  }
} catch (error) {
  res.status(500).json({
    message:"Error logging in user"
  });
}
   




}


const getUsers=async(req,res)=>{
  try{
    const users=await User.find({}).select('-password');
    res.json(users);

  }
  catch(error){
    res.status(500).json({
      message:"Error fetching users"
    });
  }
}


module.exports={registerUser,loginUser,getUsers};



