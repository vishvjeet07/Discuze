import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import { assests } from '../../assets/assests';
import { Menu, X, LogOut, User } from "lucide-react";
import { VscAccount } from "react-icons/vsc";
import toast from 'react-hot-toast';

function Navbar() {
  const { token, setToken, backendUrl, navigate } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const fetchToken = () => {
    const t = localStorage.getItem('token');
    setToken(t);
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        localStorage.removeItem("token");
        navigate('/');
        fetchToken();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [token]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isProfilePage = location.pathname === '/profile';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img
              src={assests.logo}
              alt="Discuze"
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Search */}
          <div style={{ flex: 1, maxWidth: '520px', display: 'none' }} className="desktop-search">
            <SearchBar />
          </div>

          {/* Desktop Auth */}
          <div style={{ display: 'none', alignItems: 'center', gap: '10px', flexShrink: 0 }} className="desktop-auth">
            {token ? (
              isProfilePage ? (
                <button
                  onClick={logout}
                  className="btn"
                  style={{ background: 'transparent', border: '1px solid rgba(230,57,70,0.4)', color: '#e63946', fontSize: '0.85rem', padding: '7px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 250ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e63946'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(230,57,70,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e63946'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/profile"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'transparent', transition: 'all 250ms ease', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                  <VscAccount size={18} />
                  Profile
                </Link>
              )
            ) : (
              <>
                <Link to="/signup">
                  <button
                    className="btn-outline-pill"
                    style={{ cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                  >
                    Sign up
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    style={{
                      padding: '7px 20px',
                      borderRadius: '9999px',
                      background: 'var(--accent)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px var(--accent-glow)',
                      transition: 'all 250ms ease',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.boxShadow = '0 4px 16px var(--accent-glow)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 2px 8px var(--accent-glow)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    Log in
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isOpen ? 'var(--bg-elevated)' : 'transparent',
              border: '1px solid',
              borderColor: isOpen ? 'var(--border-default)' : 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 250ms ease',
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            zIndex: 99,
            background: 'rgba(10,10,15,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <SearchBar />
          {token ? (
            isProfilePage ? (
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: 'rgba(230,57,70,0.1)',
                  border: '1px solid rgba(230,57,70,0.3)',
                  borderRadius: '10px',
                  color: '#e63946',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '11px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-sans)',
                }}>
                  <User size={16} /> My Profile
                </button>
              </Link>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '11px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}>
                  Sign up
                </button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '11px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px var(--accent-glow)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  Log in
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-search  { display: flex !important; }
          .desktop-auth    { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
