import React,{ useState, useEffect, useRef, memo } from 'react';
import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
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
import AvatarPlayground from './assets/page/AvatarPlayground';
import ReportComment from './assets/page/ReportComment';

import Account from './assets/page/Account';
import SetupAccount from './assets/Authentication/SetupAccount';
import HallOfFame from './assets/page/HallOfFame';

const token = localStorage.getItem("token");




const App = () =>{
    return(
        <BrowserRouter>
            <Routes>
                
                {/* Home Page */}
                <Route path='/' element={<Layout/>}>
                    {/* Action Upload page */}
                    <Route index element={<Home/>} />
                    <Route path='/home' element={<Home/>}></Route>

                    {/* Account */}
                    <Route path='/account' element={<Account/>}></Route>
                    
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

                    {/* Hall of fame */}
                    <Route path='/halloffame' element={<HallOfFame/>}></Route>

                    {/* Gif */}
                    <Route path='/gif' element={<GifFeed/>}></Route>
                    <Route path='/upload/gif' element={<GifUpload/>}></Route>
                    <Route path='/favorite/gif' element={<FavoritesGif/>}></Route>

                    {/* User assistant */}
                    <Route path='/help' element={<Help/>}></Route>
                    <Route path='/useragreement' element = {<UserAgreement/>} />
                    <Route path='/nahidearule' element={<Rule/>} />
                    <Route path='/privacypolicy' element={<PrivacyPolicy/>}></Route>
                    <Route path='/accessibility' element={<Accessibility/>}></Route>

                    {/* User Dashboard */}
                    <Route path='/notification' element={<Notification/>}></Route>

                    {/* tool */}
                    <Route path='/search' element={<Search />}></Route>
                    <Route path='/avatarplayground' element={<AvatarPlayground/>}></Route>

                </Route>

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
 

const Layout = () => 
    {

  const { user, token, loading } = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);

  // socket
  useEffect(() => {

    if (!user || !token) return;

    const socket = connectSocket({
      token,
      userId: user.id,
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
      disconnectSocket();
    };

  }, [user, token]);

  const [showMaxAside, setMaxAside] = useState(() => {
        return localStorage.getItem("maxAside") === "true";
    });
  
    useEffect(()=>{
        localStorage.setItem("maxAside", showMaxAside)
    },
    [showMaxAside]
    );

    const toggleAside = () =>{
            setMaxAside(prev => !prev)
    };
    
    // Theme mode tool
    const [darkMode, setDarkMode] = useState( () => {
        return localStorage.getItem("darkMode") === "true"; 
    });

    useEffect(
        () => {
            if(darkMode){
                document.body.classList.add("dark-theme")
            }
            else{
                document.body.classList.remove("dark-theme")
            }
            localStorage.setItem("darkMode", darkMode);
        },
        [darkMode]
    );
    const toggleTheme = () =>{
        setDarkMode(prev => !prev)
    };
       

  // track login
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const isOnline =
    user?.id
      ? onlineUsers.includes(String(user.id))
      : false;

  return (
    <>
      <Header avatar_url={user?.avatar_url} onToggleAside={toggleAside} onToggleTheme={toggleTheme} currentTheme={darkMode}/>

      <main style={{ position: "relative" }}>
        <Aside />

        <section>
          <Outlet
            context={{
              user,
              isOnline,
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





// const Layout = () => {
//      // if(!token){
//     //     return <Login/>
//     // }

    

//     const [onlineUsers, setOnlineUsers] = useState([]);
//       useEffect(() => {
    
//          handleTrackLogin();
//       socket.on(
//         "online-users",
//         (users) => {
    
//           setOnlineUsers(users);
    
//         }
//       );
    
//       return () => {
    
//         socket.off("online-users");
    
//       };
    
//     }, []);

    

//     const handleTrackLogin = async() =>{
//         try{
//             await axios.post(
//                 `${import.meta.env.VITE_SERVER_URL}/api/record-login`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//         }catch(err){
//             console.error(err);
//         }
//     }

//     // Aside mode tool
//     const [username, setUsername] = useState('Guest');
//     const [avatar_url, setAvatar] = useState("https://api.dicebear.com/9.x/adventurer/svg?seed=Alex");
//     const [profession, setProfession] = useState(null);
//     const [work_location, setLocation] = useState(null);
//     const [bio, setBio] = useState("Come and join Nahidea's family!");
//     const [nickname, setNickname] = useState('whynotsignup');
//     const [userId, setUserId] = useState(null);
//     const [showMaxAside, setMaxAside] = useState(() => {
//             return localStorage.getItem("maxAside") === "true";
//         });

    
    
//     useEffect(()=>{
//         localStorage.setItem("maxAside", showMaxAside)
//     },
//     [showMaxAside]
//     );

//     const toggleAside = () =>{
//             setMaxAside(prev => !prev)
//     };
    
//     // Theme mode tool
//     const [darkMode, setDarkMode] = useState( () => {
//         return localStorage.getItem("darkMode") === "true"; 
//     });

//     useEffect(
//         () => {
//             if(darkMode){
//                 document.body.classList.add("dark-theme")
//             }
//             else{
//                 document.body.classList.remove("dark-theme")
//             }
//             localStorage.setItem("darkMode", darkMode);
//         },
//         [darkMode]
//     );
       

//    useEffect(() => {
//   async function loadTempoInfo() {
//     // 1. Check sessionStorage first
//     const cachedName = sessionStorage.getItem("username");
//     const cachedAvatar = sessionStorage.getItem("avatar");
//     const cachedLocation = sessionStorage.getItem("location");
//     const cachedBio = sessionStorage.getItem("bio");
//     const cachedNickname = sessionStorage.getItem("nickname");
//     const cachedUserId = sessionStorage.getItem("userId");
//     const cachedProfession = sessionStorage.getItem("profession");

//     if (cachedName && cachedUserId) {
//       setUsername(cachedName);
//       setUserId(cachedUserId);
//       setAvatar(cachedAvatar);
//       setLocation(cachedLocation);
//       setBio(cachedBio);
//       setProfession(cachedProfession);
//       setNickname(cachedNickname);
//       return;
//     }

//     // 2. Ask backend for username (backend decodes token itself)
//     try {
//       const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });
//       if (!res.ok) throw new Error("Failed to fetch username");

//       const data = await res.json();
//       const username = data.userData?.username || data.username;
//       const avatar = data.userData?.avatar_url || data.avatar_url;
//       const location = data.userData?.work_place || data.work_place;
//       const bio = data.userData?.bio || data.bio;
//       const nickname = data.userData?.nickname || data.nickname;
//       const profession = data.userData?.profession || data.profession;
//       const userId = data.userData?.id || data.id;


//       sessionStorage.setItem("userId", userId);
//       setUserId(userId);
//       sessionStorage.setItem("username", username);
//       setUsername(username);
//       sessionStorage.setItem("avatar", avatar);
//       setAvatar(avatar);
//       sessionStorage.setItem("location", location);
//       setLocation(location);
//       sessionStorage.setItem("bio", bio);
//       setBio(bio);
//       sessionStorage.setItem("nickname", nickname);
//       setNickname(nickname);
//       sessionStorage.setItem("profession", profession);
//       setProfession(profession);

//     } catch (err) {
//       console.error("Error loading username", err);
//     }
//   }

//   loadTempoInfo();
// }, []);

//     const toggleTheme = () =>{
//         setDarkMode(prev => !prev)
//     };

//      const isOnline = userId ? onlineUsers.includes(String(userId)) : false;



//      return(
//         <>
//             <Header onToggleAside={toggleAside} onToggleTheme={toggleTheme} currentTheme={darkMode} avatar_url={avatar_url}/>
//             <main style={{position:'relative'}}>
//                 <Aside append={showMaxAside}/>
//                 <section>
//                     <Outlet context={{ username, userId, avatar_url, work_location, bio, nickname, profession, isOnline }} />
//                 </section>
//             </main>
         
//         </>
//     )
// }
