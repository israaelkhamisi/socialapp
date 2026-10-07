

import { Button, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate, NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";



export default function Login() {
  let {setuser}= useContext(AuthContext)
let nav = useNavigate()
const validschema =zod.object({
  
   
    email:zod.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Email is not valid"),

    password:zod.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain uppercase, lowercase, number and special character, min 8 chars"),
   
})

type user =zod.infer<typeof validschema>

 const {handleSubmit,register,setValue,formState:{errors}} =useForm<user>(
    { defaultValues:{
    
    email:'',
    password:'',
  
    }
,resolver:zodResolver(validschema)

})

    function handleApi(values: user){
axios.post('https://route-posts.routemisr.com/users/signin',values).then(({data})=>{

Swal.fire({
  icon: "success",
  title: "success!",
  text: data.message,
  confirmButtonText:'cool'

})
setuser(data?.data?.user)
console.log(data.data)
localStorage.setItem('usertoken',data.data.token)
setTimeout(()=>{
    nav('/Profile')
},2000);
}).catch(({response :{data}})=>{
    Swal.fire({
  icon: "error",
  title: "Error!",
  text:data.message,

}) ;
})
}

return (
  <div className="flex min-h-screen items-center px-4 py-10">
    <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
  
      <div className="hidden lg:block">
        <h1 className="text-6xl font-extrabold tracking-tight text-blue-900 dark:text-blue-400">Route Posts</h1>
        <p className="mt-4 max-w-xl text-2xl text-gray-700 dark:text-gray-300">
          Connect with friends and the world around you on Route Posts.
        </p>

        <div className="mt-8 rounded-3xl border border-blue-100 bg-white/70 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-bold tracking-widest text-blue-900 uppercase dark:text-blue-400">About Route Academy</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Egypt's Leading IT Training Center Since 2012</h2>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
            Route Academy is the premier IT training center in Egypt, established in 2012. We specialize in
            delivering high-quality training courses in programming, web development, and application development.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['2012', 'Founded'],
              ['40K+', 'Graduates'],
              ['50+', 'Partner companies'],
              ['5', 'Branches'],
              ['20', 'Diplomas available'],
            ].map(([num, label]) => (
              <div key={label} className="rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-lg font-bold text-blue-900 dark:text-blue-400">{num}</p>
                <p className="text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:justify-self-end dark:bg-gray-800">
        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-gray-900">
          <span className="rounded-xl bg-white py-2.5 text-center font-bold text-blue-900 shadow-sm dark:bg-gray-700 dark:text-blue-400">Login</span>
          <NavLink to="/" className="rounded-xl py-2.5 text-center font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Register
          </NavLink>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Log in to Route Posts</h2>
        <p className="mt-1 mb-6 text-gray-500 dark:text-gray-400">Log in and continue your social journey.</p>

        <form onSubmit={handleSubmit(handleApi)} className="flex flex-col gap-4">
          <div>
            <TextInput
              {...register('email')}
              type="email"
              placeholder="Email"
              sizing="lg"
              icon={() => <i className="fa-regular fa-user text-gray-400"></i>}
              color={errors.email ? 'failure' : 'gray'}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <TextInput
              {...register('password')}
              type="password"
              placeholder="Password"
              sizing="lg"
              icon={() => <i className="fa-solid fa-key text-gray-400"></i>}
              color={errors.password ? 'failure' : 'gray'}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            Log In
          </Button>
        </form>
      </div>
    </div>
  </div>
)
    
  }
