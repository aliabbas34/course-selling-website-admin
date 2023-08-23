import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axios from "axios";
import NavBar from "./NavBar";
import { hasJwtExpired, isAuthenticated } from "../lib/auth";
import { useNavigate } from "react-router-dom";

function ShowCourses() {

    const [courses, setCourses] = useState([]);

    useEffect(()=>{
        hasJwtExpired();
        async function getDataFromBackend(){
        try{
            const promise=await axios('http://localhost:3000/admin/courses',{
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem("token")}`
                }
            })
            setCourses(promise.data.courses);
            //console.log(promise.data.courses);
        }catch (e){
            console.log(e);
        }
    }
    getDataFromBackend();
    },[])

    return <div style={{height:"100%",width:"100%", backgroundColor:"rgb(243, 246, 249)"}}>
        <div style={{position:"fixed",width:"100%",zIndex:"1"}}>
            <NavBar ></NavBar>
        </div>

        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",top:"70px",position:"absolute"}}>
        {isAuthenticated()?courses.map(c => <Course course={c} courses={courses} setCourses={setCourses}/>):<h1>Unauthorized</h1>}
        </div>

    </div>
}

function Course({course,courses,setCourses}) {
    const navigate=useNavigate();
    return (
        <Card sx={{ maxWidth: 345 , margin:"10px"}}>
            <CardMedia
                component="img"
                alt="buildings on a mountain"
                height="200"
                image={course.imageLink}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {course.title}
                </Typography>
                {course.published?<Published/>:<Notpublished/>}
                
                <Chip label={
                    <Typography variant="button" gutterBottom>
                        {course.price}
                    </Typography>
                } sx={{backgroundColor:"#ff9800", '& .MuiChip-icon':{color:'black'}, marginBottom:"8.4px"}} icon={<CurrencyRupeeIcon fontSize="small"/>} />

                <Typography variant="body2" color="text.secondary" sx={{maxWidth:"320px"}}>
                {course.description}
                </Typography>
            </CardContent>
            <CardActions >
                <Button 
                variant="contained" 
                onClick={()=>{
                    navigate('/edit-course/'+course._id)
                }}
                sx={{
                    width:"100vw",
                    backgroundColor:"#ff9800",
                    '&:hover': {backgroundColor: "#f57c00",}
                    }}
                    >
                    Edit Course
                    </Button>
                    <Button 
                    variant="contained" 
                    onClick={async ()=>{
                        try{
                        const promise=await axios.delete('http://localhost:3000/admin/course/'+course._id,{
                            headers:{
                                "Authorization":"Bearer "+localStorage.getItem("token")
                            }
                        });
                        alert(promise.data.message);
                        let updatedCourseList=courses.filter(e=>e._id!=course._id);
                        setCourses(updatedCourseList);
                        }catch(e){
                            console.log(e);
                        }
                    //navigate('/edit-course/'+course._id)
                    }}
                    sx={{
                    width:"100vw",
                    backgroundColor:"#ff9800",
                    '&:hover': {backgroundColor: "#f57c00",}
                    }}
                    >
                    Delete Course
                    </Button>
            </CardActions>
        </Card>
    )
}

function Notpublished(){
    return(
        <Chip label={
            <Typography variant="button" gutterBottom>
                NOT PUBLISHED
            </Typography>
            } 
            sx={{
            backgroundColor:"#f8bbd0",
            "& .MuiChip-label": {
                color: "#f44336"
            },
            marginBottom:"8.4px",
            marginRight:"7px"
            }} 
        />
    )
}

function Published(){
    return(
        <Chip label={
            <Typography variant="button" gutterBottom>
                PUBLISHED
            </Typography>
            } 
            sx={{
            backgroundColor:"#9ad29c",
            "& .MuiChip-label": {
                color: "#2e7031"
            },
            marginBottom:"8.4px",
            marginRight:"7px"
            }} 
        />
    )
}
export default ShowCourses;