import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";

function Signup() {
  const { setToken, backendUrl } = useContext(AppContext);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", agree: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    if (!form.agree) e.agree = "You must accept the Terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl + `/api/auth/register`, {
        username: form.name,
        email: form.email,
        password: form.password,
      }, { withCredentials: true });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/');
        toast.success(data.message);
      }
    } catch (err) {
      setServerError(err?.response?.data?.message || err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ name, value, show, onToggle, placeholder, error }) => (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-base"
        style={{ paddingRight: '44px' }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          borderRadius: '4px',
          transition: 'color 200ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      {error && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '5px' }}>{error}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      background: 'var(--bg-base)',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(230,57,70,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <UserPlus size={20} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Join the Discuze community.
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="error-box" style={{ marginBottom: '16px' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.02em' }}>
              NAME
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your full name"
              className="input-base"
            />
            {errors.name && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '5px' }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.02em' }}>
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              className="input-base"
            />
            {errors.email && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '5px' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.02em' }}>
              PASSWORD
            </label>
            <PasswordInput
              name="password"
              value={form.password}
              show={showPw}
              onToggle={() => setShowPw(s => !s)}
              placeholder="At least 6 characters"
              error={errors.password}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.02em' }}>
              CONFIRM PASSWORD
            </label>
            <PasswordInput
              name="confirmPassword"
              value={form.confirmPassword}
              show={showPw2}
              onToggle={() => setShowPw2(s => !s)}
              placeholder="Re-enter password"
              error={errors.confirmPassword}
            />
          </div>

          {/* Terms */}
          <div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
                style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                I agree to the{" "}
                <a href="#" style={{ color: 'var(--link-color)', fontWeight: 500 }}>Terms &amp; Privacy Policy</a>
              </span>
            </label>
            {errors.agree && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '5px' }}>{errors.agree}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '10px',
              background: loading ? 'var(--bg-elevated)' : 'var(--accent)',
              color: loading ? 'var(--text-muted)' : '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 250ms ease',
              boxShadow: loading ? 'none' : '0 2px 12px var(--accent-glow)',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? 'var(--bg-elevated)' : 'var(--accent)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 2px 12px var(--accent-glow)'; }}
          >
            {loading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-smooth 0.7s linear infinite' }} />
                Creating account…
              </>
            ) : "Create account"}
          </button>

          {/* Login hint */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: 'var(--link-color)', fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
