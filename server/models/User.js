import mongoose from "mongoose"

const userSchema =new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        trim:true ,
        minlength:3,
    },
    lastName:{
        type: String,
        required:true,
        trim:true ,
        minlength:3,
    },
    email:{
        type : String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true ,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        minlength:10,
    },
    joinedAt:{
        type:Date,
        default:Date.now,
    },
});

const User = mongoose.model('User' , userSchema);
export default User;