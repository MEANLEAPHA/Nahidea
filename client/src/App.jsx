import React,{ useState, useEffect, useRef, memo } from 'react';
import {BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate} from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  connectSocket,
  disconnectSocket,
  getSocket
} from "./socket";

import { useAuth } from './assets/context/AuthContext';

// Import Page

// Component
  
import Aside from './assets/components/Aside';
import Header from '../src/assets/components/Header'; 
// Home
import Home from './assets/page/Home';

// Authentication
import Login  from './assets/Authentication/Login';
import Register from './assets/Authentication/Register';
import { VerifyEmail } from './assets/Authentication/VerifyEmail';
import { ForgetPassword } from './assets/Authentication/ForgetPassword';
import { VerifyEmailForgetPassword } from './assets/Authentication/VerifyEmailForgetPassword';
import { NewPassword } from './assets/Authentication/NewPassword';

// Action upload
import Question from './assets/upload/Question';
import Confession from './assets/upload/Confession';
import Content from './assets/upload/Content';
import EditContentBody from './assets/upload/EditContentBody';

//util
import getToken from './assets/util/auth';

// Style
import './assets/style/App.css';
import './assets/style/Main.css';
import './assets/style/Section.css'
import PrivacyPolicy from './assets/page/Privatepolicy';
import GifFeed from './assets/page/GifFeed';
import GifUpload from './assets/upload/GifUpload';
import FavoritesGif from './assets/page/FavoriteGif';
import Help from './assets/page/Help';
import UserAgreement from './assets/page/UserAgreement';
import Rule from './assets/page/Rule';
import Accessibility from './assets/page/Accessibility';
import AboutPost from './assets/page/AboutPost';
import AnswerPost from './assets/page/AnswerPost';
import Notification from './assets/page/Notification';
import Search from './assets/page/Search';
import AnswerQa from './assets/page/AnswerQa';
import Comment from './assets/page/Comment';
import ReportComment from './assets/page/ReportComment';
import Account from './assets/page/Account';
import SetupAccount from './assets/Authentication/SetupAccount';
import HallOfFame from './assets/page/HallOfFame';
import ReportHistory from './assets/page/ReportHistory';
import Chat from './assets/page/Chat';
import ReportConversation from './assets/page/ReportConversation';
import Accounts from './assets/page/Accounts';
import All from './assets/page/accounts/All';
import Posts from './assets/page/accounts/Posts';
import SocialActivity from './assets/page/accounts/SocialActivity';
import History from './assets/page/History';
import Favorite from './assets/page/Favorite';
import LikePost from './assets/page/LikePost';
import YourPosts from './assets/page/YourPosts';
import FeedbackForm from './assets/page/FeedbackForm';
import Trending from './assets/page/Trending';
import UnsolvedQA from './assets/page/UnsolvedQA';
import AllFriends from './assets/page/AllFriends';
import Notifications from './assets/page/Notifications';
import Spammy from './assets/page/Spammy';
import EditAccount from './assets/page/EditAccount';

const App = () =>{
    return(
        <BrowserRouter>
            <Routes>
                
                {/* Home Page */}
                <Route path='/' element={<Layout/>}>
                    {/* Action Upload page */}
                    <Route index element={<Home/>} />
                    <Route path='/home' element={<Home/>}></Route>
                   
                    {/* Report&FeedBack */}
                    <Route path='/report-conversation' element={<ReportConversation/>}></Route>


                    {/*Storage data*/}
                    <Route path='/history' element={<History/>}></Route>
                    <Route path='/favorite' element={<Favorite/>}></Route>
                    <Route path='/likepost' element={<LikePost/>}></Route>
                    <Route path='/yourpost' element={<YourPosts/>}></Route>

                    {/* Account */}
                    <Route path='/account' element={<Account/>}></Route>
                    <Route path='/editaccount' element={<EditAccount/>}></Route>

                    <Route path='/accounts' element={<Accounts/>}></Route>
                    <Route path='/friends' element={<AllFriends/>}></Route>

                    {/* Upload posts */}
                    <Route path='/create/question' element={<Question/>}></Route>
                    <Route path='/create/confession' element={<Confession/>}></Route>
                    <Route path='/create/content' element={<Content/>}></Route>

                    {/* post */}
                    <Route path='/aboutpost/:id' element={<AboutPost/>}></Route>
                    <Route path='/answer/:postId/:questionId/:questionType' element={<AnswerQa/>}></Route>
                    <Route path='/comment' element={<Comment/>}></Route>
                    <Route path ='/report' element={<ReportComment/>}></Route>
                    <Route path='/edit/content' element={<EditContentBody/>}></Route>

                    <Route path='/trending' element={<Trending/>}></Route>
                    <Route path='/unslovedqa' element={<UnsolvedQA/>}></Route>
                    <Route path='/spammy' element={<Spammy/>}></Route>

                    {/* Hall of fame */}
                    <Route path='/halloffame' element={<HallOfFame/>}></Route>

                    {/* Gif */}
                    <Route path='/gif' element={<GifFeed/>}></Route>
                    <Route path='/upload/gif' element={<GifUpload/>}></Route>
                    <Route path='/favorite/gif' element={<FavoritesGif/>}></Route>

                    {/* User assistant */}
                    <Route path='/help' element={<Help/>}></Route>
                   
                    {/* User Dashboard */}
                    <Route path='/notification' element={<Notification/>}></Route>
                    <Route path='/notifications' element={<Notifications/>}></Route>
                    {/* feedback */}
                    <Route path='/reporthistory' element={<ReportHistory/>}></Route> 
                    <Route path='/feedback' element={<FeedbackForm/>}></Route> 

                    {/* tool */}
                    <Route path='/search' element={<Search />}></Route>


                </Route>

                {/* gossiper */}
                 <Route path='/chat' element={<Chat/>}></Route>


                {/* User assistant */}
                <Route path='/useragreement' element = {<UserAgreement/>} />
                <Route path='/nahidearule' element={<Rule/>} />
                <Route path='/privacypolicy' element={<PrivacyPolicy/>}></Route>
                <Route path='/accessibility' element={<Accessibility/>}></Route>

                {/* Authentication */}
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/register' element={<Register/>}></Route>
                <Route path='/verifyemail' element={<VerifyEmail/>}></Route>
                <Route path='/forgetpassword' element={<ForgetPassword/>}></Route>
                <Route path='/verifyemailforgetpassword' element={<VerifyEmailForgetPassword/>}></Route>
                <Route path='/newpassword' element={<NewPassword/>}></Route>
                <Route path='/setupaccount' element={<SetupAccount/>}></Route>
        
                {/* Not Found page */}
                <Route path='*' element={<NotFound/>}></Route>
                
            </Routes>
        </BrowserRouter>
    )
}
 

