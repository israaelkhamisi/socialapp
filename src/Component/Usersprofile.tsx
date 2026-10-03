import { useParams } from 'react-router'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Post, User1 } from '../interfaces/posts'
import { Avatar } from 'flowbite-react/components/Avatar'
import PostCard from './PostCard'

export default function UserProfile() {
    
  const { id } = useParams()
function getUserProfile() {
  return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
  })
}
const { data } = useQuery({
  queryKey: ['userProfile', id],
  queryFn: getUserProfile,
})

const user: User1 | undefined = data?.data.data.user
const isFollowing: boolean = data?.data.data.isFollowing ?? false
function toggleFollow() {
  return axios.put(
    `https://route-posts.routemisr.com/users/${id}/follow`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
  )
}
const queries = useQueryClient()

const { mutate: handleFollow, isPending } = useMutation({
  mutationFn: toggleFollow,
  onSuccess: () => {
    queries.invalidateQueries({ queryKey: ['userProfile', id] })
    queries.invalidateQueries({ queryKey: ['friends'] })
  },
})
function getUserPosts() {
  return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
  })
}

const { data: postsData } = useQuery({
  queryKey: ['userposts', id],
  queryFn: getUserPosts,
})

const posts: Post[] = postsData?.data.data.posts ?? []
if (!user) return null

 return (
 <div className="mx-auto w-full max-w-6xl px-4 py-8">
  <title>{user.name}</title>

  <div className="w-full overflow-hidden rounded-3xl bg-white shadow-sm">

    <div
      className="h-56 bg-linear-to-r from-slate-800 via-blue-900 to-sky-500 bg-cover bg-center"
      style={user.cover ? { backgroundImage: `url(${user.cover})` } : undefined}
    ></div>

    <div className="relative mx-4 -mt-20 mb-6 rounded-3xl bg-white/90 p-6 backdrop-blur md:mx-10">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
   
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-start">
          <div className="rounded-full border-4 border-white bg-white shadow-sm">
            <Avatar img={user.photo} rounded size="xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
            <p className="text-lg text-gray-500">@{user.username}</p>
          </div>
        </div>

      
        <button
          onClick={() => handleFollow()}
          disabled={isPending}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold disabled:opacity-60 ${
            isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <i className={`fa-solid ${isFollowing ? 'fa-user-check' : 'fa-user-plus'}`}></i>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  </div>

  <div className="mt-6 flex flex-col gap-6">
    {posts.map((post) => (
      <PostCard key={post._id} element={post} />
    ))}
  </div>
</div>
)
}