const express=require('express')
const router=express.Router()
const cors=require('cors')
const dotenv= require('dotenv') 
dotenv.config() // initialzise the .envfile

// getting the path
const userRouter=require("./routes/users")
const eventRouter=require("./models/Events")






// using the routers
const app=express()
app.use(cors()) 
app.use(express.json());// convert josn in js object

app.use("/api/v1/user",userRouter)
app.use("/api/v1/event",eventRouter)


app.listen(process.env.PORT,()=>{
    console.log( "port listning on PORT 3000")
})