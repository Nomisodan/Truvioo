import { useState, useEffect } from 'react';

const API = 'http://127.0.0.1:8000';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function NavItem({ item, active, expanded, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 18px',
        marginRight: 10,
        marginBottom: 2,
        cursor: 'pointer',
        color: active ? '#ff7b6b' : hovered ? '#ffffff' : 'rgba(255,255,255,0.72)',
        background: active ? 'rgba(255,123,107,0.14)' : hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        borderRadius: '0 12px 12px 0',
        transition: 'color 0.15s, background 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ flexShrink: 0, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
      </span>
      <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, opacity: expanded ? 1 : 0, transition: 'opacity 0.18s', fontFamily: 'Figtree, sans-serif' }}>
        {item.label}
      </span>
    </div>
  );
}

function Sidebar({ view, setView, token }) {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    ...(token
      ? [
          { id: 'subscriptions', label: 'Subscriptions', icon: <SparkleIcon /> },
          { id: 'upload', label: 'Upload', icon: <UploadIcon /> },
        ]
      : [
          { id: 'login', label: 'Login', icon: <PersonIcon /> },
          { id: 'register', label: 'Join', icon: <SparkleIcon /> },
        ]
    ),
  ];

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: 60,
        height: 'calc(100vh - 60px)',
        width: expanded ? 220 : 60,
        background: 'linear-gradient(180deg, #0a1812 0%, #1a3a2a 55%, #2d6a4f 100%)',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 150,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 14,
        boxShadow: expanded ? '4px 0 28px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      {navItems.map(item => (
        <NavItem
          key={item.id}
          item={item}
          active={view === item.id}
          expanded={expanded}
          onClick={() => setView(item.id)}
        />
      ))}
    </div>
  );
}

