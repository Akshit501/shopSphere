
const express=require('express');
const cors=require('cors');
const userRouter=require('./routes/authRoutes');  


require("dotenv").config();


const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/routes',userRouter);





const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
  res.send("Welcome to ShopSphere API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
