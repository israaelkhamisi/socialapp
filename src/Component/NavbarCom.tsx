
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  NavbarBrand,
  
  
} from "flowbite-react";
import { useContext,useEffect,useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import type { User1 } from "../interfaces/posts";


import imglogo from '../assets/route.png'
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function NavbarCom() {
let { userData, setuser, isLoading }: { userData: User1 | null; setuser: (user: User1 | null) => void; isLoading: boolean } = useContext(AuthContext)
const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark')

useEffect(() => {
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}, [isDark])
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
<div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
  <div className="w-full px-3 md:px-[5%]">
  <Navbar fluid className="bg-transparent px-0 dark:bg-transparent">

<div className="flex items-center justify-between w-full gap-4">
      <NavbarBrand href="https://flowbite-react.com">
        <img src={imglogo} className="mr-3 h-6 sm:h-9 rounded-2xl" alt="Flowbite React Logo" />
        <span className="hidden lg:inline self-center leading-tight lg:whitespace-nowrap text-[20px] font-bold dark:text-white">Route Posts</span>
      </NavbarBrand>

      {userData && <div>
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-[#F8FAFC] p-1 dark:border-gray-700 dark:bg-gray-800">
      <NavLink
  to="/Feed"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 font-bold ${
      isActive ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400' : 'text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700'
    }`
  }
><i className="fa-regular fa-house"></i><span className="hidden md:inline">Feed</span></NavLink>
       <NavLink
  to="/Profile"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 font-bold ${
      isActive ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400' : 'text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700'
    }`
  }
><i className="fa-regular fa-user"></i> <span className="hidden md:inline">Profile</span></NavLink>
      <NavLink
  to="/Notifications"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 font-bold ${
      isActive ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400' : 'text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700'
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
      </div>}

      <div className="flex items-center gap-2">
        
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-[#F8FAFC] text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
        >
          <i className={isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
        </button>

{userData ? <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-[#F8FAFC] p-1 dark:border-gray-700 dark:bg-gray-800">
            <Avatar alt="User settings" img={userData?.photo} rounded />
           <span className="hidden md:inline dark:text-white">{userData?.name}</span> <i className="fa-solid fa-bars text-gray-500 dark:text-gray-300"></i>
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
  className="gap-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
>
  Logout
</DropdownItem>

       </Dropdown> : !isLoading && <>
  <NavLink to="/" className="me-2 mt-1 dark:text-gray-200">Register</NavLink>
  <NavLink to="/Login" className="mt-1 dark:text-gray-200">Login</NavLink>
</>}
      </div>

    </div></Navbar>
    </div>
  </div>
 </> )
}
