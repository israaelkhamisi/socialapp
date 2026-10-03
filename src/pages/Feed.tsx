
import axios from 'axios'
import PostCard from '../Component/PostCard'
import {useContext ,useState} from 'react'
import { AuthContext } from '../Context/AuthContext'
import type { Post } from '../interfaces/posts'
import CreatePost from '../Component/CreatePost'
import { useQuery } from '@tanstack/react-query'
import { ThreeDots } from 'react-loader-spinner'
import SuggestedFriends from './../Component/SuggestedFriends';

const tabs = [
  { key: 'feed', label: 'Feed', icon: 'fa-regular fa-newspaper' },
  { key: 'myposts', label: 'My Posts', icon: 'fa-solid fa-wand-magic-sparkles' },
  { key: 'community', label: 'Community', icon: 'fa-solid fa-earth-americas' },
  { key: 'saved', label: 'Saved', icon: 'fa-regular fa-bookmark' },
]
export default function Feed() {

  const [activeTab, setActiveTab] = useState('feed')
  const { userData } = useContext(AuthContext)

  function getPosts() {
    return axios.get('https://route-posts.routemisr.com/posts', {
      headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
    })
  }

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ['newposts'],
    queryFn: getPosts,
  })

  const { data: myPostsData } = useQuery({
    queryKey: ['userposts', userData?._id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${userData?._id}/posts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
      }),
    enabled: !!userData,
  })
const { data: savedData } = useQuery({
  queryKey: ['bookmarks'],
  queryFn: () =>
    axios.get('https://route-posts.routemisr.com/users/bookmarks', {
      headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
    }),
  enabled: !!userData,
})
  if (isLoading) {
    return (
      <ThreeDots height="80" width="80" color='#2563eb`' ariaLabel="three-dots-loading" visible={true} />
    )
  }

  if (isError) {
    return <h2 className="text-red-400">{error?.message}</h2>
  }

  const postslist: Post[] = data?.data.data.posts
  const myposts: Post[] = myPostsData?.data.data.posts ?? []
const savedPosts: Post[] = savedData?.data.data.bookmarks ?? []
let shownPosts = postslist
if (activeTab === 'myposts') shownPosts = myposts
if (activeTab === 'saved') shownPosts = savedPosts
return (<> <title>Feed</title>
  <div className="mx-auto grid w-full  max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_340px]">
 
    <nav className="hidden lg:block rounded-3xl bg-white p-3 shadow-sm self-start sticky top-24">
    {tabs.map((tab) => (
  <button
    key={tab.key}
    onClick={() => setActiveTab(tab.key)}
    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold ${
      activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    <i className={tab.icon}></i>
    {tab.label}
  </button>
))}
    </nav >

  
    <div className="flex min-w-0 flex-col gap-6 ">
   {userData && <CreatePost name={userData.name} photo={userData.photo} />}
{shownPosts?.map((el) => (
  <PostCard key={el._id} element={el} />
))}
    </div>


    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <SuggestedFriends />
      </div>
    </aside>
  </div>
  </>
)
}
