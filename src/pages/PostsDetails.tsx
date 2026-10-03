import axios from 'axios'
import { Link, useParams } from 'react-router'
import PostCard from '../Component/PostCard'
import type { Post } from '../interfaces/posts'
import { useQuery } from '@tanstack/react-query'
import {Bars} from 'react-loader-spinner'
export default function PostsDetails() {
    
    const{id}=useParams()
    console.log(id)
    const {isError,isLoading,error,data,refetch}=useQuery({
      queryKey:['postdetails',id],
      queryFn:getSinglePost
    })
    function getSinglePost() {
      return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
             headers:{
      Authorization:`Bearer ${localStorage.getItem('usertoken')}`
    }
        })
       
    }
    if(isLoading){
      return<Bars
height="80"
width="80"
color="gray"
ariaLabel="bars-loading"
wrapperStyle={{}}
wrapperClass=""
visible={true}
/>
    }
    if(isError){
        return(
          <h2 className='text-red-500'>{error?.message}</h2>
        )

    }

const post:Post =data?.data.data.post
 return (<>
  {post && <title>{`Post | ${post.user.name}`}</title>}
    <Link to='/feed'  className=" inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm 
    font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
         <i className="fa-solid fa-arrow-left"></i>back</Link>
  <div className="w-full flex justify-center py-8">
    {post && <PostCard element={post}  refetch={refetch} />}
  </div>
</>)
}
