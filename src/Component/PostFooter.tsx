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
      
      <div className="px-4 pb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <i className="fa-regular fa-thumbs-up text-blue-600 dark:text-blue-400"></i> {likesCount} likes
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <i className="fa-solid fa-retweet text-blue-600 dark:text-blue-400"></i> {sharesCount} shares
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <i className="fa-regular fa-comment text-blue-600 dark:text-blue-400"></i> {commentsCount} comments
          </span>
          <Link to={'/PostsDetails/' + _id} className="ms-auto whitespace-nowrap font-semibold text-blue-600 hover:underline dark:text-blue-400">
            View details
          </Link>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <i className="fa-regular fa-clock"></i> {dayjs(postdetail.createdAt).format('MMM D, h:mm A')}
        </p>
      </div>

      
      <div className="mx-2 sm:mx-4 flex gap-2 border-t border-gray-200 py-2 dark:border-gray-700">
        <Button onClick={() => mutate(_id)} disabled={isPending} color="light" className={`flex-1 border-0 ${likes.includes(userData?._id) ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-white text-gray-600 dark:bg-transparent dark:text-gray-300'} hover:bg-blue-100 dark:hover:bg-gray-700`}>
          <i className="fa-regular fa-thumbs-up sm:me-2"></i> <span className="hidden sm:inline">Like</span>
        </Button>
        <Button color="light" className="flex-1 border-0 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700">
          <i className="fa-regular fa-comment sm:me-2"></i> <span className="hidden sm:inline">Comment</span>
        </Button>
        <Button onClick={() => setShowShare(true)} color="light" className="flex-1 border-0 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700">
          <i className="fa-solid fa-share-nodes sm:me-2"></i> <span className="hidden sm:inline">Share</span>
        </Button>
      </div>

     
      {topComment && !commentlist?.length && (
        <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Top comment</p>
          <div className="flex items-start gap-3">
            <Avatar img={topComment?.commentCreator.photo} rounded size="sm" />
            <div className="flex-1 rounded-2xl bg-white px-4 py-2 dark:bg-gray-700">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{topComment.commentCreator.name}</p>
              <p className="text-gray-700 dark:text-gray-200">{topComment.content}</p>
            </div>
          </div>
          <button onClick={() => getPostComment(_id)} className="mt-3 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
            View all comments
          </button>
        </div>
      )}

    
      <div className="mx-2 sm:mx-4 mb-4 rounded-2xl bg-slate-50 p-3 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3 sm:px-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            Comments
            <span className="rounded-full bg-blue-50 px-2 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{commentlist?.length ?? 0}</span>
          </h3>
          <select className="rounded-xl border border-gray-200 bg-slate-50 py-1.5 ps-2 pe-7 text-xs font-semibold text-gray-700 focus:border-blue-500 focus:ring-blue-500 sm:py-2 sm:ps-3 sm:pe-8 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
            <option>Most relevant</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          {commentlist?.map((comment) => (
            <CommentCard key={comment._id} comment={comment} postId={_id} refetch={() => getPostComment(_id)} />
          ))}
        </div>
      </div>

      {userData && <CommentCreator name={userData.name} photo={userData.photo} postId={_id} refetch={() => getPostComment(_id)} />}

    
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share post</h2>
              <button onClick={() => setShowShare(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              rows={3}
              placeholder="Say something about this..."
              className="w-full resize-none rounded-2xl border border-gray-200 bg-slate-50 p-4 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowShare(false)} className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={() => handleShare()} disabled={isSharing} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
                <i className="fa-solid fa-share-nodes"></i> Share now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}