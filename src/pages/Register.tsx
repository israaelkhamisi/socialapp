
import { Button, Datepicker, Label, TextInput ,Select} from "flowbite-react";
import { useForm } from "react-hook-form";
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router";



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
    <>
   <div className="min-h-screen flex justify-center items-center">
  <form onSubmit={handleSubmit(handleApi)} className="border border-gray-300/30 rounded-xl p-5 bg-gray-100 flex max-w-md flex-col gap-4 w-full">

    <div>
      <div className="mb-2 block">
        <Label htmlFor="name">Your name</Label>
      </div>
      <TextInput {...register('name')} id="name" type="text" shadow />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
    </div>
  <div>
      <div className="mb-2 block">
        <Label htmlFor="username">Your username</Label>
      </div>
      <TextInput {...register('username')} id="username" type="text" shadow />
      {errors.username && <p className="text-red-500">{errors.username.message}</p>}
    </div>
    <div>
    

    <div>
      <div className="mb-2 block">
        <Label htmlFor="email2">Your email</Label>
      </div>
      <TextInput {...register('email')} id="email2" type="email" placeholder="name@flowbite.com" shadow />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
    </div>

  <div className="mb-2 block">
        <Label htmlFor="dateofbirth">Date of birth</Label>
      </div>
      <Datepicker
        onChange={(date) => { setValue('dateOfBirth', date) }}
        id="dateOfBirth"
        autoHide={false}
      />
      {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
    </div>

    <div>
      <div className="mb-2 block">
        <Label htmlFor="gender">Select your gender</Label>
      </div>
      <Select {...register('gender')} id="gender">
        <option value='male'>Male</option>
        <option value='female'>Female</option>
      </Select>
      {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="password2">Your password</Label>
      </div>
      <TextInput {...register('password')} id="password2" type="password" shadow />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
    </div>

    <div>
      <div className="mb-2 block">
        <Label htmlFor="repassword">Repeat password</Label>
      </div>
      <TextInput {...register('rePassword')} id="rePassword" type="password" shadow />
      {errors.rePassword && <p className="text-red-500">{errors.rePassword.message}</p>}
    </div>

    <Button className="bg-sky-600 w-full" type="submit">Register new account</Button>

  </form>
</div>
 </> );
}
