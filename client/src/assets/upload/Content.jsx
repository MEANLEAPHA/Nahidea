import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Aside from "../components/Aside";
import "../style/Main.css";
import "../style/App.css";


export default function Content(){

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

const Main = ({appendValue}) =>{
    return(
        <main>
            <Aside append={appendValue}/>
            <Section />
        </main>
    )
}

const Section = () =>{
     const navigate = useNavigate();
      const [files, setFiles] = useState(Array(5).fill(null)); // max 5 slots

  const handleFileChange = (index, event) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  };

  const handleRemove = (index) => {
    const newFiles = [...files];
    newFiles[index] = null;
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", "My Post");
    formData.append("type", "post");
    formData.append("isAnonymous", false);

    files.forEach((file) => {
      if (file) {
        formData.append("media", file); // multiple files under same field
      }
    });

    try {
      const res = await axios.post(
        "https://nahidea-sever-backend.onrender.com/api/posts/create/content",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Upload success:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
    return (
    <form onSubmit={handleSubmit}>
      <h3>Upload up to 5 images/videos</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {files.map((file, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
            {file ? (
              <div>
                <p>{file.name}</p>
                <button type="button" onClick={() => handleRemove(index)}>
                  Cancel
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(index, e)}
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}