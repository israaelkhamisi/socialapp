import { Link } from 'react-router'
import { Avatar } from 'flowbite-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react';
import axios from 'axios';
import type {Friend}  from '../interfaces/Friends'


export default function AllSuggestions() {
  const [search, setSearch] = useState('')

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({

    queryKey:['friends','all',search],
   queryFn: ({ pageParam }) => getSuggestedFriends(pageParam),
   initialPageParam: 1,
   getNextPageParam: (lastPage) => lastPage.data.meta.pagination.nextPage,
  })
  function getSuggestedFriends(page:number){
   return axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=20&q=${search}&page=${page}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
    })
  
  }
    const friends: Friend[] = data?.pages.flatMap((page) => page.data.data.suggestions) ?? []

   return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Link
        to="/feed"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <i className="fa-solid fa-arrow-left"></i> Back to feed
      </Link>

      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      
        <div className="mb-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <i className="fa-solid fa-user-group text-blue-600"></i> All Suggested Friends
          </h1>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-semibold text-gray-600">
            {friends.length}
          </span>
        </div>

      
        <div className="relative mb-5">
          <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"></i>
          <input value={search}
            type="text"
            placeholder="Search by name or username..."
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 ps-11 pe-4 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

    
        <div className="grid gap-4 md:grid-cols-2">
         {friends.map((el)=>{
          return  <div key={el._id} className="rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar img={el.photo} rounded size="md" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{el.name}</p>
                  <p className="truncate text-sm text-gray-500">{el.username}</p>
                </div>
              </div>
              <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                <i className="fa-solid fa-user-plus text-xs"></i> Follow
              </button>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{el.followersCount} followers</span>
             {el.mutualFollowersCount > 0 && ( <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">{el.mutualFollowersCount} mutual</span>)}
            </div>
          </div>
         })}

        
        </div>

{hasNextPage &&(<button
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="mt-5 w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60">
    {isFetchingNextPage ? "Loading..." : "Load more users"}
  </button>
)}
      </div>
    </div>
  )
}