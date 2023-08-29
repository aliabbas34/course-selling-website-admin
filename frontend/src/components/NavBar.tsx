import {useEffect, useState} from "react";
import Card from '@mui/material/Card';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';
import Logo from "./Logo";

function NavBar(){
    const [isLoggedIn, setisLoggedIn]=useState(false);
    useEffect(()=>{
        let loggedIn=localStorage.getItem("token");
        if(loggedIn) setisLoggedIn(true);
        else setisLoggedIn(false);
    },[])
    
    return(
        <Card>
            <div 
            style={{
                display:"flex",
                justifyContent:"space-between", 
                backgroundColor:"white", 
                margin:"7px",
            }}
            >
                <Logo></Logo>
                <div>
                    {isLoggedIn?<Logout/>:<LoginRegister/>}
                </div>
            </div>
        </Card>
    )
}
function Logout(){
    return(
        <div 
            style={{
                display:"flex", 
                justifyContent:"end"
            }}
            >
            <Button
                variant="text" 
                href="/courses" 
                sx={{
                    color:"black", 
                    fontSize:"20px",
                    marginRight:"20px"
                }}
            >
                Show courses
            </Button>
            <Button
                variant="text" 
                href="/create-course" 
                sx={{
                    color:"black", 
                    fontSize:"20px",
                    marginRight:"20px"
                }}
            >
                Create course
            </Button>
            <Button 
            sx={{
                backgroundColor:"#ff9800",
                '&:hover': {
                        backgroundColor: "#f57c00",
                    },
                marginRight:"30px",
                fontSize:"20px"
            }} 
            variant="contained" 
            onClick={()=>{
                localStorage.removeItem("token")
                }}
            href="/"
            >
                logout
            </Button>
        </div>
    )
}
function LoginRegister(){
    return(
            <div 
            style={{
                display:"flex", 
                justifyContent:"end"
            }}
            >
                <Button 
                variant="text" 
                href="/login" 
                sx={{
                    color:"black", 
                    fontSize:"20px",
                    marginRight:"20px"
                    }}
                >
                    Login
                </Button>
                <Button 
                sx={{
                    backgroundColor:"#ff9800", 
                    '&:hover': {
                        backgroundColor: "#f57c00",
                    },
                    fontSize:"20px",
                    marginRight:"30px"
                }} 
                variant="contained" 
                href="/register"
                >
                    Register
                </Button>
            </div>
    )
}

export default NavBar;