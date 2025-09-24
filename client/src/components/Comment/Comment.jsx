import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Comment({name,refreshComment}) {
  const [comment, setComment] = useState("");
  const {backendUrl} = useContext(AppContext);
  const addComment = async(e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const { data } = await axios.post(backendUrl + `/api/topic/${name}`,{comment});
    if(data.success){
      refreshComment();
      toast.success(data.message)
    }
    setComment("");
  }

  return (
    <form
      onSubmit={addComment}
      className="w-full flex items-center gap-3 p-4 border-t border-gray-700 bg-gray-900"
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-12 
                   overflow-hidden"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition duration-200 shadow-md"
      >
        Send
      </button>
    </form>
  );
}


export default Comment;
