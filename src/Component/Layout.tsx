import React from 'react'
import NavbarCom from './NavbarCom'
import { Outlet } from 'react-router'

export default function Layout() {
  return (<>
   <NavbarCom/>
   <div className='w-10/12 mx-auto my-5'>
   <Outlet/>
   </div>
 </> )
}
