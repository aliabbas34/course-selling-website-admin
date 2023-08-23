import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { hasJwtExpired, isAuthenticated } from "../lib/auth";
import CreateUpdateCard from "./CreateUpdateCard";
function Edit(){

    let courseId=useParams();
    courseId=courseId.courseId;
    const [course, setCourse] = useState(null);
    const navigate=useNavigate();

    const handleClick=async ()=>{
        try{
        const promise=await axios.put('http://localhost:3000/admin/courses/'+courseId,course,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        });
        alert(promise.data.message);
        navigate('/courses/');
        }catch(e){
            console.log(e);
            console.log(e.response.data.message);
        }
    }

    useEffect(()=>{
        hasJwtExpired();
        async function getCourse(){
        try{
        const promise= await axios.get('http://localhost:3000/admin/course/'+courseId,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        });
        setCourse(promise.data.course);
        }catch (e){
            console.log(e);
            console.log(e.response.data.message);
        }
        }
        hasJwtExpired()
        isAuthenticated()?getCourse():alert("session expired");
    },[]);

    if (!course) {
        return <div style={{height: "100vh", justifyContent: "center", flexDirection: "column"}}>
            Loading....
        </div>
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
                {isAuthenticated()?<CreateUpdateCard cardTitle={"Update Course"} values={course} setValues={setCourse} action={"Update"} click={handleClick}></CreateUpdateCard>:<h1>Unauthorized</h1>}
            </div>
        </div>
    )
}

export default Edit;