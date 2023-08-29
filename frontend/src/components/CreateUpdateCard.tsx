import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
type typeOfValue={
    title:string,
    description:string,
    imageLink:string,
    price:number,
    published:boolean
}


function CreateUpdateCard(props:{cardTitle:string,values:typeOfValue,setValues:Function,action:string,click:()=>Promise<void>}){// cardTitle, values, setValues, action, click
    const navigate=useNavigate();
    return(
        <Card 
                style={{
                    minWidth:"500px"
                }}
                >
                <div style={{ display:"flex", flexDirection:"column" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginTop:"20px" }}>
                        <Typography variant="h5" gutterBottom >
                            {props.cardTitle}
                        </Typography>
                    </div>
                    <TextField required id="outlined-required" label="Title" variant="outlined"
                        defaultValue={props.values.title}
                        onChange={e => props.setValues({...props.values,title:e.target.value})} 
                        sx={{
                            '& label.Mui-focused': {
                                color: "#ff9800",
                            }, 
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff9800',
                                }
                            },
                            marginTop:"10px", marginRight:"30px", marginLeft:"20px", marginBottom:"20px"
                        }}
                    />
                    <TextField multiline required id="outlined-multiline" label="Description" rows={2}
                        defaultValue={props.values.description}
                        onChange={e => props.setValues({...props.values,description:e.target.value})} 
                        sx={{
                            '& label.Mui-focused': {
                                color: "#ff9800",
                            }, 
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff9800',
                                }
                            },
                            marginRight:"30px", marginLeft:"20px", marginBottom:"20px"
                        }}
                    />
                    <TextField 
                        required
                        id="outlined-required" 
                        label="Image Link" 
                        variant="outlined" 
                        defaultValue={props.values.imageLink}
                        onChange={e => props.setValues({...props.values,imageLink:e.target.value})} 
                        sx={{
                            '& label.Mui-focused': {
                                color: "#ff9800",
                            }, 
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff9800',
                                }
                            },
                            marginRight:"30px",
                            marginLeft:"20px",
                            marginBottom:"20px"
                        }}
                    />
                    <div>
                    <TextField 
                        required
                        id="outlined-required" 
                        label="Price" 
                        variant="outlined" 
                        type="number"
                        defaultValue={props.values.price}
                        onChange={e => props.setValues({...props.values,price:Number(e.target.value)})} 
                        sx={{
                            '& label.Mui-focused': {
                                color: "#ff9800",
                            }, 
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff9800',
                                }
                            },
                            marginRight:"30px",
                            marginLeft:"20px",
                            marginBottom:"10px"
                        }}
                    />
                        <FormControlLabel
                        control={
                        <Checkbox 
                        sx={{
                            '&.Mui-checked': {
                            color: "#ff9800",
                            },
                        }}
                        checked={props.values.published}
                        onChange={e => {
                            e.preventDefault();
                            let pblish=props.values.published;
                            props.setValues({...props.values,published:!pblish});
                        }}
                        />
                        }
                        label="Publish"
                        />
                    </div>
                    <div style={{display:"flex",justifyContent:"center",margin:"25px"}}>
                        <Button 
                            variant="text" 
                            // href="/login"
                            onClick={()=>{
                                if(props.action==="Update") navigate('/courses/');
                                else navigate('/');
                                }
                            }
                            sx={{
                                color:"black", 
                                marginRight:"7px"
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                            sx={{
                                backgroundColor:"#ff9800", 
                                '&:hover': {
                                    backgroundColor: "#f57c00",
                                }
                            }} 
                            variant="contained" 
                            onClick={props.click}
                            // href="/register"
                            >
                                {props.action}
                        </Button>
                    </div>
                </div>
                </Card>
    )
}

export default CreateUpdateCard;