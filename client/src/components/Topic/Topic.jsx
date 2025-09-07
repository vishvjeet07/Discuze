import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../Loader/Loading";
import Comment from "../Comment/Comment";

function Topic() {
  const { backendUrl } = useContext(AppContext);
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { name } = useParams();

  const fetchTopicData = useCallback(async () => {
    const controller = new AbortController();
    try {
      const { data } = await axios.get(`${backendUrl}/api/topic/${name}`, {
        signal: controller.signal,
      });

      if (data.success) {
        // Format comments once here
        const formattedComments = data.comments.map((comment) => ({
          ...comment,
          formattedTime: new Date(comment.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
          }),
        }));

        setTopic(data.topic);
        setComments(formattedComments);
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.error(error);
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, [backendUrl, name]);

  useEffect(() => {
    fetchTopicData();
  }, [fetchTopicData]);

  if (loading) return <Loading />;

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
                <span className="opacity-50">{c.formattedTime}</span>
              </div>
              <span className="font-semibold">{c.comment}</span>
            </li>
          ))
        )}
      </ul>

      {/* Comment box sticky at bottom */}
      <div className="sticky bottom-0 w-full">
        <Comment name={name} refreshComment={fetchTopicData} />
      </div>
    </div>
  );
}

export default Topic;
