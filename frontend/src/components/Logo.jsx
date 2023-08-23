import Typography from '@mui/material/Typography';
function Logo(){
    return(
        <a 
            href="/" 
            style={{
                textDecoration:"none",
                display:"flex",
                flexDirection:"column", 
                justifyContent:"center",
                marginLeft:"10px"
                }}
            >  
                    <Typography 
                    variant="button" 
                    display="block" 
                    gutterBottom 
                    sx={{
                        margin:"0px", 
                        lineHeight:"1",
                        color:"black",
                        fontSize:"30px"
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
                        fontSize:"21px"
                    }}
                    >
                        Commerce
                    </Typography>
                </a>
    )
}

export default Logo