import axios from "axios";
import { Button,Avatar } from "flowbite-react";
import { useState ,useContext} from "react";
import type { CommentItem } from "../interfaces/comment";
import CommentCreator from "./CommentCreator";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import CommentCard from "./Commentcard";




export default function PostFooter({postdetail}:{postdetail:Post}) {
    const { userData } = useContext(AuthContext);
    const {likesCount,commentsCount,sharesCount,topComment,_id,likes,user}=postdetail
    const [commentlist,setcomment]=useState< CommentItem[] |null>(null)
    const [showShare, setShowShare] = useState(false)
    const [shareText, setShareText] = useState('')
const queries=useQueryClient()


     function HandleLike() {
    return axios.put(`https://route-posts.routemisr.com/posts/${_id}/like`,'',
      {
        headers:{
            Authorization:`Bearer ${localStorage.getItem('usertoken')}`
        }
    }
    )
  }
  const {mutate,isPending} = useMutation({
    mutationFn:HandleLike,
    onSuccess:()=>{
      queries.invalidateQueries({queryKey:['newposts']},
        
      )
    }

  })
async function getPostComment(id) {
    const {data} =await axios.get(`https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('usertoken')}`
        }
    })
    console.log(data)
    setcomment(data.data.comments)
    
}console.log("topComment:", topComment);
function sharePost() {
  return axios.post(
    `https://route-posts.routemisr.com/posts/${_id}/share`,
    { body: shareText },
    { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
  )
}
const { mutate: handleShare, isPending: isSharing } = useMutation({
  mutationFn: sharePost,
  onSuccess: () => {
    setShareText('')
    setShowShare(false)
    queries.invalidateQueries({ queryKey: ['newposts'] })
  },
})
  return (
    <>
    
    
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
          <span>{likesCount} likes</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-retweet"></i> {sharesCount} shares
          </span>
          <span>{commentsCount} comments</span>
          <Link to={'/PostsDetails/'+ _id}   className="border-0 text-blue-600 text-sm font-semibold">
            View details
          </Link>
        </div>
      </div>

    
      <div className="mx-4 flex gap-2 border-t border-gray-200 py-2 dark:border-gray-700">
        <Button  onClick={()=>mutate(_id)} disabled={isPending} color="light"  className={`flex-1 border-0   ${likes.includes(userData?._id) ?`text-blue-600 bg-blue-50 ` :`text-gray-600 bg-white`} hover:bg-blue-100`}>
          <i className="fa-regular fa-thumbs-up me-2"></i> Like
        </Button>
        <Button color="light" className="flex-1 border-0">
          <i className="fa-regular fa-comment me-2"></i> Comment
        </Button>
        <Button
        onClick={() => setShowShare(true)} color="light" className="flex-1 border-0">
          <i className="fa-solid fa-share-nodes me-2"></i> Share
        </Button>
      </div>
    {topComment && !commentlist?.length &&     <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-3 text-xs font-semibold text-gray-500">Top comment</p>

        
   <div  className="flex items-start gap-3 ">
          <Avatar img={topComment?.commentCreator.photo} rounded size="sm" />
          <div className="flex-1 rounded-2xl bg-white px-4 py-2 dark:bg-gray-700">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{topComment.commentCreator.name}</p>
            <p className="text-gray-700 dark:text-gray-200">{topComment.content}</p>
          </div>
        </div>
    
      

        <button onClick={()=>getPostComment(_id)} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
          View all comments
        </button>
      </div>}
     
<div className="mx-4 mb-4 rounded-2xl bg-slate-50 p-3">
  
  <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
    <h3 className="flex items-center gap-2 font-bold text-gray-900">
      Comments
      <span className="rounded-full bg-blue-50 px-2 text-xs font-bold text-blue-600">{commentlist?.length ?? 0}</span>
    </h3>
    <select className="rounded-xl border border-gray-200 bg-slate-50 py-2 ps-3 pe-8 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:ring-blue-500">
      <option>Most relevant</option>
      <option>Newest</option>
    </select>
  </div>

  <div className="flex flex-col gap-4">
    
{commentlist?.map((comment) => (
  <CommentCard key={comment._id} comment={comment} postId={_id}   refetch={() => getPostComment(_id)}/>
))}

  
  </div>
</div>
    {userData && <CommentCreator name={userData.name} photo={userData.photo} postId={_id}   refetch={() => getPostComment(_id)}/>}
{showShare &&   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">Share post</h2>
      <button
      onClick={() => setShowShare(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>

    <textarea
    value={shareText}
onChange={(e) => setShareText(e.target.value)}
      rows={3}
      placeholder="Say something about this..."
      className="w-full resize-none rounded-2xl border border-gray-200 bg-slate-50 p-4 focus:border-blue-500 focus:ring-blue-500"
    />

    <div className="mt-4 flex justify-end gap-2">
      <button 
      onClick={() => setShowShare(false)}
      className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
      <button
      onClick={() => handleShare()}
disabled={isSharing} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
        <i className="fa-solid fa-share-nodes"></i> Share now
      </button>
    </div>
  </div>
</div>}
    </>
  );
}