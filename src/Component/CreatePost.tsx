import { useState } from "react";
import { Avatar, Button, Card, Dropdown, DropdownItem, Textarea } from "flowbite-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface CreatePostProps {
  name: string;
  photo: string;
   
}
 const privacyIcons: Record<string, string> = {
  Public: 'fa-solid fa-earth-americas',
  Followers: 'fa-solid fa-user-group',
  'Only me': 'fa-solid fa-lock',
}

export default function CreatePost({ name, photo }: CreatePostProps) {

  const [privacy, setPrivacy] = useState("Public");
  const [showEmoji, setShowEmoji] = useState(false);
const [content,setcontent]=useState<string>('')
const [picture,setpicture]=useState<File | null>(null)

  function handleEmoji(emojiData: EmojiClickData) {
    setcontent((prev) => prev + emojiData.emoji);
  }
  const queries = useQueryClient()
  const {mutate} = useMutation({
    mutationFn: handleCreatePost,
    onSuccess:(res)=>{
setcontent('')
setpicture(null)
setShowEmoji(false)
Swal.fire({
  title:'success!',
  text:res.data.message,
  icon:'success',
  confirmButtonText:'cool',
  timer:1000
})
queries.invalidateQueries({ queryKey: ['newposts'] })



    },
    onError:(err)=>{
      if(axios.isAxiosError(err))console.log(err.response?.data)
    }
  })
 function handleCreatePost(){

  const formData=new FormData()
if(content.trim())formData.append('body',content)
if (picture) formData.append('image', picture)
return axios.post('https://route-posts.routemisr.com/posts',formData,
  {
    headers:{
      Authorization:`Bearer ${localStorage.getItem('usertoken')}`
    }
  }
)



}
 

  return (
    <Card className="w-full max-w-2xl">
    
      <div className="flex items-center gap-3">
        <Avatar img={photo} rounded size="md" />
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{name}</p>
          <Dropdown
            inline
            label={
              <span className="mt-1 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
               <i className={privacyIcons[privacy]}></i> {privacy} 
              </span>
            }
          >
          <DropdownItem onClick={() => setPrivacy("Public")}>Public</DropdownItem>
<DropdownItem onClick={() => setPrivacy("Followers")}>Followers</DropdownItem>
<DropdownItem onClick={() => setPrivacy("Only me")}>Only me</DropdownItem>
          </Dropdown>
        </div>
      </div>

      
      <Textarea
        rows={5}
        value={content}
     onChange={(e)=>setcontent(e.target.value)}
        placeholder={`What's on your mind, ${name.split(" ")[0]}?`}
        className="rounded-2xl bg-gray-50 p-4"
      />

      
      {picture && (
        <div className="relative">
          <img src={URL.createObjectURL(picture)} alt="preview" className="max-h-72 w-full rounded-xl object-cover" />
          <button
            onClick={() => setpicture(null)}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-900/60 text-white"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

  
      {showEmoji && <EmojiPicker onEmojiClick={handleEmoji} width="100%" height={350} />}

   
      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
           <i className="fa-regular fa-image text-lg text-green-600"></i>
<span className="hidden md:inline">Photo/video</span>
            <input
              type="file"
              accept="image/*"
              hidden
             onChange={(e) => setpicture(e.target.files?.[0] ?? null)}
            />
          </label>

          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
          >
       <i className="fa-regular fa-face-smile text-lg text-orange-500"></i>
<span className="hidden md:inline">Feeling/activity</span>
          </button>
        </div>

        <Button   onClick={()=>mutate()}>
         
          Post <i className="fa-regular fa-paper-plane ms-2"></i>
        </Button>
      </div>
    </Card>
  );
}