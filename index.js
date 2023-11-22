import express from 'express'
import './database/connection.js'
import cors from 'cors'
import userRouter from './router/userRouter.js'
import loginRouter from './router/loginRouter.js'
const app = express()
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 5777;
app.use(cors({
    origin:['https://deploy-mern-1whq.vercel.app'],
    methods:['POST','GET','DELETE'],
    credentials:true
  }))
app.get('/',(req,res)=>{
    res.send("Welcome Saurav")
})
app.use('/register',userRouter);
app.use('/login',loginRouter);
app.listen(PORT,()=>{
    console.log(`Server is running on : http://localhost:${PORT}`);
})





