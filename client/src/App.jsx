import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';

import { jwtDecode } from "jwt-decode";


// Import Page

    // Component
    import Header from '../src/assets/components/Header';   
    import Aside from './assets/components/Aside';

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

// Style
import './assets/style/App.css';
import './assets/style/Main.css';
import './assets/style/Section.css'
import PrivacyPolicy from './assets/page/Privatepolicy';


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
                    <Route path='/create/question' element={<Question/>}></Route>
                    <Route path='/create/confession' element={<Confession/>}></Route>
                    <Route path='/create/content' element={<Content/>}></Route>

                     {/* Rule */}
                    <Route path='/privacypolicy' element={<PrivacyPolicy/>}></Route>
                </Route>

                {/* Authentication */}
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/register' element={<Register/>}></Route>
                <Route path='/verifyemail' element={<VerifyEmail/>}></Route>
                <Route path='/forgetpassword' element={<ForgetPassword/>}></Route>
                <Route path='/verifyemailforgetpassword' element={<VerifyEmailForgetPassword/>}></Route>
                <Route path='/newpassword' element={<NewPassword/>}></Route>


               
                

                {/* Not Found page */}
                <Route path='*' element={<NotFound/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}
 







const Layout = () => {
     // if(!token){
    //     return <Login/>
    // }

    // Aside mode tool
    const [username, setUsername] = useState('Guest');

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
       

   useEffect(() => {
  async function loadUsername() {
    // 1. Check sessionStorage first
    const cached = sessionStorage.getItem("username");
    if (cached) {
      setUsername(cached);
      return;
    }

    // 2. Ask backend for username (backend decodes token itself)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Failed to fetch username");

      const data = await res.json();
      const username = data.userData?.username || data.username;
      sessionStorage.setItem("username", username);
      setUsername(username);
    } catch (err) {
      console.error("Error loading username", err);
    }
  }

  loadUsername();
}, []);

    const toggleTheme = () =>{
        setDarkMode(prev => !prev)
    };
     return(
        <>
            <Header onToggleAside={toggleAside} onToggleTheme={toggleTheme} currentTheme={darkMode}/>
            <main>
                <Aside append={showMaxAside}/>
                <section>
                    <Outlet context={{ username }} />
                </section>
            </main>
         
        </>
    )
}






const NotFound = () =>{
    return(
        <h1>
            Not Found
        </h1>
    )
}
export default App;

