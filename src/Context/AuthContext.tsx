import  { createContext, useEffect, useState } from 'react'
import type { User1 } from '../interfaces/posts'
import axios from 'axios'
export const AuthContext =createContext<any>(null)

export default function AuthContextProvider({children}:any) {
    const [userData,setuser]= useState<User1|null>(null)
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem('usertoken'))
    async function getprofile(token: string|null) {
      try{ const {data} = await axios.get('https://route-posts.routemisr.com/users/profile-data',{
            headers:
            {
                Authorization: `Bearer ${token}`
            }
        })
        setuser(data.data.user)
        
  }catch(err){
  console.log(err)
} finally {
  setIsLoading(false)
}
} 
useEffect(()=>{
  if(localStorage.getItem('usertoken')){
    getprofile(localStorage.getItem('usertoken'))
  }
},[])
  return (
<AuthContext.Provider value={{userData,setuser,isLoading}}>
{children}
</AuthContext.Provider>
  )
}
