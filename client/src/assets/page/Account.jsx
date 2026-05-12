// App.jsx
import { useState } from "react";
import {
  User,
  Users,
  Image,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Camera,
  Menu,
  X,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

import "../style/page/Account.css";

const postsData = [
  {
    id: 1,
    text: "Building modern scalable products requires ruthless prioritization. Most apps fail because they solve weak problems with expensive engineering.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    likes: 124,
    comments: 22,
    time: "12 mins ago",
  },
  {
    id: 2,
    text: "Your portfolio should demonstrate outcomes, not just animations and gradients.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    likes: 88,
    comments: 11,
    time: "1 hour ago",
  },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <button
          className="icon-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div className="mobile-brand">Nahidea Profile</div>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* SIDEBAR OVERLAY */}
      <div
        className={`overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="profile-layout">
        {/* LEFT SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
          <div className="sidebar-header">
            <h2>Profile</h2>

            <button
              className="close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="intro-card">
            <h3>Introduction</h3>

            <p>
              Product designer and startup builder focused on scalable digital
              systems, UX strategy, and growth-first thinking.
            </p>

            <div className="info-list">
              <div className="info-item">
                <Briefcase size={18} />
                <span>Senior Product Designer</span>
              </div>

              <div className="info-item">
                <Mail size={18} />
                <span>mathew@nahidea.com</span>
              </div>

              <div className="info-item">
                <Globe size={18} />
                <span>www.nahidea.com</span>
              </div>

              <div className="info-item">
                <MapPin size={18} />
                <span>New York, USA</span>
              </div>
            </div>
          </div>

          <div className="gallery-card">
            <div className="card-header">
              <h3>Gallery</h3>
              <span>12</span>
            </div>

            <div className="gallery-grid">
              {[
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
              ].map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* HERO */}
          <section className="hero-card">
            <div className="cover-wrapper">
              <img
                className="cover-image"
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop"
                alt=""
              />

              <button className="camera-btn">
                <Camera size={18} />
              </button>
            </div>

            <div className="hero-content">
              <div className="profile-avatar-wrapper">
                <img
                  className="profile-avatar"
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt=""
                />

                <div className="verified-badge">
                  <BadgeCheck size={18} />
                </div>
              </div>

              <div className="hero-info">
                <h1>Mathew Anderson</h1>
                <p>Senior Product Designer</p>
              </div>

              <div className="hero-actions">
                <button className="follow-btn">Follow</button>
                <button className="message-btn">Message</button>

                <button
                  className="theme-btn desktop-theme"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="stats-row">
              <div className="stat-card">
                <Image size={22} />
                <h3>938</h3>
                <p>Posts</p>
              </div>

              <div className="stat-card">
                <Users size={22} />
                <h3>3,586</h3>
                <p>Followers</p>
              </div>

              <div className="stat-card">
                <User size={22} />
                <h3>2,659</h3>
                <p>Following</p>
              </div>
            </div>

            {/* TABS */}
            <div className="tabs">
              {["profile", "followers", "friends", "gallery"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "tab active" : "tab"}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* FEED */}
          <section className="feed-section">
            {/* CREATE POST */}
            <div className="create-post">
              <textarea placeholder="Share your thoughts..." />

              <div className="create-actions">
                <div className="left-actions">
                  <button>📷 Photo</button>
                  <button>📝 Article</button>
                </div>

                <button className="post-btn">Post</button>
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "profile" && (
              <div className="posts-wrapper">
                {postsData.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-user">
                        <img
                          src="https://randomuser.me/api/portraits/men/32.jpg"
                          alt=""
                        />

                        <div>
                          <h4>Mathew Anderson</h4>
                          <span>{post.time}</span>
                        </div>
                      </div>

                      <button className="icon-btn">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>

                    <p className="post-text">{post.text}</p>

                    <img
                      className="post-image"
                      src={post.image}
                      alt=""
                    />

                    <div className="post-actions">
                      <button
                        className={
                          likedPosts.includes(post.id)
                            ? "liked"
                            : ""
                        }
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart size={18} />
                        {likedPosts.includes(post.id)
                          ? post.likes + 1
                          : post.likes}
                      </button>

                      <button>
                        <MessageCircle size={18} />
                        {post.comments}
                      </button>

                      <button>
                        <Share2 size={18} />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="tab-card">
                <h2>Followers</h2>
                <p>3,586 people follow this account.</p>
              </div>
            )}

            {activeTab === "friends" && (
              <div className="tab-card">
                <h2>Friends</h2>
                <p>Your professional network appears here.</p>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="tab-card">
                <h2>Gallery</h2>

                <div className="gallery-large">
                  {[
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=900&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=900&auto=format&fit=crop",
                  ].map((img, i) => (
                    <img key={i} src={img} alt="" />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}