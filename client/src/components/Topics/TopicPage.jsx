import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../Loader/Loading';
import { CgGhostCharacter } from "react-icons/cg";

function TopicPage() {

  const { backendUrl } = useContext(AppContext);
  const [topics,setTopics] = useState([]);
  const [time, setTime] = useState(null);

  
  const fetchAllTopics = async()=>{
    try {
      const { data } = await axios.get(backendUrl+'/api/topic');
      if(data.success){
        setTopics(data.topics);
        const formattedTimes = data.topics.map((topic) =>
        new Date(topic.createdAt).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
        }))
        setTime(formattedTimes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchAllTopics();
  },[])

  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4">
      {
        topics ? topics.length === 0 ? (
        <div className="text-gray-900">No topics found</div>
      ) : topics.map((t, index) => (
        <>
        <div key={index} className="flex w-full pl-5 py-3 text-white cursor-pointer">
        <Link to={`topic/${t.name}`} className='opacity-70 flex hover:opacity-100 transition duration-200'>
        <CgGhostCharacter className='m-1 size-5 hover:opacity-80' />
          t/ {t.name}
        <span className='opacity-70 text-sm pl-2 mt-0.5'>{time[index]}</span>
        </Link>
        </div>
        <hr className="w-310 h-0.5px bg-white opacity-30" />
        </>
      )) : <Loading />
      }
    </div>
  )
}

export default TopicPage
