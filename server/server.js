import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from "./routers/userRouters.js";
import resumeRouter from "./routers/resumeRoutes.js";
import aiRouter from "./routers/aiRoutes.js";

const app=express();
const PORT=process.env.PORT||3000;

const DB=process.env.MONGODB_URI ;

//Databade connection
await connectDB();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get('/',(req,res)=>res.send("Server is live..."))
app.use('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai',aiRouter)

app.listen(PORT,()=>{
    console.log(`Server is ruuning on port ${PORT}`)
});