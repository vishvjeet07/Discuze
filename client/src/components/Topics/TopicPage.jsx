import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../Loader/Loading";

function TopicPage() {
  const { backendUrl } = useContext(AppContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTopics = useCallback(async () => {
    const controller = new AbortController(); // ✅ allows cancellation
    try {
      const { data } = await axios.get(`${backendUrl}/api/topic`, {
        signal: controller.signal,
      });
      if (data.success) {
        const formattedTopics = data.topics.map((topic) => ({
          ...topic,
          formattedTime: new Date(topic.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
          }),
        }));
        // ✅ Only update state if data actually changed
        setTopics((prev) => {
          const prevIds = prev.map((t) => t._id).join(",");
          const newIds = formattedTopics.map((t) => t._id).join(",");
          return prevIds === newIds ? prev : formattedTopics;
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error(error);
    } finally {
      setLoading(false);
    }
    return () => controller.abort(); // ✅ cleanup
  }, [backendUrl]);

  useEffect(() => {
    fetchAllTopics();
  }, [fetchAllTopics]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4">
      {topics.length === 0 ? (
        <div className="text-gray-900">No topics found</div>
      ) : (
        topics.map((t) => (
          <div
            key={t._id} // ✅ stable key
            className="w-full pl-5 py-3 border border-gray-700/30 bg-gray-800 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-101 hover:shadow-lg cursor-pointer"
          >
            <Link to={`topic/${t.name}`}>t/{t.name}</Link>
            <span className="opacity-50 text-sm pl-2">{t.formattedTime}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default TopicPage;
