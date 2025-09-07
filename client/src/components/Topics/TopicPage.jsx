import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../Loader/Loading';

function TopicPage() {
  const { backendUrl } = useContext(AppContext);
  const [topics, setTopics] = useState([]);

  const fetchAllTopics = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/topic');
      if (data.success) {
        const formattedTopics = data.topics.map((topic) => ({
          ...topic,
          formattedTime: new Date(topic.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
          }),
        }));
        setTopics(formattedTopics);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4">
      {topics ? (
        topics.length === 0 ? (
          <div className="text-gray-900">No topics found</div>
        ) : (
          topics.map((t, index) => (
            <div
              key={index}
              className="w-full pl-5 py-3 border border-gray-700/30 bg-gray-800 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-101 hover:shadow-lg cursor-pointer"
            >
              <Link to={`topic/${t.name}`}>t/ {t.name}</Link>
              <span className="opacity-50 text-sm pl-2">{t.formattedTime}</span>
            </div>
          ))
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default TopicPage;
