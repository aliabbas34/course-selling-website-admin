
import {useEffect} from "react";
import * as React from 'react'; //snackbar code

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { hasJwtExpired } from "../lib/auth";
import NavBar from "./NavBar";

import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';//snackbar code
import MuiAlert from '@mui/material/Alert';//snackbar code

import { useRecoilValue, useSetRecoilState } from "recoil";//snackbar code
import { messageState } from "../store/atoms/message";//snackbar code
import { loginState } from "../store/selectors/login";//snackbar code
import { registerState } from "../store/selectors/register";



function Landing() {

    useEffect(()=>{hasJwtExpired()},[])

    const setMessage=useSetRecoilState(messageState);//snackbar code
    const login=useRecoilValue(loginState);//snackbar code
    const register=useRecoilValue(registerState);

    const Alert = React.forwardRef(function Alert(props, ref) {//snackbar code
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

      const handleCloseLogin = (event, reason) => {//snackbar code
        if (reason === 'clickaway') {
          return;
        }
        setMessage({login:false});
      };

      const handleCloseRegister = (event, reason) => {//snackbar code
        if (reason === 'clickaway') {
          return;
        }
        setMessage({Register:false});
      };

    return <div 
            style={{ 
                backgroundColor:"rgb(243, 246, 249)", 
                width:"100%",
                height:"100%",
            }}
            >
            <div style={{zIndex:"1"}}>
                <NavBar></NavBar>
</div>
                <Typography 
                    variant="button" 
                    display="block" 
                    gutterBottom 
                    sx={{display:"flex",justifyContent:"center",marginTop:"20px", fontSize:"20px"}}
                    >
                        Admin Panel
                </Typography>

                <div style={{display:"flex",flexDirection:"column",justifyContent:"center" ,height:"80vh"}}>

                <div style={{marginLeft:"50px", display:"flex",justifyContent:"space-between" ,marginRight:"50px"}}>

                <div>

                <Typography variant="h1" gutterBottom sx={{margin:"0px"}}>
                    Welcome to,
                </Typography>
                
                <Typography 
                    variant="button" 
                    display="block" 
                    gutterBottom 
                    sx={{
                        margin:"0px", 
                        lineHeight:"1",
                        color:"black",
                        fontSize:"150px"
                    }}
                    >
                        Course
                </Typography>

                <Typography 
                    variant="button" 
                    display="block" 
                    gutterBottom 
                    sx={{
                        margin:"0px", 
                        lineHeight:"1", 
                        color:"#ff9800",
                        fontSize:"103px"
                    }}
                    >
                        Commerce
                </Typography>

                </div>

                <img src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="think about things differently" height={400}/>

                </div>

                </div>

                <Snackbar open={login} autoHideDuration={6000} onClose={handleCloseLogin}>
                    <Alert onClose={handleCloseLogin} severity="success" sx={{ width: '100%' }}>
                    Logged in succesfully!
                    </Alert>
                </Snackbar>

                <Snackbar open={register} autoHideDuration={6000} onClose={handleCloseRegister}>
                    <Alert onClose={handleCloseRegister} severity="success" sx={{ width: '100%' }}>
                    Registration Successfull!
                    </Alert>
                </Snackbar>

            </div>
}

export default Landing;