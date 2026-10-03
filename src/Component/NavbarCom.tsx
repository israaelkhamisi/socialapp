
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  NavbarBrand,
  
  
} from "flowbite-react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import type { User1 } from "../interfaces/posts";


import imglogo from '../assets/route.png'
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function NavbarCom() {
let { userData, setuser, isLoading }: { userData: User1 | null; setuser: (user: User1 | null) => void; isLoading: boolean } = useContext(AuthContext)
  let navg =useNavigate()
function Logout(){
  localStorage.removeItem('usertoken')
setuser(null)
navg('/Login')
}
const { data: unreadData } = useQuery({
  queryKey: ['notifications', 'unread-count'],
  queryFn: getUnreadNotification,
  enabled: !!userData,
})
const unreadcount: number = unreadData?.data.data.unreadCount ?? 0
function getUnreadNotification() {
  return axios.get('https://route-posts.routemisr.com/notifications/unread-count', {
    headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
  })
}
  return (<>
<div className="border-b border-gray-200 bg-white">
  <div className="mx-auto w-[90%]">
    <Navbar fluid className="bg-white px-0">
    
<div className="flex items-center justify-between w-full g-4">
      <NavbarBrand href="https://flowbite-react.com">
        <img src={imglogo} className="mr-3 h-6 sm:h-9 rounded-2xl" alt="Flowbite React Logo" />
        <span className=" hidden md:inline self-center whitespace-nowrap text-[20px]  dark:text-white font-bold">Route Posts</span>
      </NavbarBrand>
        {userData && <div >
      <div className="flex items-center gap-1 border border-gray-200 rounded-full bg-[#F8FAFC] p-1 ">
      <NavLink
  to="/Feed"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 font-bold ${
      isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white'
    }`
  }
><i className="fa-regular fa-house"></i><span className="hidden md:inline">Feed</span></NavLink>
       <NavLink
  to="/Profile"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 font-bold ${
      isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white'
    }`
  }
><i className="fa-regular fa-user"></i> <span className="hidden md:inline" >Profile</span></NavLink>
      <NavLink
  to="/Notifications"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 font-bold ${
      isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white'
    }`
  }
><span className="relative">
  <i className="fa-regular fa-comment"></i>
  {unreadcount > 0 && (
    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
      {unreadcount}
    </span>
  )}
</span> <span className="hidden md:inline">Notifications</span></NavLink>
      </div>
      </div> }
      <div className="flex ">
{userData ? <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex items-center gap-2 border border-gray-200 rounded-full bg-[#F8FAFC] p-1">
            <Avatar alt="User settings" img={userData?.photo} rounded />
           <span className="hidden md:inline">{userData?.name}</span> <i className="fa-solid fa-bars text-gray-500"></i>
            </div>
          }
        >
       
        <DropdownItem as={NavLink} to="/Profile" className="gap-3">
  <i className="fa-regular fa-user w-4"></i> Profile
</DropdownItem>
<DropdownItem as={NavLink} to="/ChangePassword" className="gap-3">
  <i className="fa-solid fa-gear w-4"></i> Settings
</DropdownItem>
<DropdownDivider />
<DropdownItem
  onClick={Logout}
  className="gap-3 rounded-lg text-red-600 hover:bg-red-50"
>
  Logout
</DropdownItem>
         
       </Dropdown> : !isLoading && <>
  <NavLink to="/" className='me-2 mt-1 active'>Register</NavLink>
  <NavLink to="/Login"  className=' mt-1'>Login</NavLink>
</>   }

       
    
      </div>
    
     
    </div></Navbar>
    </div>
  </div>
  
 </> );
}
