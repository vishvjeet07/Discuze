import React, { useContext, useEffect, useState } from "react"; 
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast';

function Profile() {
  const [isProfile, setIsProfile] = useState(() => {
    const saved = localStorage.getItem("isProfile");
    return saved ? JSON.parse(saved) : false; 
  })
  const { backendUrl } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/profile", {withCredentials: true});
      if (data.success) {
        setUsername(data.userInfo.username);
        setEmail(data.userInfo.email)
        setTopics(data.topics.map(t => t.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createTopic = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/create",
        {topic},
        { withCredentials: true }
      );

      if (data.success) {
        setTopics([...topics, data.topics]); // update state with new topic
        setTopic(""); // clear input
        toast.success(data.message)
      }
      await fetchUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTopic = async(topicName)=>{
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/delete/${topicName}`,{withCredentials:true}
      )
      if(data.success){
        await fetchUserData()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleUpdate = async(e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${backendUrl}/api/user/update`,{
        username,
        email
      }, { withCredentials: true});
      if(data.success){
      toast(data.message,
        {
          icon:'✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
        fetchUserData();
      }else{
         toast(data.message,
        {
          icon:'❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      )
      }
    } catch (error) {
        toast.error(error.message)
    }
  }
    
  useEffect(() => {
    localStorage.setItem("isProfile", JSON.stringify(isProfile));
  }, [isProfile]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white relative px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
      {/* Navigation Toggle */}
      <div className="top-4 flex m-3">
        <button
          onClick={() => setIsProfile(false)}
          className={`rounded-lg p-2 hover:opacity-100 transition duration-300 hover:border-0 hover:bg-gray-700 ${isProfile ? "opacity-70" : "opacity-100"}`}
          >
          Topics
        </button>
        <button
          onClick={() => setIsProfile(true)}
        className={`rounded-lg p-2 hover:opacity-100 transition duration-300 hover:border-0 hover:bg-gray-700  ${isProfile ? "opacity-100" : "opacity-70"}`}>
          Profile
        </button>
      </div>

      {isProfile ? (
        // Profile View
        <div className="flex flex-col items-start right-30">
          <div className="text-center">
            <div className="max-w-md mx-auto">
            <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex gap-1">
                <label htmlFor="username" className="mt-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div className="flex gap-1">
                <label htmlFor="username" className="mt-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 ml-8"
                />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300 mt-2"
            >
              Change
            </button>
          </form>
            </div>
          </div>
        </div>
      ) : (
        // Topics Management View
        <div className="top-35 opacity-90 text-base sm:text-lg">
          {/* Username indicator */}
          <div className="top-[-4rem] left-0 opacity-80 text-base sm:text-lg">
            <p>@{username}</p>
          </div>

          {/* Create Topic Form */}
          <div className=" p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">
              Create Topic
            </h2>
            <form
              onSubmit={createTopic}
              className="flex gap-3 flex-wrap"
            >
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic name"
                className="w-48 sm:w-72 lg:w-96 px-3 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-red-300"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition duration-200"
              >
                Create
              </button>
            </form>
          </div>

          {/* Topics List */}
          <div className="mt-8 opacity-100">
            <h3 className="font-bold text-lg sm:text-xl">Your Topics</h3>
            <div className="flex flex-col gap-3 items-center justify-center p-4 w-full">
              {topics.length === 0 ? (
                <div className="text-gray-400 text-sm sm:text-base">
                  No topics found
                </div>
              ) : (
                topics.map((t, index) => (
                  <div
                    key={index}
                    className="w-full flex justify-between items-center pl-4 pr-4 py-3 border border-gray-700/30 bg-gray-800 text-white rounded-lg"
                  >
                    <Link
                      to={`topic/${t}`}
                      className="truncate text-sm sm:text-base"
                    >
                      t/ {t}
                    </Link>
                    <button
                      onClick={() => deleteTopic(t)}
                      className="text-red-600 border border-red-600 px-3 py-1 rounded cursor-pointer text-sm sm:text-base text-center hover:bg-red-600 hover:text-white transition duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
