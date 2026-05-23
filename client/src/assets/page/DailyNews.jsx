import React, { useState, useEffect, useCallback } from "react";
import "../style/page/DailyNews.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faLaughBeam,
  faLightbulb,
  faHandshake,
  faQuestionCircle,
  faBook,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";

/* =========================
   GENERIC CARD
========================= */

const BaseFlipCard = ({
  isFlipped,
  onFlip,
  front,
  back,
  frontClass = "",
}) => {

  const [startY, setStartY] = useState(0);

  return (
    <div
      className={`flip-card ${isFlipped ? "flipped" : ""}`}

      onTouchStart={(e) => {
        setStartY(e.touches[0].clientY);
      }}

      onTouchEnd={(e) => {

        const endY = e.changedTouches[0].clientY;

        const moved = Math.abs(endY - startY);

        /* user is scrolling */
        if (moved > 12) return;

        onFlip();

      }}

      onClick={() => {
        onFlip();
      }}
    >
      <div className="flip-card-inner">

        <div className={`flip-card-front ${frontClass}`}>
          {front}
        </div>

        <div className="flip-card-back">
          <div className="card-scroll-content">
            {back}
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */

export default function DailyNews() {

  const [cardsData, setCardsData] = useState({});
  const [flipped, setFlipped] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     BACKGROUNDS
  ========================= */

  const bgImages = {
    joke:
      "https://img.freepik.com/premium-photo/distorted-happy-smiles-vector-seamless-pattern-design_776674-940491.jpg?semt=ais_hybrid&w=740&q=80",

    didyouknow:
      "https://img.spoonflower.com/c/10853676/p/f/m/M79z86J1krFvf-vLS1wKbdDWol5wNp9lx34LjSG8WloxQVWjQ45w/10853676.png",

    advice:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=560&fit=crop",

    question:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=560&fit=crop",
  };

  /* =========================
     API FETCHERS
  ========================= */

  const fetchJoke = async () => {
    try {

      const res = await fetch(
        "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist,explicit&type=twopart"
      );

      const data = await res.json();

      return {
        setup: data.setup,
        delivery: data.delivery,
      };

    } catch {

      return {
        setup: "Why do programmers prefer dark mode?",
        delivery: "Because light attracts bugs!",
      };

    }
  };

  const fetchFact = async () => {
    try {

      const res = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );

      const data = await res.json();

      return data.text;

    } catch {

      return "A group of flamingos is called a flamboyance.";

    }
  };

  const fetchAdvice = async () => {
    try {

      const res = await fetch("https://api.adviceslip.com/advice");

      const data = await res.json();

      return data.slip.advice;

    } catch {

      return "Focus on consistency instead of motivation.";

    }
  };

  const fetchQuestion = async () => {
    try {

      const res = await fetch(
        "https://opentdb.com/api.php?amount=1"
      );

      const data = await res.json();

      const q = data.results[0];

      const correct = decodeURIComponent(q.correct_answer);

      const options = [
        ...q.incorrect_answers.map(a => decodeURIComponent(a)),
        correct,
      ];

      options.sort(() => Math.random() - 0.5);

      return {
        question: decodeURIComponent(q.question),
        options,
        correctAnswer: correct,
      };

    } catch {

      return {
        question: "What is the largest planet in our solar system?",
        options: ["Mars", "Earth", "Jupiter", "Saturn"],
        correctAnswer: "Jupiter",
      };

    }
  };

  const fetchWikipedia = async () => {
    try {

      const res = await fetch(
        "https://en.wikipedia.org/api/rest_v1/page/random/summary"
      );

      const data = await res.json();

      return {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail?.source || null,
      };

    } catch {

      return {
        title: "Wikipedia",
        extract:
          "Wikipedia is the free encyclopedia anyone can edit.",
        thumbnail: null,
      };

    }
  };

  /* =========================
     CARD CONFIG
  ========================= */

  const categories = [
    {
      id: "wiki",
      title: "Knowledge",
      icon: faBook,
      fetcher: fetchWikipedia,
    },
    {
      id: "didyouknow",
      title: "Did You Know",
      icon: faLightbulb,
      fetcher: fetchFact,
      bg: bgImages.didyouknow,
    },

    {
      id: "advice",
      title: "Advice",
      icon: faHandshake,
      fetcher: fetchAdvice,
      bg: bgImages.advice,
    },
    {
      id: "joke",
      title: "Joke",
      icon: faLaughBeam,
      fetcher: fetchJoke,
      bg: bgImages.joke,
    },
    {
      id: "question",
      title: "Question",
      icon: faQuestionCircle,
      fetcher: fetchQuestion,
      bg: bgImages.question,
    },

    
  ];

  /* =========================
     FETCH ALL
  ========================= */

  const fetchAllData = useCallback(async () => {

    setIsLoading(true);
    setError("");

    try {

      const results = await Promise.all(
        categories.map(async cat => ({
          id: cat.id,
          data: await cat.fetcher(),
        }))
      );

      const mapped = {};

      results.forEach(item => {
        mapped[item.id] = item.data;
      });

      setCardsData(mapped);

      const reset = {};

      categories.forEach(cat => {
        reset[cat.id] = false;
      });

      setFlipped(reset);

    } catch (err) {

      console.error(err);

      setError("Failed to load content.");

    } finally {

      setIsLoading(false);

    }

  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const toggleFlip = (id) => {
    setFlipped(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* =========================
     RENDER CARDS
  ========================= */

  const cards = categories.map(cat => {

    const data = cardsData[cat.id];

    /* QUESTION */

    if (cat.id === "question" && data) {

      return (
        <BaseFlipCard
          key={cat.id}
          isFlipped={flipped[cat.id]}
          onFlip={() => toggleFlip(cat.id)}
          frontClass="card-with-bg question-front"
          front={
            <>
              <div
                className="card-overlay"
                style={{ backgroundImage: `url(${cat.bg})`, backgroundOpacity: 0.5 }}
              />

              <FontAwesomeIcon
                className="card-icons"
                icon={cat.icon}
              />

              <h4>{cat.title}</h4>

            


            </>
          }
          back={
            <div className="card-content">
              {data.question}
              <br/>
              -- {data.correctAnswer} --
            </div>
          }
        />
      );
    }

    /* JOKE */

    if (cat.id === "joke" && data) {

      return (
        <BaseFlipCard
          key={cat.id}
          isFlipped={flipped[cat.id]}
          onFlip={() => toggleFlip(cat.id)}
          frontClass="card-with-bg joke-front"
          front={
            <>
              <div
                className="card-overlay"
                style={{ backgroundImage: `url(${cat.bg})` }}
              />

              <FontAwesomeIcon
                className="card-icons"
                icon={cat.icon}
              />

              <h4>Joke</h4>

            </>
          }
          back={
            <div className="card-content">
               {data.setup}
               <br />
              -- {data.delivery} --
            </div>
          }
        />
      );
    }

    /* WIKI */

    if (cat.id === "wiki" && data) {

      return (
        <BaseFlipCard
          key={cat.id}
          isFlipped={flipped[cat.id]}
          onFlip={() => toggleFlip(cat.id)}
          frontClass="wiki-front"
          front={
            <>
              <div
                className="wiki-bg"
                style={{
                  backgroundImage: `url(${data.thumbnail})`,
                }}
              />

             <div
                className="wiki-overlay"
                style={{ "--preview": `url(${data.thumbnail})` }}
              />


          

                <FontAwesomeIcon
                  className="card-icons"
                  icon={cat.icon}
                  style={{zIndex:'100'}}
                />

                <h4 style={{zIndex:'100'}}>{cat.title}</h4>

    

              
            </>
          }
          back={
            <div
              className="wiki-summary-content"
              onScroll={(e) => {
                e.stopPropagation(); // keep flip from triggering
              }}
            >
              {data.extract}
            </div>

          }
        />
      );
    }

    /* NORMAL */

    return (
      <BaseFlipCard
        key={cat.id}
        isFlipped={flipped[cat.id]}
        onFlip={() => toggleFlip(cat.id)}
        frontClass="card-with-bg"
        front={
          <>
            <div
              className="card-overlay"
              style={{
                backgroundImage: `url(${cat.bg})`,
              }}
            />
            <FontAwesomeIcon
              className="card-icons"
              icon={cat.icon}
            />
            <h4>{cat.title}</h4>
          </>
        }
        back={
          <div className="card-content">
            {data}
          </div>
        }
      />
    );
  });

  return (
    <div className="daily-container">

      <div className="daily-header">

        <div>
          <h2>Daily Inspiration</h2>

          <p className="header-sub">
            Your brain deserves premium content
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchAllData}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faSyncAlt} />

          {isLoading ? "Refreshing..." : "Get new"}
        </button>

      </div>



      <div className="story-cards-wrapper">
        <div className="story-cards">
          {cards}
        </div>
      </div>
          {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}