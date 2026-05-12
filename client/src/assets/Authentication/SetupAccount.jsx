import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import axios from "axios";

import {
  Save,
  Check,
  RotateCw,
  Plus,
  ArrowLeft,
} from "lucide-react";

import "../style/Authentication/SetupAccount.css";

/* ------------------ */
/* AVATAR DATA */
/* ------------------ */

const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "croodles",
  "fun-emoji",
  "icons",
  "identicon",
  "initials",
  "lorelei",
  "micah",
  "miniavs",
  "notionists",
  "open-peeps",
  "personas",
  "pixel-art",
  "rings",
  "shapes",
  "thumbs",
];

const COLORS = [
  "c0aede",
  "ffd5dc",
  "b6e3f4",
  "d1d4f9",
  "fef08a",
  "86efac",
  "fca5a5",
  "fdba74",
  "67e8f9",
  "a7f3d0",
  "f9a8d4",
  "ddd6fe",
  "fecaca",
  "fcd34d",
  "93c5fd",
  "4ade80",
  "fb7185",
  "818cf8",
];

const PRESET_SEEDS = [
  "Alex",
  "Luna",
  "Milo",
  "Nova",
  "Leo",
  "Zara",
  "Kai",
  "Jade",
  "Ace",
  "Ruby",
  "Ghost",
  "Pixel",
  "Shadow",
  "Cosmo",
  "Rex",
  "Violet",
  "Coco",
  "Blaze",
  "Storm",
  "Echo",
];

/* ------------------ */
/* MAIN PAGE */
/* ------------------ */

const SetupAccount = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [showAvatarStudio, setShowAvatarStudio] =
    useState(false);

  const [avatar, setAvatar] = useState(
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex"
  );

  const [profession, setProfession] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [userId, setUserId] =
    useState(null);

  const [location, setLocation] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  const [bio, setBio] = useState("");

  useEffect(() => {
    if (state) {
      setEmail(state.Email);
      setUserId(state.UserId);
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/update-user`,
        {
          avatar,
          profession,
          location,
          nickname,
          userId,
          email,
          bio,
        }
      );

      if (res.status === 200) {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="setup-page">

      {/* AVATAR STUDIO */}
      {showAvatarStudio && (
        <AvatarPlayground
          setAvatar={setAvatar}
          setShowAvatarStudio={
            setShowAvatarStudio
          }
        />
      )}

      {/* FORM */}
      {!showAvatarStudio && (
        <div className="setup-container">

          {/* LEFT */}
          <div className="setup-left">

            <div className="profile-card">

              <div className="avatar-wrapper">

                <img
                  src={avatar}
                  alt="avatar"
                  className="profile-avatar"
                />

                <button
                  type="button"
                  className="edit-avatar-btn"
                  onClick={() =>
                    setShowAvatarStudio(
                      true
                    )
                  }
                >
                  <Plus size={20} />
                </button>
              </div>

              <h2>Create Profile</h2>

              <p>
                Build your public
                identity for Nahidea
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="setup-right">

            <form
              onSubmit={handleSubmit}
              className="setup-form"
            >

              <div className="input-group">
                <label>
                  Profession
                </label>

                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={profession}
                  onChange={(e) =>
                    setProfession(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  Work Location
                </label>

                <input
                  type="text"
                  placeholder="Phnom Penh"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  Nickname
                </label>

                <input
                  type="text"
                  placeholder="@meanleap"
                  value={nickname}
                  onChange={(e) =>
                    setNickname(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Bio</label>

                <textarea
                  placeholder="Tell people who you are..."
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
              >
                Complete Setup
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupAccount;

/* ------------------ */
/* AVATAR PLAYGROUND */
/* ------------------ */

function AvatarPlayground({
  setAvatar,
  setShowAvatarStudio,
}) {
  const [saved, setSaved] =
    useState(false);

  const [style, setStyle] =
    useState("adventurer");

  const [seed, setSeed] =
    useState("Alex");

  const [flip, setFlip] =
    useState(false);

  const [rotate, setRotate] =
    useState(0);

  const [backgroundColor,
    setBackgroundColor] =
    useState("c0aede");

  const avatarUrl = useMemo(() => {
    const params =
      new URLSearchParams();

    params.set("seed", seed);

    params.set(
      "backgroundColor",
      backgroundColor
    );

    params.set("flip", flip);

    params.set(
      "rotate",
      rotate
    );

    return `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
  }, [
    style,
    seed,
    backgroundColor,
    flip,
    rotate,
  ]);

  const handleSelectAvatar = () => {
    setAvatar(avatarUrl);

    setSaved(true);

    setTimeout(() => {
      setShowAvatarStudio(
        false
      );
    }, 700);
  };

  return (
    <div className="avatar-studio">

      {/* TOP */}
      <div className="studio-topbar">

        <button
          className="back-btn"
          onClick={() =>
            setShowAvatarStudio(
              false
            )
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          className="save-avatar-btn"
          onClick={
            handleSelectAvatar
          }
        >
          {saved ? (
            <>
              <Check size={18} />
              Selected
            </>
          ) : (
            <>
              <Save size={18} />
              Select Avatar
            </>
          )}
        </button>
      </div>

      <div className="studio-layout">

        {/* LEFT */}
        <div className="studio-sidebar">

          <h3>Styles</h3>

          <div className="style-grid">

            {AVATAR_STYLES.map(
              (s) => (
                <div
                  key={s}
                  className={`style-card ${
                    style === s
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setStyle(s)
                  }
                >
                  <img
                    src={`https://api.dicebear.com/9.x/${s}/svg?seed=preview`}
                    alt=""
                  />

                  <span>{s}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="studio-preview">

          <div className="preview-card">

            <img
              src={avatarUrl}
              alt=""
              className="main-avatar"
            />

            <div className="preset-section">

              <h3>
                Choose Avatar
              </h3>

              <div className="preset-grid">

                {PRESET_SEEDS.map(
                  (preset) => (
                    <div
                      key={preset}
                      className={`preset-card ${
                        seed ===
                        preset
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSeed(
                          preset
                        )
                      }
                    >
                      <img
                        src={`https://api.dicebear.com/9.x/${style}/svg?seed=${preset}&backgroundColor=${backgroundColor}`}
                        alt=""
                      />

                      <span>
                        {preset}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="studio-controls">

          <h3>Customize</h3>

          <div className="control-group">

            <div className="switch-row">

              <label>
                Flip Avatar
              </label>

              <input
                type="checkbox"
                checked={flip}
                onChange={(e) =>
                  setFlip(
                    e.target
                      .checked
                  )
                }
              />
            </div>
          </div>

          <div className="control-group">

            <div className="rotate-header">

              <label>
                Rotate
              </label>

              <span>
                {rotate}°
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="360"
              value={rotate}
              onChange={(e) =>
                setRotate(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="rotate-slider"
            />

            <button
              className="rotate-btn"
              onClick={() =>
                setRotate(
                  (prev) =>
                    prev >= 360
                      ? 0
                      : prev +
                        45
                )
              }
            >
              <RotateCw size={16} />
              Rotate +45°
            </button>
          </div>

          <div className="control-group">

            <label>
              Background Colors
            </label>

            <div className="color-list">

              {COLORS.map(
                (color) => (
                  <button
                    key={color}
                    className={`color-btn ${
                      backgroundColor ===
                      color
                        ? "active"
                        : ""
                    }`}
                    style={{
                      background: `#${color}`,
                    }}
                    onClick={() =>
                      setBackgroundColor(
                        color
                      )
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}