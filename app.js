const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const User = require("./models/User")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const MONGO_URI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MONGO DB ATLAS");
    } catch (error) {
        console.error(error)
    }
}

connectDB()

app.get(("/") , (req,res) => {
    res.send("Backend is live")
})


app.post("/register" , async (req,res) => {
    const {userName, email, password} = req.body;

    try {

        const hashPassword = await bcrypt.hash(password, 10)
         
        const newUser = await User.create({
            userName,
            email,
            password: hashPassword
        })


        res.status(201).json({message: "User registered successfully", 
            user: {
                userName,
                email,
        }})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" });

    }
})

app.post("/login" , async (req,res) => {
    const {email, password} = req.body

    
    const existingUser = await User.findOne({email})

    if(!existingUser) return res.status(404).json({message: "User not found"})

        const isMatch = await bcrypt.compare(password, existingUser.password)

        console.log(isMatch);
    
        if(!isMatch) {
            return res.status(400).json({message: "Password is wrong"})
        } else {

            return res.status(201).json({message: "Login succesfully", user: existingUser.userName})
        }

    

  
})


const PORT = process.env.PORT

app.listen(PORT || 5001, () => {
    console.log("App is working on 5001");
})