import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../Loader/Loading";
import Comment from "../Comment/Comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PiArrowFatUp,PiArrowFatDown  } from "react-icons/pi";

function Topic() {

  dayjs.extend(relativeTime);
  const { backendUrl } = useContext(AppContext);
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [time, setTime] = useState(null);

  const { name } = useParams();

  const fetchAllData = async()=>{
    try {
      const { data } = await axios.get(backendUrl+`/api/topic/${name}`);
      if(data.success){
        setTopic(data.topic);
        setComments(data.comments);
        const formattedTimes = data.comments.map((comment) =>
                  (comment.createdAt)
          )
        setTime(formattedTimes);
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if(name){
      fetchAllData();
    }
  }, [name, backendUrl]);

  if (!topic || comments === null) {
    return <Loading />;
  }

return (
  <div className="w-full flex flex-col h-screen bg-black">
    {/* Top section */}
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2 text-white">t/{topic?.name}</h1>
    </div>

    {/* Comments list with scroll */}
    <ul className="flex-1 overflow-y-auto w-full">
      {comments.length === 0 ? (
        <li className="text-gray-400 italic p-4 text-center">
          No comments yet
        </li>
      ) : (
        comments.map((c, index) => (
          <li
            key={c._id}
            className="text-gray-200 py-4 border-t border-gray-700 w-full pl-5 
                      transition-all duration-200 ease-in-out 
                      hover:border hover:border-t-gray-500 hover:rounded-lg"
          >
            <div className="flex gap-2 mb-1.5 text-sm">
              <h4 className="opacity-90">t/{topic.name}</h4>
              <span className="opacity-50">{dayjs(time[index]).fromNow()}</span>
            </div>
            <span className="font-semibold">{c.comment}</span>
            {/* <div className="mt-2 flex gap-4 items-center bg-gray-900 w-22 pl-2 p-1 rounded-2xl">
              <PiArrowFatUp />
              <span className="font-bold">4</span>
              <PiArrowFatDown />
            </div> */}
          </li>
        )) 
      )
    }
    </ul>

    {/* Comment box sticky at bottom */}
    <div className="sticky bottom-0 w-full">
      <Comment name={name} refreshComment={fetchAllData} />
    </div>
  </div>
)
}

export default Topic;
