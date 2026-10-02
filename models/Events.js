const express=require('express')
const authMiddleware = require("../middleware/auth")
const {EventModel}=require("../database")

const router=express.Router()

router.post("/add",authMiddleware,async(req,res)=>{
try{
const saveInfo=new EventModel({ // adding the info to database 
    title:req.body.title,
    description:req.body.description,
    date:req.body.date,
    time:req.body.time,
    location:req.body.location,
    category:req.body.category,
    capacity:req.body.capacity,
    createdBy:req.user.userId // came from auth.js as we have made the token from the userId (_id unique mongodb id )

})

await saveInfo.save() // saving the data into the database 
return res.status(200).json({
    msg:"data saved sucessfully"
})
}
catch(e){
    console.log("error occured!!",e)
    return res.status(400).json({
    msg:"error occured"
})
}
finally{
    console.log("code over!")
}

})


////// get the event/////

router.get("/getevents",authMiddleware,async(req,res)=>{
    try{
        const getEventDetails=await EventModel.find({
        createdBy:req.user.userId // why createdBy becuase its conatins the token and we are checking on behlaf of token it comes from auth.js and databse.js (unique id i.e _id) 
    })
    res.status(200).json({
        details:getEventDetails
    })

    }
    catch(e){
console.log("error occured in getting the details ",e)
return res.status(401).json({
    msg:"error occured in getting the details "
})
    }
    
})


  // event id is the id in which user want to register 
router.post("/register/:eventId", authMiddleware, async (req, res) => {

    try {

        const existingRegistration = await RegistrationModel.findOne({
            userId: req.user.userId, // user id is userss unique id genrted in databse 
            eventId: req.params.eventId // id geneared in event model in databse 
        })

        if (existingRegistration) {
            return res.status(409).json({
                msg: "already registered for this event"
            })
        }

        const registration = new RegistrationModel({
            userId: req.user.userId,
            eventId: req.params.eventId
        })

        await registration.save()

        return res.status(201).json({
            msg: "registered successfully"
        })

    } catch (e) {

        console.log("error occured while registering", e)

        return res.status(400).json({
            msg: "error occured while registering"
        })
    }
})


module.exports=router