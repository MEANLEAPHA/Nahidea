import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

// Import Page

    // Main
    import Header from '../src/assets/components/Header';
    import Main from '../src/assets/components/Main';
    import Footer from '../src/assets/components/Footer';

    // Authentication
    import Login  from './assets/Authentication/Login';
    import Register from './assets/Authentication/Register';

    // Action upload
    import Question from './assets/upload/question';
    import Confession from './assets/upload/Confession';
    import Content from './assets/upload/content';

// Style
import './assets/style/App.css';



const App = () =>{
    return(
        <BrowserRouter>
            <Routes>

                {/* Home Page */}
                <Route path='/' element={<Home/>}></Route>
                <Route path='/home' element={<Home/>}></Route>

                {/* Authentication */}
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/register' element={<Register/>}></Route>

                {/* Action Upload page */}
                <Route path='/create/question' element={<Question/>}></Route>
                <Route path='/create/confession' element={<Confession/>}></Route>
                <Route path='/create/content' element={<Content/>}></Route>

                {/* Not Found page */}
                <Route path='*' element={<NotFound/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}
 
const Home = () =>{

    const [showMaxAside, setMaxAside] = useState(() => {
            return localStorage.getItem("maxAside") === "true";
        })
    
        useEffect(()=>{
            localStorage.setItem("maxAside", showMaxAside)
        },
        [showMaxAside]
        );
    
        const toggleAside = () =>{
                setMaxAside(prev => !prev)
        }
    
    
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
            }
    return(
        <>
            <Header onToggleAside={toggleAside} onToggleTheme={toggleTheme} currentTheme={darkMode}/>
            <Main appendValue={showMaxAside}/>
            <Footer />
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

