import { Avatar, Dropdown, DropdownItem } from "flowbite-react";
import type { CommentItem } from "../interfaces/comment";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../Context/AuthContext";


interface CommentCardProps {
  comment: CommentItem;
  postId: string;
   refetch: () => void;
}
export default function CommentCard({ comment, postId, refetch }: CommentCardProps) {
  const[isedit,setedit]=useState(false)
  const [edittext,setedittext]=useState('')
  const inputelement =useRef<HTMLInputElement>(null)
    const queries = useQueryClient();
    const [showreplies,setreplies]=useState(false)
    const [replytext,setreplytext]=useState('')
    const { userData } = useContext(AuthContext)
    useEffect(() => {
  if (showreplies) inputelement.current?.focus()
}, [showreplies])
    function likeComment(commentId: string) {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
  )
}
const { mutate: handleLikeComment } = useMutation({
  mutationFn: likeComment,
  onSuccess: () => {
refetchReplies()
    queries.invalidateQueries({ queryKey: ['newposts'] })
  },
})

const {mutate:handlecreateReply}=useMutation({
    mutationFn:createreply,
    onSuccess: () => {
  setreplytext('')
  refresh()
  refetchReplies()
},
})

function createreply(text:string){
    const formdata= new FormData()
    formdata.append('content',text)
return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,formdata,{
    headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
})
}
const{data ,refetch: refetchReplies}=useQuery({
    queryKey:['replies',comment._id],
    queryFn:getReplies,
    enabled: showreplies,
})
function getReplies() {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
    { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
  )
} 
const {mutate:handledeletecomment}= useMutation({
  mutationFn:deletecomment,
  onSuccess:()=>{
    refetch()
  queries.invalidateQueries({ queryKey: ['newposts'] })
  queries.invalidateQueries({ queryKey: ['postdetails'] })
queries.invalidateQueries({ queryKey: ['userposts'] })
  }
})
function deletecomment(){
  return axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,{
    headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
  })
}
const {mutate:handleupdatecomment}=useMutation({
  mutationFn:updatecomment,
  onSuccess:()=>{
    setedit(false)
    refetch()
  queries.invalidateQueries({ queryKey: ['newposts'] })
  }
})
function updatecomment(){
  const formdata =new FormData()
  formdata.append('content',edittext)
  return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,formdata,{
    headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` }
  })
}
const replies:CommentItem[]= data?.data.data.replies ?? []
  return (
    <div className="flex items-start gap-3">
      <Avatar img={comment.commentCreator.photo} rounded size="sm" />

      <div className="min-w-0 flex-1">
      
        <div className="w-fit max-w-full rounded-2xl bg-gray-100 px-4 py-3">
          <p className="text-sm font-bold text-gray-900">{comment.commentCreator.name}</p>
          <p className="text-xs text-gray-500">@{comment.commentCreator.username} · {dayjs(comment.createdAt).format('MMM D, h:mm A')}</p>
         {comment.image && <img src={comment.image} alt="comment" className="mt-2 max-h-60 rounded-xl object-cover" />}
         {isedit ? (
  <div className="mt-2">
    <input
      value={edittext}
      onChange={(e) => setedittext(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
    />
    <div className="mt-2 flex justify-end gap-2">
      <button onClick={() => setedit(false)} className="rounded-full px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200">
        Cancel
      </button>
      <button  onClick={() => handleupdatecomment()}  className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
        Save
      </button>
    </div>
  </div>
) : (
  <p className="mt-1 text-gray-800">{comment.content}</p>
)}
        </div>

      
        <div className="mt-1 flex items-center justify-between ps-1 text-xs">
          <div className="flex items-center gap-4 text-gray-500">
            <span>{dayjs(comment.createdAt).format('MMM D, h:mm A')}</span>
            <button onClick={() => handleLikeComment(comment._id)}  className="font-semibold hover:text-blue-600">Like ({comment.likes.length})</button>
            <button onClick={()=>setreplies(true)} className="font-semibold hover:text-blue-600">Reply</button>
          </div>
{comment.commentCreator._id === userData?._id &&         <Dropdown
  inline
  arrowIcon={false}
  label={<i className="fa-solid fa-ellipsis text-gray-400 hover:text-gray-600"></i>}
>
  <DropdownItem onClick={() => { setedit(true); setedittext(comment.content) }}>
    <i className="fa-solid fa-pen me-3 w-4"></i> Edit
  </DropdownItem>
  <DropdownItem onClick={()=>handledeletecomment()} className="text-red-600 hover:bg-red-50">
    <i className="fa-regular fa-trash-can me-3 w-4"></i> Delete
  </DropdownItem>
</Dropdown>}
        </div>


       {showreplies &&  <div className="mt-3 flex flex-col gap-3 border-s-2 border-gray-200 ps-4">
          <button className="w-fit text-xs font-semibold text-blue-600 hover:underline">
            <i className="fa-solid fa-reply me-1 rotate-180"></i> View {replies.length} replies
          </button>

       
         {replies.map((reply)=>{
            return(
                 <div   key={reply._id} className="flex items-start gap-2">
            <Avatar img={reply.commentCreator.photo} rounded size="xs" />
            <div className="min-w-0 flex-1">
              <div className="w-fit max-w-full rounded-2xl bg-gray-100 px-3 py-2">
                <p className="text-xs font-bold text-gray-900">{reply.commentCreator.name}</p>
                <p className="text-sm text-gray-800">{reply.content}</p>
              </div>
              <div className="mt-1 flex items-center gap-4 ps-1 text-xs text-gray-500">
                <span>{dayjs(reply.createdAt).format('MMM D, h:mm A')}</span>
                <button className="font-semibold hover:text-blue-600">Like ({reply.likes.length})</button>
              </div>
            </div>
          </div>
            )
         })}


          <div className="flex items-start gap-2">
            <Avatar img={ userData?.photo} rounded size="xs" />
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-1.5">
              <input
              onChange={(e)=>setreplytext(e.target.value) }
              value={replytext}
              ref={inputelement}
                type="text"
                placeholder={`Reply to ${comment.commentCreator.name}...`}
                className="flex-1 border-0 bg-transparent p-0 text-sm focus:ring-0 focus:outline-none"
              />
              <button onClick={() => handlecreateReply(replytext)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white hover:bg-blue-700">
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}