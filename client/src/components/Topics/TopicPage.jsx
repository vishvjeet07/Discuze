import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function TopicPage() {

  const { backendUrl } = useContext(AppContext);
  const [topics,setTopics] = useState([]);
  const [time, setTime] = useState(null);

  
  const fetchAllTopics = async()=>{
    try {
      const { data } = await axios.get(backendUrl+'/api/topic');
      if(data.success){
        setTopics(data.topics);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const fetchTime = async()=>{
      const { data } = await axios.get(backendUrl+'/api/topic');
        if(data.success){
          data.topics.map((topic) => {
          const formatted = new Date(topic.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
          })
          setTime(formatted);
          ;})
        }  
    }

  useEffect(()=>{
    fetchAllTopics();
    fetchTime()
  },[])

  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4">
      {
        topics.length === 0 ? (
        <div className="text-gray-900">No topics found</div>
      ) : topics.map((t, index) => (
        <div key={index} className="w-full pl-5 py-3 border border-gray-700/30 bg-gray-800 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-101 hover:shadow-lg cursor-pointer">
        <Link to={`topic/${t.name}`}>
          t/ {t.name}
        </Link>
        <span className='opacity-50 text-sm pl-2'>{time}</span>
        </div>
      ))
      }
    </div>
  )
}

export default TopicPage
