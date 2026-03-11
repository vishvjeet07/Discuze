import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

function Comment({ name, refreshComment }) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const textareaRef = useRef(null);

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post(backendUrl + `/api/topic/${name}`, { comment });
      if (data.success) {
        refreshComment();
        toast.success(data.message);
        setComment("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = '44px';
        }
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Auto-grow textarea
  const handleInput = (e) => {
    const ta = e.target;
    ta.style.height = '44px';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    setComment(ta.value);
  };

  return (
    <form
      onSubmit={addComment}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}
    >
      <textarea
        ref={textareaRef}
        value={comment}
        onInput={handleInput}
        onChange={e => setComment(e.target.value)}
        placeholder="Write a comment…"
        rows={1}
        style={{
          flex: 1,
          padding: '11px 14px',
          borderRadius: '12px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          resize: 'none',
          outline: 'none',
          minHeight: '44px',
          maxHeight: '120px',
          transition: 'border-color 250ms ease, box-shadow 250ms ease',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--accent)';
          e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border-default)';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        type="submit"
        disabled={!comment.trim() || sending}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: comment.trim() && !sending ? 'var(--accent)' : 'var(--bg-elevated)',
          border: '1px solid',
          borderColor: comment.trim() && !sending ? 'var(--accent)' : 'var(--border-default)',
          color: comment.trim() && !sending ? '#fff' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: comment.trim() && !sending ? 'pointer' : 'not-allowed',
          transition: 'all 250ms ease',
          flexShrink: 0,
          boxShadow: comment.trim() && !sending ? '0 2px 8px var(--accent-glow)' : 'none',
        }}
      >
        <Send size={17} style={{ transform: sending ? 'scale(0.8)' : 'none', transition: 'transform 200ms ease' }} />
      </button>
    </form>
  );
}

export default Comment;
