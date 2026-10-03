import { useState } from "react";
import { Avatar } from "flowbite-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";


import type {Friend} from '../interfaces/Friends'



export default function SuggestedFriends() {
    const queries=useQueryClient()
     const [search, setSearch] = useState("");
    const {data}=useQuery({
    queryKey:['friends',search],
    queryFn:followSugestion
})
console.log(data)
function followSugestion(){
    return axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=5&q=${search}`,{
         headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
    })
}
function followUser(userId: string) {
  return axios.put(
    `https://route-posts.routemisr.com/users/${userId}/follow`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
  )
}
 
const {mutate}=useMutation({
    mutationFn:followUser,
    onSuccess:()=>{
        queries.invalidateQueries({queryKey:['friends']})
     
    }
})
   const friends: Friend[] = data?.data.data.suggestions ?? []


 

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <i className="fa-solid fa-user-group text-blue-600"></i> Suggested Friends
        </h2>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-600">
          {friends.length}
        </span>
      </div>

      <div className="relative mb-4">
        <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search friends..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 ps-11 pe-4 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

    
      <div className="flex flex-col gap-2.5">
        {friends.map((friend) => (
          <div key={friend._id} className="rounded-2xl border border-gray-200 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar img={friend.photo} rounded size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-bold  text-sm text-gray-900">{friend.name}</p>
                  <p className="truncate text-sm text-gray-500">@{friend.username}</p>
                </div>
              </div>
              <button onClick={() => mutate(friend._id)} className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs  font-semibold text-blue-600 hover:bg-blue-100">
                <i className="fa-solid fa-user-plus text-sm"></i> Follow
              </button>
            </div>

            <div className="mt-2 flex gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-600">
                {friend.followersCount} followers
              </span>
              {friend.mutualFollowersCount > 0 && (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-600">
                {friend.mutualFollowersCount} mutual
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Link to ='/Suggestions' className="   block text-center mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 py-2 font-semibold text-gray-700 hover:bg-gray-100">
        View more
      </Link>
    </div>
  );
}