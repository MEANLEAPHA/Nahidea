import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";

import { MapPin, Link2, CalendarDays, Settings, MessageCircle, Share2, Heart, Bookmark,
         MoreHorizontal, Image, BadgeCheck, Banana,} from "lucide-react";
import "../style/page/Account.css";

const token = localStorage.getItem("token");

export default function Account() {

//   const [onlineUsers, setOnlineUsers] = useState([]);
//   useEffect(() => {

//   socket.on(
//     "online-users",
//     (users) => {

//       setOnlineUsers(users);

//     }
//   );

//   return () => {

//     socket.off("online-users");

//   };

// }, []);

  const {id} = useParams(); // use state later
  const [activeTab, setActiveTab] = useState("posts");
  const [followState, setFollowState] =useState("follow");

  const [usernames, setUsernames] = useState("");
  const [nicknames, setNicknames] = useState("");
  const [avatar, setAvatar] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [bios, setBios] = useState("");
  const [professions, setProfessions] = useState("");


  const { username, userId, avatar_url, work_location, bio, nickname, profession, isOnline } = useOutletContext();

useEffect(() => {

  if (!id || !userId) {
    return;
  }

  
  const isOwnProfile =
    String(id) ===
    String(userId);

  if (isOwnProfile) {

    setUsernames(username);
    setNicknames(nickname);
    setAvatar(avatar_url);
    setWorkplace(work_location);
    setBios(bio);
    setProfessions(profession);

  } else {

    handleFetchProfile();

    fetchFollowStatus();

  }


}, [id, userId]);

  const handleFetchProfile = async () => {

    try{
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get-user-info/${id}`
      )
      const data = res.data.userData;
      setUsernames(data.username);
      setNicknames(data.nickname);
      setAvatar(data.avatar_url);
      setWorkplace(data.work_location);
      setBios(data.bio);
      setProfessions(data.profession);
    }
    catch (err) {
      console.error(err);
    }
  }
  const handleFollow = async () => {

  if (
    followState === "loading"
  ) {
    return;
  }

  try {

    setFollowState("loading");

    /*
    =========================
    FOLLOW
    =========================
    */

    if (
      followState === "follow" ||
      followState === "follows_you"
    ) {

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/add-follow/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      /*
      MUTUAL FOLLOW
      */

      if (res.data.mutual) {

        setFollowState("mutual");

      } else {

        setFollowState("following");

      }

      return;
    }

    /*
    =========================
    UNFOLLOW
    =========================
    */

    if (
      followState === "following" ||
      followState === "mutual"
    ) {

      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/unfollow/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      /*
      if they still follow you
      */

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/follow-status/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setFollowState(
        res.data.state
      );

    }

  } catch (err) {

    console.log(err);

    setFollowState("follow");

  }

};
  // const handleFollow = async () => {

  //   if (followState === "loading") {
  //     return;
  //   }

  //   try {

  //     setFollowState("loading");

  //     /*
  //     |----------------------------
  //     | FOLLOW
  //     |----------------------------
  //     */

  //     if (
  //       followState === "follow"
  //     ) {

  //       const res = await axios.post(
  //         `${import.meta.env.VITE_SERVER_URL}/api/add-follow/${id}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization : `Bearer ${token}`,
  //           }
  //         }
  //       );

  //       /*
  //       PRIVATE ACCOUNT
  //       */

  //       if (
  //         res.data.status ===
  //         "pending"
  //       ) {

  //         setFollowState(
  //           "requested"
  //         );

  //       } else {

  //         setFollowState(
  //           "following"
  //         );

  //       }

  //       return;
  //     }

  //     /*
  //     |----------------------------
  //     | UNFOLLOW
  //     |----------------------------
  //     */

  //     if (
  //       followState ===
  //         "following" ||
  //       followState ===
  //         "requested"
  //     ) {

  //       await axios.delete(
  //         `${import.meta.env.VITE_SERVER_URL}/api/unfollow/${id}`,
  //          {
  //           headers: {
  //             Authorization : `Bearer ${token}`,
  //           }
  //         }
  //       );

  //       setFollowState("follow");
  //     }

  //   } catch (err) {

  //     console.log(err);

  //     /*
  //     restore safe state
  //     */

  //     setFollowState("follow");

  //   }
  // };
  const fetchFollowStatus =
async () => {

  try {

    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/follow-status/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setFollowState(
      res.data.state
    );

  } catch (err) {

    console.log(err);

  }

};
  // const fetchFollowStatus = async () => {
  //   try {

  //     const res = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/api/follow-status/${id}`,
  //        {
  //           headers: {
  //             Authorization : `Bearer ${token}`,
  //           }
  //         }
  //     );

  //     if (
  //       res.data.status ===
  //       "accepted"
  //     ) {

  //       setFollowState(
  //         "following"
  //       );

  //     } else if (
  //       res.data.status ===
  //       "pending"
  //     ) {

  //       setFollowState(
  //         "requested"
  //       );

  //     } else {

  //       setFollowState("follow");

  //     }

  //   } catch (err) {

  //     console.log(err);

  //   }

  // };

  // const isOnline = onlineUsers.includes(String(id));
  return (
    <div className="nahideaProfilePage">

      {/* BANNER */}
      <div className="nahideaProfileBanner">

        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop"
          alt="banner"
        />

        <button className="nahideaProfileEditBannerBtn">
          Edit Banner
        </button>
      </div>

      {/* HEADER */}
      <div className="nahideaProfileHeader">

        <div className="nahideaProfileHeaderLeft">

          <div className="nahideaProfileAvatarWrap">

            <img
              src={avatar}
              alt="avatar"
              className="nahideaProfileAvatar"
            />

            <div
              className="nahideaProfileOnlineDot"
              style={{
                backgroundColor:
                  isOnline ? "yellowgreen" : "#6b7280",
              }}
            />
          </div>

          <div className="nahideaProfileUserInfo">

            <div className="nahideaProfileNameRow">

              <h1>
                {usernames}
              </h1>

              <Banana
                size={20}
                className="nahideaProfileVerified"
              />
            </div>

            <p className="nahideaProfileUsername">
              @{nicknames}
            </p>

            <p className="nahideaProfileBio">
              {/* Founder of Nahidea.
              Building modern
              anonymous social
              experiences for Gen Z. */}
              {professions} at {workplace}
            </p>

            <div className="nahideaProfileMeta">

              <span>
                <MapPin size={15} />
                Phnom Penh,
                Cambodia
              </span>

              <span>
                <Banana size={15} />
                Joined May 2026
              </span>

              <span>
                <Link2 size={15} />
                nahidea.com
              </span>
            </div>

            <div className="nahideaProfileStats">

              <div>
                <strong>
                  12.4K
                </strong>
                <span>
                  Followers
                </span>
              </div>

              <div>
                <strong>
                  483
                </strong>
                <span>
                  Following
                </span>
              </div>

              <div>
                <strong>
                  97
                </strong>
                <span>
                  Posts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="nahideaProfileActions">

        
          <button
  className="nahideaProfileFollowBtn"
  onClick={handleFollow}
>

{
  followState === "loading"
  && "Loading..."
}

{
  followState === "follow"
  && "Follow"
}

{
  followState === "following"
  && (
    <>
    <span>
      Following
    </span>
    <Unfollow/>
    </>
  )
}

{
  followState === "follows_you"
  && "Follow Back"
}

{
  followState === "mutual"
  && (
    <>
    <span>
      Friends
    </span>
    <Unfollow/>
    </>
  )
}

</button>

          <button className="nahideaProfileMessageBtn">
            Message
          </button>

          <button className="nahideaProfileIconBtn">
            <Settings
              size={18}
            />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="nahideaProfileBody">

        {/* LEFT SIDEBAR */}
        <aside className="nahideaProfileLeftSidebar">

          <div className="nahideaProfileCard">

            <h3>About</h3>

            <p>
              {bio}
            </p>
          </div>

          <div className="nahideaProfileCard">

            <h3>Interests</h3>

            <div className="nahideaProfileTags">

              <span>Startup</span>
              <span>React</span>
              <span>Node.js</span>
              <span>AI</span>
              <span>Product</span>
              <span>Design</span>
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <div className="nahideaProfileFeed">

          {/* TABS */}
          <div className="nahideaProfileTabs">

            <button
              className={
                activeTab ===
                "posts"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "posts"
                )
              }
            >
              Posts
            </button>

            <button
              className={
                activeTab ===
                "answers"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "answers"
                )
              }
            >
              Answers
            </button>

            <button
              className={
                activeTab ===
                "media"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "media"
                )
              }
            >
              Media
            </button>
          </div>

          {/* CREATE POST */}
          <div className="nahideaProfileCreatePost">

            <img
              src="https://api.dicebear.com/9.x/adventurer/svg?seed=Meanleap"
              alt=""
            />

            <input
              type="text"
              placeholder="Share something..."
            />

            <button>
              <Image size={18} />
            </button>
          </div>

         
        </div>

        {/* RIGHT */}
        <div className="nahideaProfileRightSidebar">

          <div className="nahideaProfileCard">

            <h3>
              Suggested People
            </h3>

            {[1, 2, 3].map(
              (user) => (
                <div
                  key={user}
                  className="nahideaProfileSuggestUser"
                >

                  <div>

                    <img
                      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=user${user}`}
                      alt=""
                    />

                    <div>
                      <h4>
                        User{" "}
                        {user}
                      </h4>

                      <span>
                        @user
                        {user}
                      </span>
                    </div>
                  </div>

                  <button>
                    Follow
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Unfollow = () => {
  const {id} = useParams(); // use state later
  const handleUnfollow = async () => {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/unfollow/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // const data = response.data;
      // if(data.mutual === false){
      //   setFollowState("follow");
      // }

    }
    catch(err){
      console.log(err);
    }
  }

  return(
   <button
   className="nahideaProfileFollowBtn"
   onClick={handleUnfollow}
   >
     Unfollow
   </button>
  )
}