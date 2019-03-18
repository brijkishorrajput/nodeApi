const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name: 'NodeJS'},
    {id:2, name: 'JavaScript'},
    {id:3, name: 'express'},
    {id:4, name: 'mongoDB'}
] 

app.get('/',(req,res)=>{
    res.send('Hello world!!');
});

app.get('/api/courses', (req,res)=>{
    res.send(courses); 
});

app.post('/api/courses', (req,res)=>{

    const {error} = validateCourse(req.body); // object destrctor 
    if(error){
        res.status(400).send(error.details[0].message) ;
         return;
     }

    const course = {
        id: courses.length +1 ,
        name: req.body.name
    } ;

    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id',(req,res)=>{
   const course= courses.find(c => c.id=== parseInt(req.params.id));
   if(!course) {
    res.status(404).send('The course with the given ID was not found') 
    return;
   }
   res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{
    // check course is available 
    // if not available then return 404 
    const course= courses.find(c => c.id=== parseInt(req.params.id));
    if(!course){
        res.status(404).send('The course with the given ID was not found') 
        return;
    }  
    
    // validate input data via Joi package 
    // if invalide then return 400 
    
    const {error} = validateCourse(req.body); // object destrctor 
    if(error){
        res.status(400).send(error.details[0].message) ;
         return;
     }


    // else update course 
    course.name  = req.body.name;
    res.send(course);
    // return the updated course 
});

app.delete('/api/courses/:id',(req,res)=>{
 // check course exists 
 // if not then 404 
 const course= courses.find(c => c.id=== parseInt(req.params.id));
 if(!course) {
    res.status(404).send('The course with the given ID was not found') 
    return;
 }


 // delete 
    const index = courses.indexOf(course);
    courses.splice(index,1);
 // return the same course 
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name : Joi.string().min(4).required()
    }

    return Joi.validate(course,schema);   
}
const port = process.env.PORT||3000; // Set PORT number within env variable
app.listen(port, ()=>console.log('listing '+port));
 