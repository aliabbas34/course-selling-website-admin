"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
//Testing pending.
dotenv_1.default.config();
app.use(express_1.default.json());
//Schemas
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    coursesPurchased: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Course" }]
});
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});
//Models
const User = mongoose_1.default.model('User', userSchema);
const Admin = mongoose_1.default.model('Admin', adminSchema);
const Course = mongoose_1.default.model('Course', courseSchema);
//connection to database established.
if (process.env.DBURL)
    mongoose_1.default.connect(process.env.DBURL, { dbName: "courseApp" });
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.sendStatus(403);
    const token = authHeader.split(' ')[1];
    if (!process.env.SECRET)
        return res.sendStatus(403);
    jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, data) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            res.status(500).send(err);
        else {
            if (!data)
                return res.sendStatus(403);
            if (typeof data === "string")
                return res.sendStatus(403);
            let username = data.username;
            let adminExist = yield Admin.findOne({ username });
            //const adminData=ADMINS.find(admin=>admin.username===data);
            if (adminExist) {
                if (data.role === "admin") {
                    next();
                }
                else
                    res.status(401).json({ message: "Access denied : not an admin" });
            }
            else
                res.status(401).json({ message: "Access denied : not an admin" });
        }
    }));
}
function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.sendStatus(403);
    const token = authHeader.split(' ')[1];
    if (!process.env.SECRET)
        return res.sendStatus(403);
    jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, data) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            res.status(500).send(err);
        else {
            if (!data)
                return res.sendStatus(403);
            if (typeof data === "string")
                return res.sendStatus(403);
            let username = data.username;
            let userExist = yield User.findOne({ username });
            // const userData=USERS.find(user=>user.username===data);
            if (userExist) {
                if (data.role === "user") {
                    req.headers["user"] = userExist.username;
                    next();
                }
                else
                    res.status(401).json({ message: "Access denied : not a user" });
            }
            else
                res.status(401).json({ message: "Access denied : not a user" });
        }
    }));
}
// Admin routes
app.post('/admin/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up admin
    const { username, password } = req.body;
    let adminExist = yield Admin.findOne({ username: username });
    if (adminExist)
        res.status(401).json({ message: "username already exist" });
    else {
        let newAdmin = new Admin({ username, password });
        yield newAdmin.save();
        if (!process.env.SECRET)
            return res.sendStatus(403);
        const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: 'Admin created successfully', token: token });
    }
}));
app.post('/admin/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to log in admin
    const { username, password } = req.body;
    let adminExist = yield Admin.findOne({ username: username, password: password });
    if (adminExist) {
        if (!process.env.SECRET)
            return res.sendStatus(403);
        const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Logged in successfully", token: token });
    }
    else
        res.status(401).json({ message: "username and password doesn't exist" });
}));
app.post('/admin/courses', authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to create a course
    let course = { courseId: Date.now().toString(16) + Math.random().toString(16).slice(2) };
    yield Object.assign(course, req.body);
    console.log(course);
    const newCourse = new Course(course);
    yield newCourse.save();
    res.status(200).json({ message: 'Course created successfully', courseId: course.courseId });
}));
app.put('/admin/courses/:courseId', authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to edit a course
    // const courseId=req.params.courseId;
    // let course=await Course.findOne({courseId});
    let course = yield Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        // await Object.assign(course,req.body);
        res.status(200).json({ message: "Course updated successfully" });
    }
    else
        res.status(400).json({ message: 'course not found' });
}));
app.get('/admin/courses', authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to get all courses
    let courses = yield Course.find({});
    res.status(200).json({ courses: courses });
}));
app.get('/admin/course/:courseId', authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //logic to get a single course
    let course = yield Course.findOne({ _id: req.params.courseId });
    if (course)
        res.status(200).json({ course: course });
    else
        res.status(404).json({ message: "Course not found" });
}));
app.delete('/admin/course/:courseId', authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //logic to delete a course
    try {
        yield Course.deleteOne({ _id: req.params.courseId });
        res.status(200).json({ message: "Deleted successfully" });
    }
    catch (e) {
        res.status(401).json({ error: e });
    }
}));
app.get('/admin/valid', (req, res) => {
    //logic to validate jwt
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.sendStatus(403);
    const token = authHeader.split(' ')[1];
    if (!process.env.SECRET)
        return res.sendStatus(403);
    jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            res.status(200).json({ message: "jwt expired" });
        else {
            if (!data)
                return res.sendStatus(403);
            if (typeof data === "string")
                return res.sendStatus(403);
            let username = data.username;
            let adminExist = yield Admin.findOne({ username });
            //const adminData=ADMINS.find(admin=>admin.username===data);
            if (adminExist) {
                if (data.role === "admin") {
                    res.status(200).json({ message: "jwt valid" });
                }
                else
                    res.status(401).json({ message: "Access denied : not an admin" });
            }
            else
                res.status(401).json({ message: "Access denied : not an admin" });
        }
    }));
});
// User routes
app.post('/users/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up user
    const { username, password } = req.body;
    let userExist = yield User.findOne({ username: username });
    if (userExist)
        res.status(401).json({ message: "username already exist" });
    else {
        let newUser = new User({ username: username, password: password, coursesPurchased: [] });
        yield newUser.save();
        if (!process.env.SECRET)
            return res.sendStatus(403);
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: 'User created successfully', token: token });
    }
}));
app.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to log in user
    const { username, password } = req.body;
    let authenticUser = yield User.findOne({ username: username, password: password });
    if (authenticUser) {
        if (!process.env.SECRET)
            return res.sendStatus(403);
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: 'Logged in succesfully', token: token });
    }
    else
        res.status(401).json({ message: "Wrong credentials" });
}));
app.get('/users/courses', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to list all courses
    let courses = yield Course.find({ published: true });
    res.status(200).json({ courses: courses });
}));
app.post('/users/courses/:courseId', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a course
    let course = yield Course.findOne({ courseId: req.params.courseId });
    // req.user.coursesPurchased.push({courseId:course.courseId});
    if (course) {
        let user = yield User.findOne({ username: req.headers["user"] });
        if (user) {
            user.coursesPurchased.push(course._id);
            yield user.save();
            res.status(200).json({ message: "Course purchased succesfully" });
        }
        else
            res.status(401).json({ messgage: "user not found" });
    }
    else
        res.status(401).json({ message: "Course not found" });
    // if(course){
    //   for(let i=0;i<USERS.length;i++){
    //     if(USERS[i].username===req.user.username){
    //       USERS[i].coursesPurchased.push({courseId:course.id});
    //       res.status(200).json({message:"Course purchased successfully"});
    //     }
    //   }
    // }
    // else res.status(400).json({message:"course doesn't exist"});
}));
app.get('/users/purchasedCourses', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to view purchased courses
    // let purchasedCourses=[];
    //console.log(req.coursesPurchased);
    // req.user.coursesPurchased.forEach(id=>purchasedCourses.push(COURSES.find(course=>course.id===id.courseId)));
    let user = yield User.findOne({ username: req.headers["user"] }).populate('coursesPurchased');
    if (user) {
        res.status(200).json({ purchasedCourses: user.coursesPurchased });
    }
    else
        res.status(401).json({ message: "user not found" });
}));
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
