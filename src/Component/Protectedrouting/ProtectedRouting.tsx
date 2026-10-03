
import { Navigate } from 'react-router'


export default function ProtectedRouting({children}:any) {
    if(localStorage.getItem('usertoken')){
  
  return children  }else{
    return <Navigate to='/Login'/>
  }
}
