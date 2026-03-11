import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Hash, User, BookOpen, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function Profile() {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("profileTab");
    return saved ?? 'topics';
  });
  const { backendUrl } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/profile", { withCredentials: true });
      if (data.success) {
        setUsername(data.userInfo.username);
        setEmail(data.userInfo.email);
        setTopics(data.topics.map(t => t.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createTopic = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setCreating(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/create",
        { topic },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setTopic("");
        await fetchUserData();
      }
    } catch (error) {
      toast.error("Failed to create topic");
    } finally {
      setCreating(false);
    }
  };

  const deleteTopic = async (topicName) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/delete/${topicName}`, { withCredentials: true });
      if (data.success) {
        await fetchUserData();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete topic");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/update`, { username, email }, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("profileTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const tabs = [
    { id: 'topics', label: 'My Topics', icon: <BookOpen size={15} /> },
    { id: 'profile', label: 'Settings', icon: <User size={15} /> },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
    }}>
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 20px',
      }}>
        {/* User greeting */}
        <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 4px 16px var(--accent-glow)',
            }}>
              {username ? username[0].toUpperCase() : '?'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {username || 'Loading…'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{email}</p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '28px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TOPICS TAB ── */}
        {activeTab === 'topics' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Create Topic */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} color="var(--accent)" />
                Create New Topic
              </h2>
              <form onSubmit={createTopic} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter topic name…"
                  className="input-base"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={creating || !topic.trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: creating || !topic.trim() ? 'var(--bg-elevated)' : 'var(--accent)',
                    color: creating || !topic.trim() ? 'var(--text-muted)' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: creating || !topic.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 250ms ease',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-sans)',
                    boxShadow: creating || !topic.trim() ? 'none' : '0 2px 8px var(--accent-glow)',
                  }}
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </form>
            </div>

            {/* Topics List */}
            <div>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Your Topics ({topics.length})
              </h3>

              {topics.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <Hash size={28} color="var(--border-strong)" />
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No topics yet</p>
                  <p style={{ fontSize: '0.82rem' }}>Create your first topic above.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {topics.map((t, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        transition: 'border-color 200ms ease, background 200ms ease',
                        animation: 'fadeIn 0.3s ease both',
                        animationDelay: `${index * 40}ms`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--accent-subtle)',
                        border: '1px solid var(--border-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Hash size={14} color="var(--accent)" />
                      </div>
                      <Link
                        to={`/topic/${t}`}
                        style={{
                          flex: 1,
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      >
                        {t}
                      </Link>
                      <button
                        onClick={() => deleteTopic(t)}
                        title="Delete topic"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'transparent',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,57,70,0.1)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '24px',
            }}>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="var(--accent)" />
                Profile Settings
              </h2>
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="input-base"
                    placeholder="Your username"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-base"
                    placeholder="your@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '11px',
                    borderRadius: '10px',
                    background: saving ? 'var(--bg-elevated)' : 'var(--accent)',
                    color: saving ? 'var(--text-muted)' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'all 250ms ease',
                    boxShadow: saving ? 'none' : '0 2px 12px var(--accent-glow)',
                    fontFamily: 'var(--font-sans)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px',
                  }}
                  onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.background = saving ? 'var(--bg-elevated)' : 'var(--accent)'; e.currentTarget.style.transform = 'none'; }}
                >
                  {saving ? (
                    <>
                      <div style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-smooth 0.7s linear infinite' }} />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
