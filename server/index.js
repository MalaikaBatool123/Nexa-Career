
const express = require ("express");
const app =express();
const cors = require("cors");

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


const db = require('./models');
//Router
const unirouter= require('./routes/university');
app.use("/university",unirouter);
app.use("/university/login",unirouter);
app.use("/university/:id",unirouter);
app.use("/university/update/:id",unirouter);
app.use("/university/password",unirouter);
const comrouter= require('./routes/company');
app.use("/company",comrouter);
app.use("/company/login",comrouter);
app.use("/company/:id",comrouter);
app.use("/company/update/:id",comrouter);

const stdrouter= require('./routes/student');
app.use("/student",stdrouter);

const interviewrouter= require('./routes/interview');
app.use("/interview",interviewrouter);

const eventrouter= require('./routes/eventuni');
app.use("/event",eventrouter);

const eventregrouter= require('./routes/eventregister');
app.use("/eventregister",eventregrouter);

const eventroomrouter= require('./routes/eventroom');
app.use("/eventroom",eventroomrouter);

const usherrouter= require('./routes/ushers');
app.use("/ushers",usherrouter);

const roomallocaterouter= require('./routes/roomallocate');
app.use("/roomallocate",roomallocaterouter);

const projects= require('./routes/project');
app.use("/project",projects);
app.use("/project/update/:id",projects);

const projectstudentrouter= require('./routes/project_student');
app.use("/projectstudent",projectstudentrouter);

const register= require('./routes/register');
app.use("/register",register);
app.use("/register/login",register);

const fileRouter = require('./routes/file');
app.use("/upload", fileRouter);


app.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' }); // Clear the auth cookie
    res.status(200).json({ message: 'Logout successful' });
  });



db.sequelize.sync().then(()=>{
    app.listen(3001,()=>{
        console.log("Server running on 3001")
    });
});