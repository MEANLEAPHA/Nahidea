import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faClockRotateLeft,
  faXmark,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosInstance";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

let debounceTimer = null;

// Splits a suggestion string around the typed query (case-insensitive) and
// wraps the matching part so it can be styled with the primary color.
const highlightMatch = (text, query) => {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <span className="search-highlight-match">{match}</span>
      {after}
    </>
  );
};


const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
   const wrapperRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistoryData(data);
  }, []);

 
    useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await api.get(`/api/search/autocomplete`, {
          params: { q: query },
        });
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("autocomplete error:", err);
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const saveToHistory = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history = history.filter((item) => item !== trimmed);
    history = [trimmed, ...history].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    setHistoryData(history);
  };

  const runSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    saveToHistory(trimmed);
    setShowDropdown(false);
    inputRef.current?.blur();
    navigate(`/searchform?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      runSearch(query);
    }
  };

  const handleDeleteHistory = (term) => {
    const updated = historyData.filter((item) => item !== term);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setHistoryData(updated);
  };

  const handleClearAllHistory = () => {
    localStorage.setItem("searchHistory", JSON.stringify([]));
    setHistoryData([]);
  };

  return (
    <div className="header-middle header-children">
      <div className="search-box not-mobile-tool" ref={wrapperRef}>
        {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="search-bar-icon" /> */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Nah!dea..."
          value={query}
          id="search-input"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="search-bar-input"
        />
        {query && (
            <button
                type="button"
                className="btn-clear-value"
                onClick={() => {
              setQuery("");
              setSuggestions([]);
            }}
                >
                <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          
        )}
         {showDropdown && (
             <div className="results-search">
                 <div className="search-bar-dropdown dev-res">
          {suggestions.length > 0 && (
            <ul className="history-ul">
              <AnimatePresence mode="popLayout">
                {suggestions.slice(0, 6).map((s) => (
                  <motion.li
                    key={s}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, height: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="history-card"
                    onClick={() => runSearch(s)}
                  >
                    <div className="history-card-info">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="search-icon-query"
                        style={{ opacity: 0.7 }}
                      />
                      <p className="query-title">{highlightMatch(s, query)}</p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {/* User's own search history */}
          {historyData.length > 0 && (
            <div className="recent-search dev-res">
              <div className="label-flex">
                <label>Searches History</label>
                <button onClick={handleClearAllHistory} style={{cursor:"pointer"}} type="button">Clear All</button>
              </div>
              <ul className="history-ul">
                {historyData.map((item, index) => (
                  <li key={index} className="history-card" onClick={() => runSearch(item)}>
                    <div className="history-card-info">
                      <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        className="search-icon-query"
                        style={{ opacity: 0.7 }}
                      />
                      <p className="query-title">{highlightMatch(item, query)}</p>
                    </div>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="history-icon-trash"
                      onClick={(e) => {
                        handleDeleteHistory(item);
                        e.stopPropagation();
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
            </div>
      )}
      </div>
      <button className='search-button not-mobile-tool' onClick={() => runSearch(query)} >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
      </button>
    </div>
  );
};

export default SearchBar;



// const Search = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredResults, setFilteredResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);
 
//   const wrapperRef = useRef(null);
//   const navigate = useNavigate();

//   const searchQuery = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);

//     if (value.trim() === "") {
//       setFilteredResults([]);
//       return;
//     }

//     const results = ResultsDisplay.filter(
//       (item) =>
//         item.title.toLowerCase().includes(value) ||
//         item.description.toLowerCase().includes(value)
//     );
//     setFilteredResults(results);
//   };

//   // Close results when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setShowResults(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const fireQuery = () => {
//       if(filteredResults.length > 0){
//           navigate(filteredResults[0].link);
//           const dataVisit = {title: filteredResults[0].title, link: filteredResults[0].link, icon: filteredResults[0].icon, description: filteredResults[0].description};
//           const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
//           const recentVisit = JSON.parse(localStorage.getItem('recentVisit')) || [];
//           const updateHistory = [searchTerm, ...history].slice(0,5);
//           localStorage.setItem("searchHistory", JSON.stringify(updateHistory));
//           if(recentVisit.some((item) => item.link === filteredResults[0].link)){
//             const remainData = recentVisit.filter((item) => item.link !== filteredResults[0].link);
//             const moveToTop = [dataVisit, ...remainData].slice(0,5);
//             localStorage.setItem("recentVisit", JSON.stringify(moveToTop));
//              return;
//           };
//           const updateRecentVisit = [dataVisit, ...recentVisit].slice(0,5);
//           localStorage.setItem("recentVisit", JSON.stringify(updateRecentVisit));
//       } 
//       else{
//         if(searchTerm === '') return;
//         navigate(`/${searchTerm}`);
//         const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
//         const updateHistory = [searchTerm, ...history].slice(0,5);
//         localStorage.setItem("searchHistory", JSON.stringify(updateHistory));
//       }
//   }

//   const clearSearch = () => {
//     setSearchTerm("");
//     setFilteredResults([]);

    
//     // setShowResults(false);
//   };
//   return (
//      <>
//         <div className="search-box not-mobile-tool" ref={wrapperRef}>
//           <input
//             type="text"
//             id="search-input"
//             value={searchTerm}  
//             placeholder="Search Nah!dea..."
//             onChange={searchQuery}
//             onFocus={() => setShowResults(true)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault(); // prevent form submission if inside a form
//                 fireQuery();
//               }
//             }}
//           />
//           {searchTerm && (
//           <button
//             type="button"
//             className="btn-clear-value"
//             onClick={clearSearch}
//           >
//             <FontAwesomeIcon icon={faTimesCircle} />
//           </button>
//         )}
//           {showResults && (
//             <div className="results-search">
//               <TopResults results={filteredResults} />
//               <HistorySearch />
//               <RecentSearch />
//               <PoplularSearch />
//             </div>
//           )}
//         </div>
//         <button className='search-button not-mobile-tool' onClick={fireQuery} >
//               <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
//         </button>
//       </>
//   );
// }


// const RecentSearch = () => {
//   const [recentData, setRecentData] = useState([]);
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("recentVisit")) || [];
//     setRecentData(data);
//   }, []);
  
//    const handleDelete = (title) => {
//       const updateData = recentData.filter((item) => item.title !== title);
//        localStorage.setItem("recentVisit", JSON.stringify(updateData));
//       setRecentData(updateData);
     
//    }
//    const handelClearAll = () => {
//       const update = recentData.slice( recentData.length);
//       localStorage.setItem("recentVisit", JSON.stringify(update));
//       setRecentData(update);
//    }

//   if(recentData.length === 0){
//     return null;
//   }

//   return(
//     <div className="search-result-visit dev-res">
//                 <div className='label-flex'>
//                   <label><FontAwesomeIcon icon={faMagnifyingGlassChart} /> Recent Searches</label>
//                   <button onClick={handelClearAll}>Clear All</button>
//                 </div>
//                 <ul className='history-ul'>
//                   {recentData.map((item, index) => (
//                     <RecentCard key={index} icon={item.icon} link={item.link} description={item.description} title={item.title} onDelete={handleDelete}/>
//                   ))}
//                 </ul>
//       </div>
//   )
// }
// const RecentCard = ({description,link,icon,title, onDelete}) => {
//   const navigate = useNavigate();
//    const handleClick = () => {
//         navigate(link);
//         const currentData = { title, link, icon, description };
//          const recentVisit = JSON.parse(localStorage.getItem('recentVisit')) || [];
//            if(recentVisit.some((item) => item.link === link)){
//             const remainData = recentVisit.filter((item) => item.link !== link);
//             const moveToTop = [currentData, ...remainData].slice(0,5);
//             localStorage.setItem("recentVisit", JSON.stringify(moveToTop));
//              return;
//           };
//           const updateRecentVisit = [currentData, ...recentVisit].slice(0,5);
//           localStorage.setItem("recentVisit", JSON.stringify(updateRecentVisit));
//     }
//   return(
//       <li className = 'history-card'  onClick={handleClick}>
//         <div className='history-card-info'> 
//               <div><FontAwesomeIcon icon={icon}  className='search-icon-query'/> </div>
//             <div className = 'dev-info'>
//                   <p className='query-title'>{title}</p>
//                   <p className='query-description'>{description}</p>
//            </div>
//         </div>
//            <FontAwesomeIcon icon={faTrashCan}  className='history-icon-trash' onClick={(e)=>{onDelete(title); e.stopPropagation()}}/> 
//       </li>
//   )
// }
// const HistorySearch = () => {
//    const [historyData, setHistoryData] = useState([]);
//    useEffect(() => {
//       const data = JSON.parse(localStorage.getItem("searchHistory")) || [];
//       setHistoryData(data);
//    }, []);
 
//    const handleDelete = (title) => {
//       const updateData = historyData.filter((item) => item !== title);
//        localStorage.setItem("searchHistory", JSON.stringify(updateData));
//       setHistoryData(updateData);
     
//    }
//    const handelClearAll = () => {
//       const update = historyData.slice( historyData.length);
//       localStorage.setItem("searchHistory", JSON.stringify(update));
//       setHistoryData(update);
//    }

//   if(historyData.length === 0){
//     return null;
//   }
//   return(
//       <div className="recent-search dev-res">
//           <div className='label-flex'><label>Searches History</label> <button onClick={handelClearAll}>Clear All</button></div>
//           <ul class='history-ul'>
//             {historyData.map((item,index) => (
//               <HistoryCard key={index} title={item} onDelete={handleDelete}/>
//             ))}
//           </ul>
//       </div>
//   )
  
// }
// const HistoryCard = ({title, onDelete}) => {
//   const navigate = useNavigate();
//    const handleClick = () => {
//         navigate(`/${title}`);
        
//          const recentVisit = JSON.parse(localStorage.getItem('searchHistory')) || [];
//            if(recentVisit.some((item) => item === title)){
//             const remainData = recentVisit.filter((item) => item !== title);
//             const moveToTop = [title, ...remainData].slice(0,5);
//             localStorage.setItem("searchHistory", JSON.stringify(moveToTop));
//              return;
//           };
//           const updateRecentVisit = [title, ...recentVisit].slice(0,5);
//           localStorage.setItem("searchHistory", JSON.stringify(updateRecentVisit));
//     }
//     return (
//       <li className = 'history-card' onClick={handleClick}>
//         <div className='history-card-info'>
//             <FontAwesomeIcon icon={faClockRotateLeft} className='search-icon-query' style={{opacity:"0.7"}}/> 
           
//                <p className='query-title'>{title}</p>
           
             
           
//         </div>
//            <FontAwesomeIcon icon={faTrashCan}  className='history-icon-trash' onClick={(e)=>{onDelete(title); e.stopPropagation()}}/> 
//       </li>
//     )
//  };
//  const TopResults = ({results}) => {
//   if (results.length === 0) {
//     return null;
//   }

//   return (
//     <div className='search-result dev-res'>
//       <label><FontAwesomeIcon icon={faChartSimple} /> Top Result for you</label>
//       <ul className='query-result-ul'>
//         {results.map(item => (
//           <QueryCard 
//             key={item.id} 
//             icon={item.icon} 
//             link={item.link} 
//             description={item.description} 
//             title={item.title} 
//           />
//         ))}
//       </ul>
//     </div>
//   );
// };
// const QueryCard = ({id, icon, link, description, title}) => {
//     const navigate = useNavigate();
//     const handleClick = () => {
//         navigate(link);
//         const currentData = { id, title, link, icon, description };
//          const recentVisit = JSON.parse(localStorage.getItem('recentVisit')) || [];
//            if(recentVisit.some((item) => item.link === link)){
//             const remainData = recentVisit.filter((item) => item.link !== link);
//             const moveToTop = [currentData, ...remainData].slice(0,5);
//             localStorage.setItem("recentVisit", JSON.stringify(moveToTop));
//              return;
//           };
//           const updateRecentVisit = [currentData, ...recentVisit].slice(0,5);
//           localStorage.setItem("recentVisit", JSON.stringify(updateRecentVisit));
//     }
//     return (
//       <li className = 'query-card' onClick={handleClick}>
//            <FontAwesomeIcon icon={icon}  className='search-icon-query'/> 
//            <div className = 'dev-info'>
//               <p className='query-title'>{title}</p>
//               <p className='query-description'>{description}</p>
//            </div>
//       </li>
//     )
//  }
//  const ResultsDisplay = [
//   {id:1, icon:faChartPie, link:'/Dashboard', description: "Central hub with panels, widgets, charts, and key metrics.", title: "Dashboard" },
//   {id:2, icon:faSliders, link:'/Maintenance', description: "System maintenance tools and configuration management.", title: "Maintenance" },
//   {id:3, icon:faBug, link:'/Error', description: "Monitor and review issues, errors, and troubleshooting logs.", title: "Error" },
//   {id:4, icon:faDatabase, link:'/Database', description: "Access and manage database records, pending updates, and edits.", title: "Database" },
//   {id:5, icon:faUser, link:'/User', description: "View and manage user profiles, pending approvals, and edits.", title: "User" },
//   {id:6, icon:faBook, link:'/Book', description: "Browse and update book records, pending entries, and edits.", title: "Book" },
//   {id:7, icon:faComment, link:'/Comment', description: "Manage comments including pending submissions and edits.", title: "Comment" },
//   {id:8, icon:faComments, link:'/Reply', description: "Review and edit replies, including pending and updated entries.", title: "Reply" },
//   {id:9, icon:faUsers, link:'/Community', description: "Community management with pending requests and editable records.", title: "Community" },
//   {id:10, icon:faCommentDots, link:'/Feedback', description: "Feedback dashboard with panels, widgets, and analytics charts.", title: "Feedback" },
//   {id:11, icon:faFlag, link:'/Report', description: "Reporting tools with structured panels, widgets, and charts.", title: "Report" },
//   {id:12, icon:faNewspaper, link:'/Article', description: "Article management with dashboards, widgets, and analytics.", title: "Article" },
//   {id:14, icon:faBell, link:'/Notification', description: "Notification center with panels, widgets, and activity charts.", title: "Notification" }
// ];
//  const PoplularSearch = () => {
//     return(
//         <div className='popular-search dev-res'>
//                <label>  <FontAwesomeIcon icon={faFireFlameCurved} /> Popular Searches</label>
          
//                <ul className='popular-ul'>
//                     {PopularResult.map(item => (
//                       <PopularCard key={item.id} icon={item.icon} description={item.description} title={item.title} link={item.link}/>
//                     ))}
//                </ul>
//         </div>
//     )
//  }
//  const PopularCard = ({icon, link, description, title}) => {
//     const navigate = useNavigate();
//     return (
//       <li className = 'pop-card' onClick={()=>navigate(link)}>
//            <FontAwesomeIcon icon={icon}  className='search-icon-query'/> 
//            <div className = 'dev-info'>
//               <p className='query-title'>{title}</p>
//               <p className='query-description'>{description}</p>
//            </div>
//       </li>
//     )
//  }
//  const PopularResult = [
//   {id:1, icon:faBan, link:'/Dashboard', description: "Central hub with panels, widgets, charts, and key metrics.", title: "Pending User" },
//   {id:2, icon:faFeather, link:'/Maintenance', description: "System maintenance tools and configuration management.", title: "Upload Article" },
//   {id:3, icon:faBullhorn, link:'/Error', description: "Monitor and review issues, errors, and troubleshooting logs.", title: "Alert System Notification" },
//   {id:4, icon:faServer, link:'/Database', description: "Access and manage database records, pending updates, and edits.", title: "Cloud Storage" }
// ];