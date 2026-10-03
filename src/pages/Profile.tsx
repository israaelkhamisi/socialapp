import { useContext,useState } from 'react'
import { Avatar } from 'flowbite-react'
import type { Post, User1 } from '../interfaces/posts'
import { AuthContext } from '../Context/AuthContext'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PostCard from '../Component/PostCard'


export default function Profile() {


  const { userData ,setuser}: { userData: User1 | null ;setuser: (user: User1) => void } = useContext(AuthContext)
    const {data}=useQuery({
    queryKey:['userposts',userData?._id],
    queryFn:getmyposts,
    enabled:!!userData,
  })
    function getmyposts(){
    return axios.get(`https://route-posts.routemisr.com/users/${userData?._id}/posts`,{
       headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
    })

  }
  const myposts:post[]=data?.data.data.posts ?? []
 const queries=useQueryClient() 
const[isactive,setactivetab]=useState('posts')
const [showPhoto, setShowPhoto] = useState(false)
function updatePhoto(photo:File){
  const formdata= new FormData()
formdata.append('photo',photo)
  return axios.put('https://route-posts.routemisr.com/users/upload-photo',formdata,{
     headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
  })
}
const{mutate}=useMutation({
  mutationFn:updatePhoto,
onSuccess: (res) => {
  if (userData)  setuser({ ...userData, photo: res.data.data.photo })
    queries.invalidateQueries({ queryKey: ['userposts'] })
},
})
function updatecover(cover:File){
  const formdata= new FormData()
formdata.append('cover',cover)
  return axios.put('https://route-posts.routemisr.com/users/upload-cover',formdata,{
     headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
  })
}
const{mutate:handlecover}=useMutation({
  mutationFn:updatecover,
onSuccess: (res) => {
  if (userData)  setuser({ ...userData, cover: res.data.data.cover })
    queries.invalidateQueries({ queryKey: ['userposts'] })
},
})

const {data: bookmarksData}=useQuery({
  queryKey:['bookmarks'],
  queryFn:getbookmarks,
  enabled:!! userData
})
function getbookmarks(){
  return axios.get(`https://route-posts.routemisr.com/users/bookmarks`,{
     headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
  })
}
const bookmarks:Post[]= bookmarksData?.data.data.bookmarks ?? []
  if (!userData) return null

  const stats = [
    { label: 'Followers', value: userData.followersCount },
    { label: 'Following', value: userData.followingCount },
    { label: 'Bookmarks', value: userData.bookmarks?.length},
  ]


  return ( <>
   <title>Profile</title>
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
     <div className="w-full overflow-hidden rounded-3xl bg-white shadow-sm">

  <div
    className="relative h-56 bg-linear-to-r from-slate-800 via-blue-900 to-sky-500 bg-cover bg-center"
    style={userData.cover ? { backgroundImage: `url(${userData.cover})` } : undefined}
  >
    <label className="absolute top-4 right-4 flex cursor-pointer items-center gap-2 rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-black/60">
      <i className="fa-solid fa-camera"></i>
      <span className="hidden sm:inline">Change cover</span>
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => { e.target.files?.[0] && handlecover(e.target.files[0]) }}
      />
    </label>
  </div>
  <div className="group relative mx-4 -mt-20 mb-6 rounded-3xl bg-white/90 p-6 backdrop-blur md:mx-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
<div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-start">
  <div className="relative">
    <div
      onClick={() => setShowPhoto(true)}
      className="cursor-pointer rounded-full border-4 border-blue-100 bg-white p-1"
    >
      <Avatar img={userData.photo} rounded size="xl" />
    </div>

    <button
      onClick={() => setShowPhoto(true)}
      className="absolute  opacity-0 transition-opacity group-hover:opacity-100 bottom-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm hover:bg-gray-50"
    >
      <i className="fa-solid fa-expand"></i>
    </button>

    <label className="absolute opacity-0 transition-opacity group-hover:opacity-100 right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700">
      <i className="fa-solid fa-camera"></i>
      <input
        onChange={(e) => { e.target.files?.[0] && mutate(e.target.files[0]) }}
        type="file"
        accept="image/*"
        hidden
      />
    </label>
  </div>

  <div>
    <h1 className="text-3xl font-extrabold text-gray-900 md:text-1xl">{userData.name}</h1>
    <p className="text-1xl text-gray-500">@{userData.username}</p>
    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
      <i className="fa-solid fa-user-group"></i> Route Posts member
    </span>
  </div>
</div>

     
            <div className="grid grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-200 bg-white px-4 py-5 text-center sm:px-8">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{item.label}</p>
                  <p className="mt-1 text-3xl font-extrabold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

     
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
          
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5 lg:col-span-2">
              <h2 className="mb-3 font-bold text-gray-900">About</h2>
              <p className="flex items-center gap-3 text-gray-600">
                <i className="fa-regular fa-envelope w-4"></i> {userData.email}
              </p>
              <p className="mt-2 flex items-center gap-3 text-gray-600">
                <i className="fa-solid fa-user-group w-4"></i> Active on Route Posts
              </p>
            </div>

          
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                <p className="text-xs font-semibold tracking-wide text-blue-800 uppercase">My posts</p>
                <p className="mt-1 text-2xl font-extrabold text-gray-900">{myposts.length}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                <p className="text-xs font-semibold tracking-wide text-blue-800 uppercase">Saved posts</p>
                <p className="mt-1 text-2xl font-extrabold text-gray-900">{bookmarks.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 {showPhoto && (
  <div
    onClick={() => setShowPhoto(false)}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
  >
    <button
      onClick={() => setShowPhoto(false)}
      className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
    >
      <i className="fa-solid fa-xmark"></i>
    </button>

    <img
      src={userData.photo}
      alt={userData.name}
      onClick={(e) => e.stopPropagation()}
      className="max-h-full max-w-full object-contain"
    />
  </div>
)}
<div className="mt-6 flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-3 shadow-sm">
  <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
    <button onClick={()=>setactivetab('posts')} className={`flex items-center gap-2 rounded-xl  px-4 py-2 font-semibold ${isactive == 'posts' ? "bg-white text-blue-600 shadow-sm rounded-lg"  : "text-gray-600 hover:text-gray-900"} `}>
      <i className="fa-regular fa-file-lines"></i> My Posts
    </button>
    <button  onClick={()=>setactivetab('saved')} className={` flex items-center gap-2 rounded-xl px-4 py-2 font-semibold ${ isactive == 'saved' ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900" }`}>
      <i className="fa-regular fa-bookmark"></i> Saved
    </button>
  </div>

  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">{isactive === 'posts'? myposts.length : bookmarks.length}</span>
</div>

<div className="mt-6 flex flex-col gap-6 ">
 {isactive === 'posts' && myposts.map((post) => (
  <PostCard key={post._id} element={post} />
))}
{isactive ==='saved'&& bookmarks.map((post)=>(
  <PostCard key={post._id} element={post} bookmarked={true} />
))}
</div>
    </div>
    
  </>)
}
