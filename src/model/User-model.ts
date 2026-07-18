import mongoose,{Schema,Document} from "mongoose";

export interface Messages extends Document{
    content:string,
    createdAt:Date,
    updatedAt:Date
}

const MessageSchema:Schema<Messages> = new Schema({
    content:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
    ,
    updatedAt:{
        type:Date,
        required:true,
        default:Date.now
    }
});

export interface User extends Document{
    name:string,
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    isVerified:boolean,
    verifyCodeExpiry:Date,
    isAcceptingMessages:boolean,
    message:Messages[]
    createdAt:Date,
    updatedAt:Date

}

const UserSchema:Schema<User>= new Schema({

    name:{
        type:String,
        lowercase:true,
        required:[true,"Name is required"]

    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:[true,"Email is required"],
          match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Please enter a valid email address"],

    },
    username:{
        type:String,
        lowercase:true,
       unique:true,
        required:[true,"Username is required"],
        trim:true

    },
    password:{
        type:String,
        required:[true,"Password is required"]

    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode is required"]

    },
    isAcceptingMessages:{
        type:Boolean,
        default:true

    },
    isVerified:{
        type:Boolean,
        default:false,
        

    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCode is required"]

    },
    message:[MessageSchema],
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
    ,
    updatedAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

const userModel =(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);
export default userModel;

