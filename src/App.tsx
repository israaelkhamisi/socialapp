
import { createHashRouter, RouterProvider ,Navigate } from 'react-router'
import Layout from './Component/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Notfound from './pages/Notfound';
import AuthContextProvider from './Context/AuthContext';
import ProtectedRouting from './Component/Protectedrouting/ProtectedRouting';
import Feed from './pages/Feed';
import PostsDetails from './pages/PostsDetails';
import{ QueryClient,QueryClientProvider,} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AllSuggestions from './pages/AllSuggestions'
import { Offline } from "react-detect-offline";
import Usersprofile from './Component/Usersprofile'
import Notifications from './pages/Notifications';
import ChangePassword from './Component/ChangePassword'
 let routes= createHashRouter([
  {path:'',element:<Layout/>,children:[
    {index:true ,element:<Register/>},
  {path:'Login',element:<Login/>},
  {path:'Suggestions',element:<ProtectedRouting><AllSuggestions/></ProtectedRouting>},
{path:'Profile',element:<ProtectedRouting><Profile/></ProtectedRouting>},
{path:'PostsDetails/:id',element:<ProtectedRouting><PostsDetails/></ProtectedRouting>},
{path:'ChangePassword', element:<ProtectedRouting><ChangePassword/></ProtectedRouting>},
{path:'user/:id', element:<ProtectedRouting><Usersprofile/></ProtectedRouting>},
{path:'Feed',element:<ProtectedRouting> <Feed/></ProtectedRouting>},
{path:'Notifications',element:<ProtectedRouting><Notifications/></ProtectedRouting>},
{path:'*' ,element: <Navigate to="/Feed" replace />}]}])
export default function App() {
const queries =new QueryClient()
  return (
 <>
 <QueryClientProvider client={queries } >
    <AuthContextProvider>
         <RouterProvider router={routes}/>
    </AuthContextProvider>
    <ReactQueryDevtools/>
    </QueryClientProvider>
    <Offline><p className='fixed bottom-0 right-0 bg-red-600 text-white p-2'>You're offline right now. Check your connection.</p></Offline>
 </>

  )
}


