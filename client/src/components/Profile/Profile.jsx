import React, { useContext, useEffect, useState } from "react"; 
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

function Profile() {
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
  {/* Username top-left */}
  <div className="absolute top-4 left-17 opacity-80 text-base sm:text-lg">
    <p>@{userInfo.username}</p>
  </div>

  <div className="relative top-5 opacity-90 text-base sm:text-lg">
    {/* Create Topic Form */}
    <div className="mt-6 p-4 sm:p-6">
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
                className="text-red-600 border border-red-600 px-3 py-1 rounded cursor-pointer w-20 text-sm sm:text-base text-center"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>

  </div>
</div>

  );
}

export default Profile;
