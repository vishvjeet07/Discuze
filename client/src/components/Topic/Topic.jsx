import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../Loader/Loading";
import Comment from "../Comment/Comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Hash, MessageCircle, Clock } from "lucide-react";

function Topic() {
  dayjs.extend(relativeTime);
  const { backendUrl } = useContext(AppContext);
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [time, setTime] = useState(null);

  const { name } = useParams();

  const fetchAllData = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/topic/${name}`);
      if (data.success) {
        setTopic(data.topic);
        setComments(data.comments);
        setTime(data.comments.map((c) => c.createdAt));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (name) fetchAllData();
  }, [name, backendUrl]);

  if (!topic || comments === null) {
    return <Loading />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      background: 'var(--bg-base)',
    }}>
      {/* Topic Header */}
      <div
        className="animate-fade-in"
        style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Hash size={18} color="var(--accent)" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}>
              {topic?.name}
            </h1>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              marginTop: '2px',
            }}>
              <MessageCircle size={11} />
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Comments */}
      <ul
        style={{
          flex: 1,
          overflowY: 'auto',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {comments.length === 0 ? (
          <li style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MessageCircle size={22} color="var(--text-muted)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
                No messages yet
              </p>
              <p style={{ fontSize: '0.82rem' }}>Be the first one to start the conversation!</p>
            </div>
          </li>
        ) : (
          comments.map((c, index) => (
            <li
              key={c._id}
              className="comment-item"
              style={{
                animation: 'fadeIn 0.3s ease both',
                animationDelay: `${index * 30}ms`,
              }}
            >
              {/* Meta row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--accent)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: 'var(--accent-subtle)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-accent)',
                }}>
                  <Hash size={10} />
                  {topic.name}
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                }}>
                  <Clock size={11} />
                  {time ? dayjs(time[index]).fromNow() : ''}
                </span>
              </div>

              {/* Comment text */}
              <p style={{
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontWeight: 400,
              }}>
                {c.comment}
              </p>
            </li>
          ))
        )}
      </ul>

      {/* Sticky Comment Box */}
      <div style={{ flexShrink: 0 }}>
        <Comment name={name} refreshComment={fetchAllData} />
      </div>
    </div>
  );
}

export default Topic;
