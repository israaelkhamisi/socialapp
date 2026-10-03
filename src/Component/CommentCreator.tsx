import { useState } from "react";
import { Avatar } from "flowbite-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import axios from "axios";

interface CommentCreatorProps {
  name: string;
  photo: string;
  postId:string
  refetch:()=> void
}

export default function CommentCreator({ name, photo ,postId,refetch}: CommentCreatorProps) {
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  function handleEmoji(emojiData: EmojiClickData) {
    setContent((prev) => prev + emojiData.emoji);
  }
 

 async function handleCreateComment() {
    const formData =new FormData()
    if(content.trim())formData.append('content',content)
        if (picture) formData.append('image', picture)
 try{const {data}= await axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`,formData,{
 headers:{
      Authorization:`Bearer ${localStorage.getItem('usertoken')}`
    }
})
setContent('')
setPicture(null)
setShowEmoji(false)
refetch()
}catch(err){
      console.log(err.response?.message)
}

   
  }

  return (
    <div className="mx-4 mb-4">
      <div className="flex items-start gap-3">
        <Avatar img={photo} rounded size="sm" />

        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Comment as ${name}...`}
            className="w-full resize-none border-0 bg-transparent p-0 text-gray-800 placeholder-gray-500 focus:ring-0 focus:outline-none dark:text-white"
          />

         
          {picture && (
            <div className="relative mt-2 w-32">
              <img src={URL.createObjectURL(picture)} alt="preview" className="h-24 w-32 rounded-lg object-cover" />
              <button
                onClick={() => setPicture(null)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-gray-900/60 text-xs text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

      
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500">
              <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200">
                <i className="fa-regular fa-image text-lg"></i>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setPicture(e.target.files?.[0] ?? null)}
                />
              </label>

              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200"
              >
                <i className="fa-regular fa-face-smile text-lg"></i>
              </button>
            </div>

            <button
              onClick={handleCreateComment}
              disabled={!content.trim() && !picture}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      {showEmoji && (
        <div className="mt-2 ms-12">
          <EmojiPicker onEmojiClick={handleEmoji} width="100%" height={320} />
        </div>
      )}
    </div>
  );
}