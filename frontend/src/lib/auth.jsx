import axios from "axios";
export const isAuthenticated=()=>{
    let token=localStorage.getItem("token");
    if(token) return true;
}

export const hasJwtExpired=async()=>{
    try{
    const promise=await axios.get('http://localhost:3000/admin/valid',{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("token")
        }
    });
    console.log(promise);
    if(promise.data.message==="jwt expired") localStorage.removeItem("token");
    }catch(e){
        console.log(e);
    }
}