const COLORS = {
  green: '#2d6a4f',
  coral: '#ff7b6b',
  bg: '#f8f6f1',
  white: '#ffffff',
  text: '#1e2420',
  muted: '#6b7c74',
  border: '#e8e4de',
};

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openVideo = (video) => { setSelectedVideo(video); setView('watch'); };

  const fetchVideos = () => {
    fetch(`${API}/api/videos/`)
      .then(res => res.json())
      .then(data => { setVideos(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('home');
  };

  if (loading) return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: COLORS.muted, fontFamily: 'Figtree, sans-serif' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: 'Figtree, sans-serif', color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <Sidebar view={view} setView={setView} token={token} />

      {/* Topbar */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 }}>
        <span onClick={() => setView('home')} style={{ fontSize: '22px', fontWeight: '700', color: COLORS.green, cursor: 'pointer', letterSpacing: '-0.5px' }}>
          Tru<span style={{ color: COLORS.coral }}>vioo</span>
        </span>

        <input placeholder="Search videos..." style={{ border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '8px 16px', width: '300px', fontSize: '14px', background: COLORS.bg, outline: 'none', color: COLORS.text }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          {token ? (
            <>
              <button onClick={() => setView('upload')} style={{ background: COLORS.green, color: COLORS.white, border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>+ Upload</button>
              <button onClick={handleLogout} style={{ background: 'transparent', color: COLORS.muted, border: `1px solid ${COLORS.border}`, padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')} style={{ background: 'transparent', color: COLORS.green, border: `1px solid ${COLORS.green}`, padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Login</button>
              <button onClick={() => setView('register')} style={{ background: COLORS.green, color: COLORS.white, border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Join</button>
            </>
          )}
        </div>
      </div>

      <div style={{ paddingLeft: 60, minWidth: 0, overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box' }}>

        {view === 'home' && (
          <>
            {/* Featured strip */}
            {videos.length > 0 && (
              <div style={{ background: COLORS.green, borderRadius: '16px', marginBottom: '40px', display: 'flex', overflow: 'hidden', minHeight: '300px' }}>
                <div style={{ flex: 1, padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ background: COLORS.coral, color: COLORS.white, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '14px' }}>Featured Creator</span>
                  <h2 style={{ color: COLORS.white, fontSize: '28px', fontWeight: '700', margin: '0 0 8px', lineHeight: 1.2 }}>{videos[0].title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 20px' }}>by {videos[0].creator_name} · {videos[0].view_count} views</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>✦ Human</span>
                    <button onClick={() => openVideo(videos[0])} style={{ background: COLORS.coral, color: COLORS.white, border: 'none', padding: '10px 22px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Watch Now</button>
                  </div>
                </div>
                <div onClick={() => openVideo(videos[0])} style={{ width: '360px', flexShrink: 0, padding: '20px 20px 20px 0', cursor: 'pointer' }}>
                  <img
                    src={`https://videodelivery.net/${videos[0].cloudflare_video_id}/thumbnails/thumbnail.jpg`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', display: 'block' }}
                    alt={videos[0].title}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* Gaining Momentum strip */}
            {videos.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: COLORS.text }}>✦ Gaining Momentum</h3>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {videos.slice(0, 5).map(video => (
                    <div key={video.id} onClick={() => openVideo(video)} style={{ minWidth: '200px', background: COLORS.white, borderRadius: '12px', padding: '14px', border: `1px solid ${COLORS.border}`, flexShrink: 0, cursor: 'pointer', transition: 'transform 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ background: COLORS.bg, borderRadius: '8px', height: '100px', marginBottom: '10px', overflow: 'hidden' }}>
                        <img
                          src={`https://videodelivery.net/${video.cloudflare_video_id}/thumbnails/thumbnail.jpg`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt={video.title}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 4px', lineHeight: 1.3 }}>{video.title}</p>
                      <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>{video.view_count} views</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video grid */}
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>All Videos</h3>
            {videos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ color: COLORS.muted, fontSize: '16px' }}>No videos yet. Be the first to upload.</p>
                {!token && <button onClick={() => setView('register')} style={{ background: COLORS.green, color: COLORS.white, border: 'none', padding: '12px 24px', borderRadius: '20px', cursor: 'pointer', marginTop: '16px', fontWeight: '600' }}>Join Truvioo</button>}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {videos.map(video => (
                  <div key={video.id} onClick={() => openVideo(video)} style={{ background: COLORS.white, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${COLORS.border}`, transition: 'transform 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ position: 'relative', height: '160px', background: COLORS.bg, overflow: 'hidden' }}>
                      {video.cloudflare_video_id && video.cloudflare_video_id !== 'test123' ? (
                        <iframe
                          src={`https://iframe.cloudflarestream.com/${video.cloudflare_video_id}`}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '32px', color: COLORS.muted }}>▶</span>
                        </div>
                      )}
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: COLORS.green, color: COLORS.white, fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '10px' }}>✦ Human</span>
                    </div>
                    <div style={{ padding: '14px' }}>
                      <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '600', lineHeight: 1.3 }}>{video.title}</h4>
                      <p style={{ margin: '0 0 4px', fontSize: '13px', color: COLORS.muted }}>by {video.creator_name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted }}>{video.view_count} views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'watch' && selectedVideo && <WatchPage video={selectedVideo} videos={videos} onBack={() => setView('home')} onOpen={openVideo} token={token} />}
        {view === 'subscriptions' && <SubscriptionsPage token={token} onOpen={openVideo} />}
        {view === 'login' && <LoginForm onSuccess={t => { setToken(t); localStorage.setItem('token', t); setView('home'); }} />}
        {view === 'register' && <RegisterForm onSuccess={() => setView('login')} />}
        {view === 'upload' && <UploadForm token={token} onSuccess={() => { fetchVideos(); setView('home'); }} />}
      </div>
      </div>
    </div>
  );
}

function WatchPage({ video, videos, onBack, onOpen, token }) {
  const related = videos.filter(v => v.id !== video.id).slice(0, 10);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    if (!token || !video.creator) return;
    fetch(`${API}/api/users/${video.creator}/subscription-status/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setSubscribed(d.subscribed); setSubCount(d.subscriber_count); })
      .catch(() => {});
  }, [video.creator, token]);

  const toggleSubscribe = async () => {
    if (!token) return;
    const method = subscribed ? 'DELETE' : 'POST';
    const res = await fetch(`${API}/api/users/${video.creator}/subscribe/`, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      setSubscribed(!subscribed);
      setSubCount(c => subscribed ? c - 1 : c + 1);
    }
  };

  const submitComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    setComments(prev => [{ id: Date.now(), text: trimmed, time: 'Just now' }, ...prev]);
    setComment('');
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '16px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
        ← Back
      </button>

      {/* Player */}
      <div style={{ maxWidth: '900px', margin: '0 auto 20px', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ width: '100%', position: 'relative', paddingBottom: 'min(56.25%, calc(100vh - 260px))', background: '#000' }}>
          {video.cloudflare_video_id && video.cloudflare_video_id !== 'test123' ? (
            <iframe
              src={`https://iframe.cloudflarestream.com/${video.cloudflare_video_id}`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '48px', color: COLORS.muted }}>▶</span>
            </div>
          )}
        </div>
      </div>

      {/* Title & meta */}
      <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 10px', lineHeight: 1.3 }}>{video.title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: COLORS.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
          {video.creator_name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{video.creator_name}</p>
          <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted }}>{subCount} subscribers · {video.view_count} views</p>
        </div>
        {token && (
          <button onClick={toggleSubscribe} style={{ background: subscribed ? COLORS.border : COLORS.green, color: subscribed ? COLORS.text : COLORS.white, border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'background 0.2s' }}>
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
        <span style={{ marginLeft: 'auto', background: COLORS.green, color: COLORS.white, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>✦ Human</span>
      </div>

      {/* Description */}
      {video.description && (
        <div style={{ background: COLORS.white, borderRadius: '12px', padding: '16px 20px', border: `1px solid ${COLORS.border}`, marginBottom: '32px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: COLORS.text, lineHeight: 1.6 }}>{video.description}</p>
        </div>
      )}

      {/* More Videos carousel */}
      {related.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: COLORS.text }}>More Videos</h3>
          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', width: '100%', boxSizing: 'border-box' }}>
            {related.map(v => (
              <div key={v.id} onClick={() => onOpen(v)} style={{ minWidth: '180px', flexShrink: 0, cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', background: COLORS.white, border: `1px solid ${COLORS.border}`, transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '100px', background: COLORS.bg, overflow: 'hidden' }}>
                  <img
                    src={`https://videodelivery.net/${v.cloudflare_video_id}/thumbnails/thumbnail.jpg`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt={v.title}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{v.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: COLORS.muted }}>{v.creator_name} · {v.view_count} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: COLORS.text }}>Comments</h3>

        {/* Input */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: COLORS.border, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitComment()}
              placeholder="Add a comment..."
              style={{ width: '100%', border: 'none', borderBottom: `2px solid ${COLORS.border}`, background: 'transparent', outline: 'none', fontSize: '14px', padding: '6px 0', fontFamily: 'Figtree, sans-serif', color: COLORS.text, boxSizing: 'border-box' }}
            />
            {comment.trim() && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setComment('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: COLORS.muted, fontFamily: 'Figtree, sans-serif' }}>Cancel</button>
                <button onClick={submitComment} style={{ background: COLORS.green, color: COLORS.white, border: 'none', padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Figtree, sans-serif' }}>Comment</button>
              </div>
            )}
          </div>
        </div>

        {/* Comment list */}
        {comments.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: '14px' }}>No comments yet. Be the first.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: COLORS.green, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: COLORS.text }}>You <span style={{ fontWeight: '400', color: COLORS.muted }}>{c.time}</span></p>
                  <p style={{ margin: 0, fontSize: '14px', color: COLORS.text, lineHeight: 1.5 }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SubscriptionsPage({ token, onOpen }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/users/subscriptions/feed/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setVideos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <p style={{ color: COLORS.muted, fontFamily: 'Figtree, sans-serif' }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Subscriptions</h2>
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: COLORS.muted, fontSize: '16px' }}>No videos yet from creators you follow.</p>
          <p style={{ color: COLORS.muted, fontSize: '14px' }}>Subscribe to creators on their video pages.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {videos.map(video => (
            <div key={video.id} onClick={() => onOpen(video)} style={{ background: COLORS.white, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${COLORS.border}`, cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ position: 'relative', height: '160px', background: COLORS.bg, overflow: 'hidden' }}>
                <img
                  src={`https://videodelivery.net/${video.cloudflare_video_id}/thumbnails/thumbnail.jpg`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={video.title}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: COLORS.green, color: COLORS.white, fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '10px' }}>✦ Human</span>
              </div>
              <div style={{ padding: '14px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '600', lineHeight: 1.3 }}>{video.title}</h4>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: COLORS.muted }}>by {video.creator_name}</p>
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted }}>{video.view_count} views</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handle = async () => {
    const res = await fetch(`${API}/api/users/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (res.ok) onSuccess(data.access);
    else setError('Invalid credentials');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h2 style={{ fontWeight: '700', marginBottom: '24px' }}>Welcome back</h2>
      <input placeholder="Email" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
      <button onClick={handle} style={btnStyle}>Login</button>
      {error && <p style={{ color: COLORS.coral, marginTop: '12px' }}>{error}</p>}
    </div>
  );
}

function RegisterForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState('');

  const handle = async () => {
    const res = await fetch(`${API}/api/users/register/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, email, display_name: displayName }) });
    if (res.ok) { setStatus('Account created! Redirecting...'); setTimeout(onSuccess, 1000); }
    else setStatus('Registration failed. Try a different email or display name.');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h2 style={{ fontWeight: '700', marginBottom: '24px' }}>Join Truvioo</h2>
      <input placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} style={inputStyle} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
      <button onClick={handle} style={btnStyle}>Create Account</button>
      {status && <p style={{ color: COLORS.muted, marginTop: '12px' }}>{status}</p>}
    </div>
  );
}

function UploadForm({ token, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!title || !file) { setStatus('Title and file are required.'); return; }
    setStatus('Uploading...');
    try {
      const urlRes = await fetch(`${API}/api/videos/upload-url/`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
      const urlData = await urlRes.json();
      const formData = new FormData();
      formData.append('file', file);
      await fetch(urlData.upload_url, { method: 'POST', body: formData });
      await fetch(`${API}/api/videos/create/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title, description, cloudflare_video_id: urlData.video_id }) });
      setStatus('Upload complete!');
      setTimeout(onSuccess, 1000);
    } catch { setStatus('Something went wrong.'); }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto' }}>
      <h2 style={{ fontWeight: '700', marginBottom: '24px' }}>Upload a Video</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
      <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
      <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '16px', display: 'block' }} />
      <button onClick={handleUpload} style={btnStyle}>Upload</button>
      {status && <p style={{ color: COLORS.muted, marginTop: '12px' }}>{status}</p>}
    </div>
  );
}

const inputStyle = { width: '100%', marginBottom: '12px', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e8e4de', fontSize: '14px', background: '#f8f6f1', outline: 'none', boxSizing: 'border-box', fontFamily: 'Figtree, sans-serif' };
const btnStyle = { background: '#2d6a4f', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '20px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', width: '100%', fontFamily: 'Figtree, sans-serif' };

export default App;