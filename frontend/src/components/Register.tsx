import { useState } from "react";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { messageState } from "../store/atoms/message";
import { useSetRecoilState } from "recoil";
import Logo from "./Logo";
/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setRegister=useSetRecoilState(messageState);

    const navigate=useNavigate();

    const handleClick=async ()=>{
        try{
        const promise=await axios.post('http://localhost:3000/admin/signup',{
            username:email,
            password:password
        });
        let token=promise.data.token;
        localStorage.setItem("token",token);
        navigate('/');
        setRegister({login:false,register:true,delete:false});
        } catch (e:any){
            alert(e.response.data.message);
        }
        
    }

    return <div 
    style={{
        height:"100vh", 
        width:"100vw", 
        backgroundColor:"rgb(243, 246, 249)", 
        display:"flex",
        flexDirection:"column",
        justifyContent:"center"
        }}>
        
        <div style={{display:"flex", justifyContent:"center"}}>

        <Card sx={{minWidth:"400px", minHeight:"350px", display:"flex",flexDirection:"column",justifyContent:"center"}}>

        <div 
        style={{
            display:"flex",
            justifyContent:"center",
            marginTop:"30px",
            marginBottom:"50px"
            }}>
        <Logo></Logo>
        </div>

            <TextField 
                id="outlined-basic" 
                label="email" 
                placeholder="user@mail.com" 
                variant="outlined" 
                type="email" 
                onChange={e => setEmail(e.target.value)} 
                sx={{
                    '& label.Mui-focused': {
                        color: "#f57c00",
                    }, 
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                        }
                    },
                    marginRight:"30px",
                    marginLeft:"20px",
                    marginBottom:"10px"
                }}
            />
            <TextField 
                id="outlined-basic" 
                label="password" 
                variant="outlined" 
                type="password" 
                onChange={e => setPassword(e.target.value)} 
                sx={{
                    '& label.Mui-focused': {
                        color: "#f57c00",
                    }, 
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                        }
                    },
                    marginTop:"10px",
                    marginRight:"30px",
                    marginLeft:"20px",
                    marginBottom:"10px"
                }}
            />
            <Button 
            sx={{
                backgroundColor:"#ff9800", 
                '&:hover': {
                    backgroundColor: "#f57c00",
                },
                marginTop:"10px",
                marginRight:"20px",
                marginLeft:"20px",
                marginBottom:"7px",
            }}
            variant="contained"
            onClick={handleClick}
            >
                Create Account
            </Button>
            <div style={{display:"flex",justifyContent:"start", marginTop:"30px", marginLeft:"30px", marginBottom:"20px"}}> 
            <Typography variant="body1" gutterBottom>Already a member? <a href="/login">Login</a></Typography>
            </div>
        </Card>
        </div>
    </div>
}

export default Register;