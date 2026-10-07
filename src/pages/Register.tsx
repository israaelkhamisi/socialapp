import { Button, Datepicker, TextInput, Select } from "flowbite-react";
import { useNavigate, NavLink } from "react-router";
import { useForm } from "react-hook-form";
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import Swal from 'sweetalert2'




export default function Register() {
let nav = useNavigate()
const validschema =zod.object({
    name:zod.string().min(2,'min char is 2').max(20,'max char  is 20'),
    username:zod.string().min(2,'min char is 2').max(20,'max char  is 20'),
   
   
    email:zod.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Email is not valid"),
     dateOfBirth:zod.date().refine((data:Date)=>{
        const nowDate =new Date()
        const nowYear = nowDate.getFullYear()
        const dateofbirth = data.getFullYear()
        return (nowYear-dateofbirth) >10
    },{
        error: 'Date not valid'
    }),
     gender:zod.enum(['male','female']),
    password:zod.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain uppercase, lowercase, number and special character, min 8 chars"),
    rePassword:zod.string()
}).refine((data)=>{
    return data.password == data.rePassword
},{
    error:'rePassword is not match',
    path:['rePassword']
})
    
type user =zod.infer<typeof validschema>

 const {handleSubmit,register,setValue,formState:{errors}} =useForm<user>(
    { defaultValues:{
        name:'',
         username:'',
    gender:'male',
    email:'',
    password:'',
   rePassword:''
    }
,resolver:zodResolver(validschema)

})

 async   function handleApi(values: user){
 let data = await axios.post('https://route-posts.routemisr.com/users/signup',values).then((data)=>{

Swal.fire({
  icon: "success",
  title: "success!",
  text: data.data.message,
  confirmButtonText:'cool'

})
setTimeout(()=>{
    nav('/Login')
},2000);
}).catch((err)=>{
    Swal.fire({
  icon: "error",
  title: "Error!",
  text:err.response?.data.message,

});
})
    }
  return (
    <div className="flex min-h-screen items-center px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">

  
        <div className="hidden lg:block">
          <h1 className="text-6xl font-extrabold tracking-tight text-blue-900 dark:text-blue-400">Route Posts</h1>
          <p className="mt-4 max-w-xl text-2xl text-gray-700 dark:text-gray-300">
            Join the community and start sharing your moments with friends.
          </p>
          <ul className="mt-8 flex flex-col gap-4 text-lg text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <i className="fa-solid fa-pen-to-square w-6 text-blue-600 dark:text-blue-400"></i> Share posts and photos
            </li>
            <li className="flex items-center gap-3">
              <i className="fa-solid fa-comments w-6 text-blue-600 dark:text-blue-400"></i> Comment and reply in real time
            </li>
            <li className="flex items-center gap-3">
              <i className="fa-solid fa-user-group w-6 text-blue-600 dark:text-blue-400"></i> Follow friends and discover new people
            </li>
          </ul>
        </div>

          <div className="w-full max-w-md justify-self-center rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:justify-self-end dark:bg-gray-800">
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-gray-900">
            <NavLink to="/Login" className="rounded-xl py-2.5 text-center font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Login
            </NavLink>
            <span className="rounded-xl bg-white py-2.5 text-center font-bold text-blue-900 shadow-sm dark:bg-gray-700 dark:text-blue-400">
              Register
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-1 mb-6 text-gray-500 dark:text-gray-400">It's quick and easy.</p>

          <form onSubmit={handleSubmit(handleApi)} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <TextInput {...register('name')} placeholder="Full name" icon={() => <i className="fa-regular fa-user text-gray-400"></i>} color={errors.name ? 'failure' : 'gray'} />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <TextInput {...register('username')} placeholder="Username" icon={() => <i className="fa-solid fa-at text-gray-400"></i>} color={errors.username ? 'failure' : 'gray'} />
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <TextInput {...register('email')} type="email" placeholder="Email" icon={() => <i className="fa-regular fa-envelope text-gray-400"></i>} color={errors.email ? 'failure' : 'gray'} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Datepicker onChange={(date) => { date && setValue('dateOfBirth', date) }} placeholder="Date of birth" />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <Select {...register('gender')}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
                {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <TextInput {...register('password')} type="password" placeholder="Password" icon={() => <i className="fa-solid fa-key text-gray-400"></i>} color={errors.password ? 'failure' : 'gray'} />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <TextInput {...register('rePassword')} type="password" placeholder="Confirm password" icon={() => <i className="fa-solid fa-lock text-gray-400"></i>} color={errors.rePassword ? 'failure' : 'gray'} />
              {errors.rePassword && <p className="mt-1 text-sm text-red-500">{errors.rePassword.message}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )

}
