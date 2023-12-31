import mongoose, { Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const emailRegexPattern:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avater:{
        public_id: string;
        url: string
    },
    role: string;
    isVerified: boolean;
    courses: Array<{coursesId: string}>;
    comparePassword: {password: string} => Promise<boolean>;
};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate:{
            validator: function (value: string) {
                return emailRegexPattern.test(value)
            },
            message:"Please enter a valid email"
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "password must at least 6 charactera"],
        select: false,
    },
    avater: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [{
        courseId: String,
        default: false,
    }],

},{timestamps:true});

// Hash password before saving
userSchema.pre<IUser>('save',async function(next){
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password
userSchema.methods.comparePassword = async function (enteredPassword:String) : Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("user", userSchema);
export default userModel;