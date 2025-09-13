import React, { useContext, useEffect, useState } from "react"; 
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { Trash2 } from 'lucide-react'

function Profile() {
  const [isProfile, setIsProfile] = useState(null)
  const { backendUrl } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/profile", {withCredentials: true});
      if (data.success) {
        setUserInfo(data.userInfo);
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white relative px-4 sm:px-6 lg:px-12">
      {/* Navigation Toggle */}
      <div className="absolute top-4 flex m-3">
        <button
          onClick={() => setIsProfile(false)}
          className="rounded-lg p-2 opacity-70 hover:opacity-100 transition duration-300 hover:border-0 hover:bg-gray-700"
          >
          Topics
        </button>
        <button
          onClick={() => setIsProfile(true)}
        className="rounded-lg p-2 opacity-70 hover:opacity-100 transition duration-300 hover:border-0 hover:bg-gray-700">
          Profile
        </button>
      </div>

      {isProfile ? (
        // Profile View
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">@{userInfo.username}</h1>
              <p className="text-gray-400">Welcome to your profile</p>
            </div>
            
            <div className=" p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Profile Stats</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Total Topics:</span>
                <span className="font-semibold">{topics.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Account Status:</span>
                <span className="font-semibold text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Topics Management View
        <div className="absolute top-30 opacity-90 text-base sm:text-lg">
          {/* Username indicator */}
          <div className="absolute top-[-3rem] left-0 opacity-80 text-base sm:text-lg">
            <p>@{userInfo.username}</p>
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
