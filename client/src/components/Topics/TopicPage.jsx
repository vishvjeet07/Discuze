import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../Loader/Loading';
import { Hash, Clock, TrendingUp } from 'lucide-react';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

function TopicPage() {
  dayjs.extend(relativeTime);
  const { backendUrl } = useContext(AppContext);
  const [topics, setTopics] = useState([]);
  const [time, setTime] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fetchAllTopics = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/topic');
      if (data.success) {
        setTopics(data.topics);
        setTime(data.topics.map((t) => t.createdAt));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  if (!loaded) return <Loading />;

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '32px 20px',
      minHeight: 'calc(100vh - 60px)',
    }}>
      {/* Page Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <TrendingUp size={20} color="var(--accent)" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            All Topics
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {topics.length} topic{topics.length !== 1 ? 's' : ''} available — pick one to join the discussion
        </p>
      </div>

      {/* Topics List */}
      {topics.length === 0 ? (
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Hash size={24} color="var(--text-muted)" />
          </div>
          <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>No topics yet</p>
          <p style={{ fontSize: '0.85rem' }}>Sign in to create the first topic!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} className="animate-fade-in">
          {topics.map((t, index) => (
            <Link
              key={t._id ?? index}
              to={`topic/${t.name}`}
              className="topic-item"
              style={{
                animationDelay: `${index * 40}ms`,
                animation: 'fadeIn 0.35s ease both',
                animationDelay: `${index * 35}ms`,
              }}
            >
              <span style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 250ms ease, border-color 250ms ease',
              }}>
                <Hash size={14} color="var(--accent)" />
              </span>
              <span style={{ flex: 1, fontWeight: 500 }}>
                {t.name}
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
              }}>
                <Clock size={12} />
                {time ? dayjs(time[index]).fromNow() : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopicPage;
