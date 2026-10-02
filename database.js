const mongoose= require('mongoose');
const userSchema=new mongoose.Schema({
    userName:{
    type:String,
    trim:true ,
    unique:true ,
    lowercase:true ,
    required:[true,"username is required"]
    },
    fName:{
        type:String,
        required:[true,"fName is required "],
        trim:true
    },
    lName:{
        type:String,
        required:[true,"lname is required"],
        trim:true
 },
 password:{
        type:String,
         required:[true,"password is required"],
        trim:true
},
role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
}
})



//////////////////////////// Event schema /////////////////////////////////////

const eventSchema=new mongoose.Schema({
    title:{
       type:String, 
       trim:true ,
       required:[true,'required field']
    },
    
    description:{
        type:String,
        trim:true,
        lowercase:true,
        required:[true,'required field']

    },

    date:{
        type:Number,
        required:[true,'required field']
    },

    time:{
    type:Number,
    required:[true,"required field"]
    },

    location:{
        type:String,
        required:true
    },
    category:{
        type:String,
        trim:true
    },
    capacity:{
        type:Number,
        required:true
    },
   createdBy:{
    type: mongoose.Schema.Types.ObjectId, // used to add _id 
    ref: "UserModel", // taking the refernce of userModel
    required: true,
   },
})


// fo getting them regiesterd 
const registrationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventModel",
        required: true
    }

})
   const EventModel=mongoose.model('EventModel',eventSchema)
   const UserModel=mongoose.model('UserModel',userSchema)
   const RegistrationModel = mongoose.model("RegistrationModel",registrationSchema)
   mongoose.connect(process.env.MONGODB_URL)
   
module.exports={
    UserModel,EventModel,RegistrationModel
}