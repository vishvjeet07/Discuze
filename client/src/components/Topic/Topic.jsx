import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../Loader/Loading";
import Comment from "../Comment/Comment";

function Topic() {

  const { backendUrl } = useContext(AppContext);
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [time, setTime] = useState(null);

  const { name } = useParams();

  const fetchTopic = async()=>{
    try {
      const { data } = await axios.get(backendUrl+`/api/topic/${name}`);
      if(data.success){
        setTopic(data.topic);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchComments = async()=>{
    try {
      const { data } = await axios.get(backendUrl+`/api/topic/${name}`);

      if(data.success){
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const fetchTime = async()=>{
    const { data } = await axios.get(backendUrl+`/api/topic/${name}`);
      if(data.success){
        data.comments.map((comment) => {
        const formatted = new Date(comment.createdAt).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
        })
        setTime(formatted);
        ;})
      }  
  }

  useEffect(() => {
    if(name){
      fetchTopic();
      fetchComments();
      fetchTime();
    }
  }, [name, backendUrl]);

  if (!topic || comments === null) {
    return <Loading />;
  }

return (
  <div className="w-full flex flex-col h-screen bg-black">
    {/* Top section */}
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2 text-white">{topic?.name}</h1>
    </div>

    {/* Comments list with scroll */}
    <ul className="flex-1 overflow-y-auto w-full">
      {comments.length === 0 ? (
        <li className="text-gray-400 italic p-4 text-center">
          No comments yet
        </li>
      ) : (
        comments.map((c) => (
          <li
            key={c._id}
            className="text-gray-200 py-4 border-t border-gray-700 w-full pl-5 
                      transition-all duration-200 ease-in-out 
                      hover:border hover:border-t-gray-500 hover:bg-gray-900 hover:rounded-lg"
          >
            <div className="flex gap-2 mb-1.5 text-sm">
              <h4 className="opacity-90">t/{topic.name}</h4>
              <span className="opacity-50">{time}</span>
            </div>
            <span className="font-semibold">{c.comment}</span>
          </li>
        )) 
      )
    }
    </ul>

    {/* Comment box sticky at bottom */}
    <div className="sticky bottom-0 w-full">
      <Comment name={name} refreshComment={fetchComments} />
    </div>
  </div>
)
}

export default Topic;