const Layout = () => {

  const navigate = useNavigate();

  const {
    user,
    token,
    loading,
    logout,
  } = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);

// =========================================
// AXIOS INTERCEPTOR (final update)
// =========================================
useEffect(() => {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        // Only force logout if token is gone or expired
        if (!token || (expiry && Date.now() > Number(expiry))) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");

          disconnectSocket();
          logout?.();

          navigate("/login", { replace: true });
        }
      }

      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.response.eject(interceptor);
  };
}, [navigate, logout]);

  // =========================================
  // SOCKET
  // =========================================
  useEffect(() => {

    if (!token || !user) return;

    const expiry = Number(
      localStorage.getItem("tokenExpiry")
    );

    if (!expiry || Date.now() > expiry) {
      return;
    }

    const socket = connectSocket({
      token,
      userId: user.id,
      username: user.username,
      avatar_url: user.avatar_url
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {

      socket.off("online-users");

      disconnectSocket();
    };

  }, [token, user]);

  // =========================================
  // AUTO LOGOUT
  // =========================================
  useEffect(() => {

    if (!token) return;

    const expiry = Number(
      localStorage.getItem("tokenExpiry")
    );

    if (!expiry) return;

    const remaining = expiry - Date.now();

    if (remaining <= 0) {

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      disconnectSocket();

      logout?.();

      navigate("/login", {
        replace: true
      });

      return;
    }

    const timeout = setTimeout(() => {

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      disconnectSocket();

      logout?.();

      navigate("/login", {
        replace: true
      });

    }, remaining);

    return () => clearTimeout(timeout);

  }, [token, navigate, logout]);

  // =========================================
  // TRACK LOGIN
  // =========================================
  useEffect(() => {

    if (!token) return;

    const handleTrackLogin = async () => {

      try {

        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/record-login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      } catch (err) {

        console.error(err);

      }
    };

    handleTrackLogin();

  }, [token]);

  // =========================================
  // ASIDE
  // =========================================
  const [showMaxAside, setMaxAside] = useState(() => {
    return localStorage.getItem("maxAside") === "true";
  });

  useEffect(() => {

    localStorage.setItem(
      "maxAside",
      showMaxAside
    );

  }, [showMaxAside]);

  const toggleAside = () => {
    setMaxAside(prev => !prev);
  };

  // =========================================
  // THEME
  // =========================================
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {

    document.body.classList.toggle(
      "dark-theme",
      darkMode
    );

    localStorage.setItem(
      "darkMode",
      darkMode
    );

  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // =========================================
  // AFTER ALL HOOKS
  // =========================================
  
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!token || !user) {
  //   return <Navigate to="/login" replace />;
  // }

  // =========================================
  // ONLINE
  // =========================================
  const isOnline =
    user?.id
      ? onlineUsers.includes(String(user.id))
      : false;

  
  return (
    <>
      <Header
        avatar_url={user?.avatar_url}
        onToggleAside={toggleAside}
        onToggleTheme={toggleTheme}
        currentTheme={darkMode}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? "#1f1f1f" : "#ffffff",
            color: darkMode ? "#ffffff" : "#1f1f1f",
          },
        }}
      />

      <main style={{ position: "relative" }}>

        <Aside append={showMaxAside} />

        <section>
          <Outlet
            context={{
              user,
              isOnline,
              onlineUsers
            }}
          />
        </section>

      </main>
    </>
  );
};




const NotFound = () =>{
    return(
        <h1>
            Not Found
        </h1>
    )
}
export default App;



