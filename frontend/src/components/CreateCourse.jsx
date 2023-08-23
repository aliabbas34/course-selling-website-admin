import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateUpdateCard from "./CreateUpdateCard";
import { hasJwtExpired, isAuthenticated } from "../lib/auth";

function CreateCourse() {
    
    useEffect(()=>{hasJwtExpired()},[]);
    
    const [values,setValues] = useState({
        title:"",
        description:"",
        imageLink:"",
        price:0,
        published:false
    });

    const navigate=useNavigate();

    const handleClick=async ()=>{
        try{
            let data={...values}
            const token=localStorage.getItem("token");
            const promise=await axios.post('http://localhost:3000/admin/courses',
                data,{
                headers:{
                    "Authorization" : `Bearer ${token}`
                }
            }
            )
            alert(promise.data.message);
            console.log(promise.data.courseId);
            navigate('/courses');
        }catch (e){
            console.log(e);
            console.log(e.response.data.message);
        }
    }

    return(
        <div 
        style={{
            height:"100vh",
            width:"100vw", 
            backgroundColor:"#f0f0f0", 
            display:"flex",
            flexDirection:"column",
            justifyContent:"center"
        }}
        >
            <div 
            style={{
                display:"flex",
                flexDirection:"row",
                justifyContent:"center"
            }}
            >
                {isAuthenticated()?<CreateUpdateCard cardTitle={"Create a new Course"} values={values} setValues={setValues} action={"create"} click={handleClick}></CreateUpdateCard>:<h1>Unauthorized</h1>}
            </div>
        </div>
    )
}
export default CreateCourse;