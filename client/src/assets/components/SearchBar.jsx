import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faClockRotateLeft,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import api from "../api/axiosInstance";

let debounceTimer = null;

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistoryData(data);
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
    <div className="search-box not-mobile-tool " style={{ position: "relative" }}>
      <div className="search-bar-input-div">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-bar-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search post, title, or user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onKeyDown={handleKeyDown}
          className="search-bar-input"
        />
        {query && (
          <FontAwesomeIcon
            icon={faXmark}
            className="search-bar-clear"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
            }}
          />
        )}
      </div>

      {showDropdown && (
        <div className="search-bar-dropdown dev-res">
          {/* Autocomplete suggestions (global, from redis ranking) */}
          {suggestions.length > 0 && (
            <ul className="history-ul">
              {suggestions.map((s, i) => (
                <li
                  key={`sugg-${i}`}
                  className="history-card"
                  onClick={() => runSearch(s)}
                >
                  <div className="history-card-info">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon-query" style={{ opacity: 0.7 }} />
                    <p className="query-title">{s}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* User's own search history */}
          {!query && historyData.length > 0 && (
            <div className="recent-search dev-res">
              <div className="label-flex">
                <label>Searches History</label>
                <button onClick={handleClearAllHistory}>Clear All</button>
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
                      <p className="query-title">{item}</p>
                    </div>
                    <FontAwesomeIcon
                      icon={faXmark}
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
      )}
    </div>
  );
};

export default SearchBar;