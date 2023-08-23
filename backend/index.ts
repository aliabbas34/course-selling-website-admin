import express from 'express';
import jwt from "jsonwebtoken";
const app = express();
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import { Request, Response, NextFunction } from 'express';
app.use(cors());
//Testing pending.
dotenv.config();

app.use(express.json());

//Schemas
const userSchema=new mongoose.Schema({
  username:String,
  password:String,
  coursesPurchased:[{type:mongoose.Schema.Types.ObjectId,ref:"Course"}]
});

const adminSchema=new mongoose.Schema({
  username:String,
  password:String,
});

const courseSchema=new mongoose.Schema({
  title:String,
  description:String,
  price:Number,
  imageLink:String,
  published:Boolean
});

//Models
const User = mongoose.model('User',userSchema);
const Admin=mongoose.model('Admin',adminSchema);
const Course=mongoose.model('Course',courseSchema);

//connection to database established.
if(process.env.DBURL)
mongoose.connect(process.env.DBURL,{dbName:"courseApp"});



function authenticateAdmin(req: Request,res: Response,next: NextFunction){
  const authHeader=req.headers["authorization"];
  if(!authHeader) return res.sendStatus(403);
  const token=authHeader.split(' ')[1];
  if(!process.env.SECRET) return res.sendStatus(403);
  jwt.verify(token,process.env.SECRET,async (err,data)=>{
    if(err) res.status(500).send(err);
    else{
      if(!data) return res.sendStatus(403);
      if(typeof data === "string") return res.sendStatus(403);
      let username=data.username;
      let adminExist=await Admin.findOne({username});
      //const adminData=ADMINS.find(admin=>admin.username===data);
      if(adminExist){
        if(data.role==="admin"){
          next();
        }
        else res.status(401).json({message:"Access denied : not an admin"});
      }
      else res.status(401).json({message:"Access denied : not an admin"});
    }
  });
}

function authenticateUser(req: Request,res: Response,next: NextFunction){
  
  const authHeader=req.headers["authorization"];
  if(!authHeader) return res.sendStatus(403);
  const token=authHeader.split(' ')[1];
  if(!process.env.SECRET) return res.sendStatus(403);
  jwt.verify(token,process.env.SECRET,async (err,data)=>{
    if(err) res.status(500).send(err);
    else{
      if(!data) return res.sendStatus(403);
      if(typeof data === "string") return res.sendStatus(403);
      let username=data.username;
      let userExist=await User.findOne({username});
      // const userData=USERS.find(user=>user.username===data);
      if(userExist){
        if(data.role==="user"){
          req.headers["user"]=userExist.username;
          next();
        }
        else res.status(401).json({message:"Access denied : not a user"});
      }
      else res.status(401).json({message:"Access denied : not a user"});
    }
  });
}

// Admin routes
app.post('/admin/signup', async (req: Request, res: Response) => {
  // logic to sign up admin
  const {username,password}=req.body;
  let adminExist=await Admin.findOne({username:username});
  if(adminExist) res.status(401).json({message:"username already exist"});
  else{
    let newAdmin=new Admin({username,password});
    await newAdmin.save();
    if(!process.env.SECRET) return res.sendStatus(403);
    const token=jwt.sign({username,role:"admin"},process.env.SECRET,{expiresIn:"1h"});
    res.status(200).json({message:'Admin created successfully',token:token});
  }
});

app.post('/admin/login',async (req: Request, res: Response) => {
  // logic to log in admin
  const {username,password}=req.body;
  let adminExist=await Admin.findOne({username:username,password:password});
  if(adminExist){
    if(!process.env.SECRET) return res.sendStatus(403);
    const token=jwt.sign({username,role:"admin"},process.env.SECRET,{expiresIn:"1h"});
    res.status(200).json({message:"Logged in successfully",token:token});
  } 
  else res.status(401).json({message:"username and password doesn't exist"});
});

app.post('/admin/courses',authenticateAdmin,async (req: Request, res: Response) => {
  // logic to create a course
  
  let course={courseId:Date.now().toString(16)+Math.random().toString(16).slice(2)};
  await Object.assign(course,req.body);
  console.log(course);
  const newCourse=new Course(course);
  await newCourse.save();
  res.status(200).json({message:'Course created successfully',courseId:course.courseId});

});

app.put('/admin/courses/:courseId',authenticateAdmin,async (req: Request, res: Response) => {
  // logic to edit a course
  // const courseId=req.params.courseId;
  // let course=await Course.findOne({courseId});
  let course=await Course.findByIdAndUpdate(req.params.courseId,req.body,{new:true});
  if(course){
    // await Object.assign(course,req.body);
    res.status(200).json({message:"Course updated successfully"});
  }
  else res.status(400).json({message:'course not found'});
  
});

app.get('/admin/courses',authenticateAdmin,async (req: Request, res: Response) => {
  // logic to get all courses
  let courses=await Course.find({});
    res.status(200).json({courses:courses});
});

app.get('/admin/course/:courseId',authenticateAdmin,async (req: Request, res: Response)=>{
  //logic to get a single course
  let course=await Course.findOne({_id:req.params.courseId});
  if(course) res.status(200).json({course:course});
  else res.status(404).json({message:"Course not found"});
});

app.delete('/admin/course/:courseId',authenticateAdmin,async(req: Request, res: Response)=>{
  //logic to delete a course
  try{
  await Course.deleteOne({_id:req.params.courseId});
  res.status(200).json({message:"Deleted successfully"});
  }catch(e){
    res.status(401).json({error:e});
  }
});

app.get('/admin/valid',(req: Request, res: Response)=>{
  //logic to validate jwt
  const authHeader=req.headers.authorization;
  if(!authHeader) return res.sendStatus(403);
  const token=authHeader.split(' ')[1];
  if(!process.env.SECRET) return res.sendStatus(403);
  jwt.verify(token,process.env.SECRET,async (err,data)=>{
    if(err) res.status(200).json({message:"jwt expired"});
    else{
      if(!data) return res.sendStatus(403);
      if(typeof data === "string") return res.sendStatus(403);
      let username=data.username;
      let adminExist=await Admin.findOne({username});
      //const adminData=ADMINS.find(admin=>admin.username===data);
      if(adminExist){
        if(data.role==="admin"){
          res.status(200).json({message:"jwt valid"});
        }
        else res.status(401).json({message:"Access denied : not an admin"});
      }
      else res.status(401).json({message:"Access denied : not an admin"});
    }
  });
  
});

// User routes
app.post('/users/signup',async (req: Request, res: Response) => {
  // logic to sign up user
  const {username,password}=req.body;
  let userExist=await User.findOne({username:username});
  if(userExist) res.status(401).json({message:"username already exist"});

  else{
    let newUser=new User({username:username,password:password,coursesPurchased:[]});
    await newUser.save();
    if(!process.env.SECRET) return res.sendStatus(403);
    const token=jwt.sign({username,role:"user"},process.env.SECRET,{expiresIn:"1h"});
    res.status(200).json({message:'User created successfully',token:token});
  }

});

app.post('/users/login', async (req: Request, res: Response) => {
  // logic to log in user
  const {username,password}=req.body;
  let authenticUser=await User.findOne({username:username,password:password});
  if(authenticUser){
    if(!process.env.SECRET) return res.sendStatus(403);
    const token=jwt.sign({username,role:"user"},process.env.SECRET,{expiresIn:"1h"});
    res.status(200).json({message:'Logged in succesfully',token:token});
  }
  else res.status(401).json({message:"Wrong credentials"});
});

app.get('/users/courses',authenticateUser,async (req: Request, res: Response) => {
  // logic to list all courses
  let courses=await Course.find({published:true});
  res.status(200).json({courses:courses});

});

app.post('/users/courses/:courseId',authenticateUser,async (req: Request, res: Response) => {
  // logic to purchase a course
  
    let course=await Course.findOne({courseId:req.params.courseId});
    // req.user.coursesPurchased.push({courseId:course.courseId});
    if(course){
      let user=await User.findOne({username:req.headers["user"]});
      if(user){
        user.coursesPurchased.push(course._id);
        await user.save();
        res.status(200).json({message:"Course purchased succesfully"});
      }
      else res.status(401).json({messgage:"user not found"});
    }
    else res.status(401).json({message:"Course not found"});
    
    // if(course){
    //   for(let i=0;i<USERS.length;i++){
    //     if(USERS[i].username===req.user.username){
    //       USERS[i].coursesPurchased.push({courseId:course.id});
    //       res.status(200).json({message:"Course purchased successfully"});
    //     }
    //   }
    // }
    // else res.status(400).json({message:"course doesn't exist"});
  
});

app.get('/users/purchasedCourses',authenticateUser,async (req: Request, res: Response) => {
  // logic to view purchased courses
  
    // let purchasedCourses=[];
    //console.log(req.coursesPurchased);
    // req.user.coursesPurchased.forEach(id=>purchasedCourses.push(COURSES.find(course=>course.id===id.courseId)));
    let user=await User.findOne({username:req.headers["user"]}).populate('coursesPurchased');
    if(user){
      res.status(200).json({purchasedCourses:user.coursesPurchased});
    }
    else res.status(401).json({message:"user not found"});
  
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
