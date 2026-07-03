// import React, {useEffect, useState, useRef} from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faCircleQuestion} from"@fortawesome/free-regular-svg-icons";
// import { faThumbsDown, faThumbsUp,  faHandPointer, faHandPeace, faHand, faLocationCrosshairs, faStar, faUpDown, faRankingStar} from "@fortawesome/free-solid-svg-icons";
// import { iconOptions } from "../data/post_type_data";
// import{SignatureOutlined, FolderOpenOutlined} from '@ant-design/icons';
// import '../style/page/AnswerQa.css';

// // Mock data for testing
// const MOCK_QA_DATA = {
//   openend: {
//     id: 101,
//     title: "What's the best way to learn React in 2026?",
//     question_type: "openend",
//     question_related_to: "Web Development",
//     question_text: "What's the best way to learn React in 2026?",
//     range_min: null,
//     range_max: null,
//     range_step: null,
//     default_range_value: null,
//     choice: null,
//     choices: null,
//     include_all_above: null,
//     items: null,
//     rating_icon_id: null
//   },
//   closedend: {
//     id: 102,
//     title: "Is JavaScript a good first programming language?",
//     question_type: "closedend",
//     question_related_to: "Programming",
//     question_text: "Is JavaScript a good first programming language?",
//     range_min: null,
//     range_max: null,
//     range_step: null,
//     default_range_value: null,
//     choice: null,
//     choices: null,
//     include_all_above: null,
//     items: null,
//     rating_icon_id: null
//   },
//   range: {
//     id: 103,
//     title: "How satisfied are you with current AI tools?",
//     question_type: "range",
//     question_related_to: "Technology",
//     question_text: "How satisfied are you with current AI tools?",
//     range_min: 0,
//     range_max: 100,
//     range_step: 1,
//     default_range_value: 75,
//     choice: null,
//     choices: null,
//     include_all_above: null,
//     items: null,
//     rating_icon_id: null
//   },
//   singlechoice: {
//     id: 104,
//     title: "Which programming language should I learn first?",
//     question_type: "singlechoice",
//     question_related_to: "Programming",
//     question_text: "Which programming language should I learn first?",
//     range_min: null,
//     range_max: null,
//     range_step: null,
//     default_range_value: null,
//     choice: [
//       { id: 1, choice_text: "Python" },
//       { id: 2, choice_text: "JavaScript" },
//       { id: 3, choice_text: "Java" },
//       { id: 4, choice_text: "C++" },
//       { id: 5, choice_text: "Ruby" }
//     ],
//     choices: null,
//     include_all_above: null,
//     items: null,
//     rating_icon_id: null
//   },
//   multiplechoice: {
//     id: 105,
//     title: "What features would you like to see in a new social media app?",
//     question_type: "multiplechoice",
//     question_related_to: "Social Media",
//     question_text: "What features would you like to see in a new social media app?",
//     range_min: null,
//     range_max: null,
//     range_step: null,
//     default_range_value: null,
//     choice: null,
//     choices: [
//       { id: 1, choice_text: "Dark mode" },
//       { id: 2, choice_text: "End-to-end encryption" },
//       { id: 3, choice_text: "Content moderation" },
//       { id: 4, choice_text: "Customizable feed" },
//       { id: 5, choice_text: "Voice messaging" }
//     ],
//     include_all_above: 1,
//     items: null,
//     rating_icon_id: null
//   },
//   rankingorder: {
//     id: 106,
//     title: "Rank these programming concepts by importance",
//     question_type: "rankingorder",
//     question_related_to: "Programming",
//     question_text: "Rank these programming concepts by importance",
//     range_min: null,
//     range_max: null,
//     range_step: null,
//     default_range_value: null,
//     choice: null,
//     choices: null,
//     include_all_above: null,
//     items: [
//       { id: 1, item_text: "Data structures" },
//       { id: 2, item_text: "Algorithms" },
//       { id: 3, item_text: "Design patterns" },
//       { id: 4, item_text: "Database design" },
//       { id: 5, item_text: "System architecture" }
//     ],
//     rating_icon_id: null
//   },
//   rating: {
//     id: 107,
//     title: "Rate your experience with online learning platforms",
//     question_type: "rating",
//     question_related_to: "Education",
//     question_text: "Rate your experience with online learning platforms",
//     range_min: null,
//     range_max: null,
//     range_step: null,
//     default_range_value: null,
//     choice: null,
//     choices: null,
//     include_all_above: null,
//     items: null,
//     rating_icon_id: 1
//   }
// };

// const AnswerQa = () => {
//     const {postId, questionId, questionType} = useParams();
//     const [QaData, setQaData] = useState({});
//     const [openendInput, setOpenendInput] = useState('');
//     const [rangeInput, setRangeInput] = useState(null);
//     const [ratingInput, setRatingInput] = useState(0);
//     const [closedendInput, setClosedendInput] = useState(null);
//     const [singleChoiceInput, setSingleChoiceInput] = useState({id: null, text: null});
//     const [multipleChoice, setMultipleChoice] = useState([]); 
//     const [rankingOrderInput, setRankingOrderInput] = useState([]);   
//     const [rankingOrderValue, setRankingOrderValue] = useState([]);   
    
//     useEffect(() => {
//         const QaStoreRaw = sessionStorage.getItem('QaStore');
  

//         if (!QaStoreRaw) {
//             handleFetchQa();
//              setQaData({});
//             return;
//         }

//         const QaStore = JSON.parse(QaStoreRaw);


//         if (String(QaStore.question_id) === String(questionId)) {
//             setQaData(QaStore);
//         } else {
//             handleFetchQa();
//              setQaData({});
//         }

//     }, [questionId]);

//     const handleFetchQa = async () => {
//         try{
//             const res = await axios.get(
//                 `${import.meta.env.VITE_SERVER_URL}/api/get-question/${questionId}/${questionType}`
//             )
//             const data = res.data.datas;
//             setQaData(data);
//         }
//         catch(err){
//             console.error(err);
//             setQaData(null);
//         }
//     }

//         function renderQuestion(QaData){
//             if (!QaData) return null;
//             switch(questionType){
//                 case "openend":
//                     return(
//                         <textarea
//                             className="answer-textarea"
//                             placeholder="Type your answer here..."
//                             value={openendInput}
//                             onChange={(e)=>
//                             setOpenendInput(e.target.value)
//                             }
//                         />
//                     );
//                 case "range":
//                     return(
//                     <div className="answer-range">
//                         <span className="answer-range-value">
//                             {QaData?.range_min}
//                         </span>

//                         <input
//                             className="answer-slider"
//                             type="range"
//                             min={QaData?.range_min}
//                             max={QaData?.range_max}
//                             step={QaData?.range_step}
//                             value={
//                             rangeInput ??
//                             QaData?.default_range_value ??
//                             QaData?.range_min
//                             }
//                             onChange={(e) =>
//                             setRangeInput(e.target.value)
//                             }
//                         />

//                         <span className="answer-range-value">
//                             {QaData?.range_max}
//                         </span>

//                         <div className="answer-current-value">
//                             {rangeInput ??
//                             QaData?.default_range_value ??
//                             QaData?.range_min}
//                         </div>

//                         </div>
//                     );
//                 case "closedend":
//                     return(
//                         <div className="answer-yesno">
//                             <div
//                             className={`answer-yes ${
//                             closedendInput === "yes"
//                             ? "answer-yes-active"
//                             : ""
//                             }`}
//                             onClick={() =>
//                             setClosedendInput("yes")
//                             }
//                             >
//                             YES
//                             </div>

//                             <div
//                             className={`answer-no ${
//                             closedendInput === "no"
//                             ? "answer-no-active"
//                             : ""
//                             }`}
//                             onClick={() =>
//                             setClosedendInput("no")
//                             }
//                             >
//                             NO
//                             </div>

//                             </div>
//                     );
//                 case "singlechoice":
//                     return (
//                         <div className="answer-choice-list">
//                             {QaData?.choice?.map(c => (
//                                 <label
//                                     key={c.id}
//                                     className={`answer-choice-card ${
//                                     singleChoiceInput?.id === c.id
//                                     ? "answer-choice-active"
//                                     : ""
//                                     }`}
//                                     >

//                                     <input
//                                     hidden
//                                     type="radio"
//                                     checked={singleChoiceInput?.id === c.id}
//                                     onChange={() =>
//                                     setSingleChoiceInput({
//                                     id:c.id,
//                                     text:c.choice_text
//                                     })
//                                     }
//                                     />

//                                     <div className="answer-radio"/>

//                                     <span>{c.choice_text}</span>

//                                 </label>

//                                 ))}

//                         </div>
//                     );
//                     case "multiplechoice":
//                         const allSelected =
//                             QaData?.choices?.length > 0 &&
//                             multipleChoice.length === QaData.choices.length;
//                         return (
//                             <div className="answer-choice-list">
//                                 {QaData?.choices?.map(c => (

//                                     <label
//                                     key={c.id}
//                                     className={`answer-choice-card ${
//                                     multipleChoice.some(
//                                     m => m.id === c.id
//                                     )
//                                     ? "answer-choice-active"
//                                     : ""
//                                     }`}
//                                     >

//                                         <input
//                                         hidden
//                                         type="checkbox"
//                                         checked={multipleChoice.some(
//                                         m => m.id === c.id
//                                         )}
//                                         onChange={() => {

//                                         setMultipleChoice(prev =>
//                                         prev.some(
//                                         m => m.id === c.id
//                                         )
//                                         ? prev.filter(
//                                         m => m.id !== c.id
//                                         )
//                                         : [
//                                         ...prev,
//                                         {
//                                         id:c.id,
//                                         text:c.choice_text
//                                         }
//                                         ]
//                                         )

//                                         }}
//                                         />

//                                         <div className="answer-checkbox"/>

//                                         <span>{c.choice_text}</span>

//                                     </label>

//                                     ))}
//                                      {QaData?.include_all_above === 1 &&
//                                     QaData?.choices?.length > 0 && (

//                                     <label
//                                         className={`answer-choice-card ${
//                                         allSelected
//                                             ? "answer-choice-active"
//                                             : ""
//                                         }`}
//                                     >

//                                         <input
//                                         hidden
//                                         type="checkbox"
//                                         checked={allSelected}
//                                         onChange={(e) => {

//                                             if (e.target.checked) {

//                                             setMultipleChoice(
//                                                 QaData.choices.map(c => ({
//                                                 id: c.id,
//                                                 text: c.choice_text
//                                                 }))
//                                             );

//                                             } else {

//                                             setMultipleChoice([]);

//                                             }

//                                         }}
//                                         />

//                                         <div className="answer-checkbox" />

//                                         <span>All of the Above</span>

//                                     </label>

//                                     )}

//                                 </div>
//                     );

//                     case "rankingorder":
//                         return (
//                              <DragDropContext
//                                 onDragEnd={(result) => {

//                                     if (!result.destination) return;

//                                     const reordered = Array.from(
//                                     QaData?.items || []
//                                     );

//                                     const [moved] = reordered.splice(
//                                     result.source.index,
//                                     1
//                                     );

//                                     reordered.splice(
//                                     result.destination.index,
//                                     0,
//                                     moved
//                                     );

//                                     setRankingOrderInput(
//                                     reordered.map(item => item.id)
//                                     );

//                                     setRankingOrderValue(
//                                     reordered.map(
//                                         item => item.item_text
//                                     )
//                                     );

//                                     setQaData({
//                                     ...QaData,
//                                     items: reordered
//                                     });

//                                 }}
//                                 >

//                                 <Droppable droppableId="ranking-list">

//                                     {(provided) => (

//                                     <div
//                                         className="answer-ranking"
//                                         {...provided.droppableProps}
//                                         ref={provided.innerRef}
//                                     >

//                                         {QaData?.items?.map(
//                                         (item, index) => (

//                                             <Draggable
//                                             key={item.id}
//                                             draggableId={String(item.id)}
//                                             index={index}
//                                             >

//                                             {(provided, snapshot) => (

//                                                 <div
//                                                 ref={provided.innerRef}
//                                                 {...provided.draggableProps}
//                                                 {...provided.dragHandleProps}
//                                                 className={`answer-ranking-row ${
//                                                     snapshot.isDragging
//                                                     ? "dragging"
//                                                     : ""
//                                                 }`}
//                                                 >
                                                
//                                                 <div className="answer-ranking-drag">
//                                                     <FontAwesomeIcon icon={faUpDown} />
//                                                 </div>

//                                                 <div className="answer-ranking-number">
//                                                     {index + 1}
//                                                 </div>

//                                                 <div className="answer-ranking-text">
//                                                     {item.item_text}
//                                                 </div>

//                                                 </div>

//                                             )}

//                                             </Draggable>

//                                         )
//                                         )}

//                                         {provided.placeholder}

//                                     </div>

//                                     )}

//                                 </Droppable>

//                                 </DragDropContext>
//                         );
                              
//                     case "rating":
//                         return (
//                             <div className="answer-rating">

//                                 {Array.from({ length: 5 }).map((_, i) => (

//                                 <div
//                                 key={i}
//                                 className={`answer-rating-icon ${
//                                 ratingInput >= i + 1
//                                 ? "answer-rating-active"
//                                 : ""
//                                 }`}
//                                 onClick={() =>
//                                 setRatingInput(i + 1)
//                                 }
//                                 >

//                                 <FontAwesomeIcon
//                                 icon={
//                                 iconOptions.find(
//                                 opt =>
//                                 opt.id === QaData?.rating_icon_id
//                                 )?.icon
//                                 }
//                                 />

//                                 </div>

//                                 ))}

//                                 </div>
//                         );

//             }
//         }
    
//     const handleSubmit = async (e) => {
//         const token = localStorage.getItem("token");
//         e.preventDefault();
//         let payload = {};

//         switch(questionType) {
//            case "openend": payload.answerText = openendInput; break;
//             case "closedend": payload.answerYesNo = closedendInput; break;
//             case "rating": payload.ratingValue = ratingInput; break;
//             case "range": payload.rangeValue = rangeInput; break;
//             case "singlechoice": 
//                 payload.optionId = singleChoiceInput.id; 
//                 payload.optionText = singleChoiceInput.text; 
//                 break;
//             case "multiplechoice": 
//                 payload.optionIds = multipleChoice.map(c => c.id);
//                 payload.optionTexts = multipleChoice.map(c => c.text);
//                 break;
//             case "rankingorder":
//                 payload.rankingIds = rankingOrderInput;  
//                 payload.rankingTexts = rankingOrderValue; 
//                 break;

//         }

//         try {
//             await axios.post(
//                 `${import.meta.env.VITE_SERVER_URL}/api/answer-qa/${postId}/${questionId}/${questionType}`,
//                 payload,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             } catch (err) {
//             console.error("POST ERROR:", err.response || err.message);
//             }
//         };

// function iconRender(questionType){
//     switch(questionType){

//     case "openend":
//       return <SignatureOutlined />;

//     case "closedend":
//       return <FontAwesomeIcon icon={faThumbsUp}/>;

//     case "singlechoice":
//       return <FontAwesomeIcon icon={faHandPointer} />;

//     case "multiplechoice":
//       return <FontAwesomeIcon icon={faHandPeace} />;

//     case "range":
//       return <FontAwesomeIcon icon={faLocationCrosshairs} />;

//     case "rating":
//       return  <FontAwesomeIcon icon={faStar} />;

//     case "rankingorder":
//       return <FontAwesomeIcon icon={faRankingStar} />;

//     default:
//       return null;
//   }
// }
//  function tutorialRender(questionType){
//     switch(questionType){

//     case "openend":
//       return <span>Write Your Answer</span>;

//     case "closedend":
//       return <span>Choose yes or no</span>;

//     case "singlechoice":
//       return <span>Choose one option</span>;

//     case "multiplechoice":
//       return <span>Choose multiple options</span>;

//     case "range":
//       return <span>Move the dot to adjust value </span>;

//     case "rating":
//       return  <span>Tap an icon to rate</span>;

//     case "rankingorder":
//       return <span>Hold or Grab then move to reorder</span>;

//     default:
//       return null;
//   }
// }


//     return (
//         <div className="answer-page">
//             <div className="answer-card">
//                 <h3 id='h3-label'><FontAwesomeIcon icon={faCircleQuestion} /> Answer Qustion</h3>
//                 <p id='tutorial-label'>Tutorial: {tutorialRender(questionType)}</p>
//                 <div className="answer-header">
//                     <div id='header-top'>
//                         <div className="answer-type">{iconRender(questionType)} {questionType}</div>
//                         <div className='dots'></div>
//                          <div className="answer-related">{QaData?.question_related_to}</div>
//                     </div>
                    
//                     <h1 className="answer-title"> " {QaData?.title} "</h1>
                   
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="answer-body">{renderQuestion(QaData)}</div>
//                     <button type="submit" className="answer-submit">Submit Answer</button>
//                  </form>
//             </div>
//         </div>
//         );
// };



// export default AnswerQa;
import React, { useEffect, useState, memo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsDown, faThumbsUp, faHandPointer, faHandPeace, faHand,
  faLocationCrosshairs, faStar, faUpDown, faRankingStar,
  faArrowDown, faArrowUp, faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import { iconOptions } from "../data/post_type_data";
import { SignatureOutlined, FolderOpenOutlined, LeftOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import "../style/page/AnswerQa.css";

import { AnonymousName, AnonymousProfile } from "../util/anonymousTokens";
import api from "../api/axiosInstance";

const AnonymousPf = memo(AnonymousProfile);
const AnonymousNm = memo(AnonymousName);

const AnswerQa = () => {
  const { user } = useOutletContext();
  const { postId, questionId, questionType } = useParams();
  const navigate = useNavigate();

  const [QaData, setQaData] = useState({});
  const [openendInput, setOpenendInput] = useState("");
  const [rangeInput, setRangeInput] = useState(null);
  const [ratingInput, setRatingInput] = useState(0);
  const [closedendInput, setClosedendInput] = useState(null);
  const [singleChoiceInput, setSingleChoiceInput] = useState({ id: null, text: null });
  const [multipleChoice, setMultipleChoice] = useState([]);
  const [rankingOrderInput, setRankingOrderInput] = useState([]);
  const [rankingOrderValue, setRankingOrderValue] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [lockedAnon, setLockedAnon] = useState(false);
  const [anonLoading, setAnonLoading] = useState(true);
  const [showAnnoy, setShowAnnoy] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  // ─────────────────────────────────────────────────────────
  // LOAD QUESTION + BLOCK IF ALREADY ANSWERED
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setPageLoading(true);

      try {
        const alreadyRes = await api.get(`/api/answers/check-answered/${questionId}`);
        if (cancelled) return;

        if (alreadyRes.data.alreadyAnswered) {
          toast.warning("You've already answered this question.");
          navigate(-1);
          return;
        }

        const QaStoreRaw = sessionStorage.getItem("QaStore");
        const cached = QaStoreRaw ? JSON.parse(QaStoreRaw) : null;

        if (cached && String(cached.question_id) === String(questionId)) {
          setQaData(cached);
        } else {
          await handleFetchQa();
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          toast.error("Couldn't load this question.");
          navigate(-1);
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [questionId, questionType, navigate]);

  const handleFetchQa = async () => {
    try {
      const res = await api.get(`/api/answers/get-question/${questionId}/${questionType}`);
      const data = res.data.datas;
      setQaData(data);
    } catch (err) {
      console.error(err);
      setQaData(null);
      throw err;
    }
  };

  function renderQuestion(QaData) {
    if (!QaData) return null;
    switch (questionType) {
      case "openend":
        return (
          <textarea
            className="answer-textarea"
            placeholder="Type your answer here..."
            value={openendInput}
            onChange={(e) => setOpenendInput(e.target.value)}
          />
        );

      case "range":
        return (
          <div className="answer-range">
            <span className="answer-range-value">{QaData?.range_min}</span>

            <input
              className="answer-slider"
              type="range"
              min={QaData?.range_min}
              max={QaData?.range_max}
              step={QaData?.range_step}
              value={rangeInput ?? QaData?.default_range_value ?? QaData?.range_min}
              onChange={(e) => setRangeInput(e.target.value)}
            />

            <span className="answer-range-value">{QaData?.range_max}</span>

            <div className="answer-current-value">
              {rangeInput ?? QaData?.default_range_value ?? QaData?.range_min}
            </div>
          </div>
        );

      case "closedend":
        return (
          <div className="answer-yesno">
            <div
              className={`answer-yes ${closedendInput === "yes" ? "answer-yes-active" : ""}`}
              onClick={() => setClosedendInput("yes")}
            >
              YES
            </div>

            <div
              className={`answer-no ${closedendInput === "no" ? "answer-no-active" : ""}`}
              onClick={() => setClosedendInput("no")}
            >
              NO
            </div>
          </div>
        );

      case "singlechoice":
        return (
          <div className="answer-choice-list">
            {QaData?.choice?.map((c) => (
              <label
                key={c.id}
                className={`answer-choice-card ${singleChoiceInput?.id === c.id ? "answer-choice-active" : ""}`}
              >
                <input
                  hidden
                  type="radio"
                  checked={singleChoiceInput?.id === c.id}
                  onChange={() => setSingleChoiceInput({ id: c.id, text: c.choice_text })}
                />
                <div className="answer-radio" />
                <span>{c.choice_text}</span>
              </label>
            ))}
          </div>
        );

      case "multiplechoice": {
        const allSelected =
          QaData?.choices?.length > 0 && multipleChoice.length === QaData.choices.length;
        return (
          <div className="answer-choice-list">
            {QaData?.choices?.map((c) => (
              <label
                key={c.id}
                className={`answer-choice-card ${multipleChoice.some((m) => m.id === c.id) ? "answer-choice-active" : ""}`}
              >
                <input
                  hidden
                  type="checkbox"
                  checked={multipleChoice.some((m) => m.id === c.id)}
                  onChange={() => {
                    setMultipleChoice((prev) =>
                      prev.some((m) => m.id === c.id)
                        ? prev.filter((m) => m.id !== c.id)
                        : [...prev, { id: c.id, text: c.choice_text }]
                    );
                  }}
                />
                <div className="answer-checkbox" />
                <span>{c.choice_text}</span>
              </label>
            ))}

            {QaData?.include_all_above === 1 && QaData?.choices?.length > 0 && (
              <label className={`answer-choice-card ${allSelected ? "answer-choice-active" : ""}`}>
                <input
                  hidden
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMultipleChoice(
                        QaData.choices.map((c) => ({ id: c.id, text: c.choice_text }))
                      );
                    } else {
                      setMultipleChoice([]);
                    }
                  }}
                />
                <div className="answer-checkbox" />
                <span>All of the Above</span>
              </label>
            )}
          </div>
        );
      }

      case "rankingorder":
        return (
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;

              const reordered = Array.from(QaData?.items || []);
              const [moved] = reordered.splice(result.source.index, 1);
              reordered.splice(result.destination.index, 0, moved);

              setRankingOrderInput(reordered.map((item) => item.id));
              setRankingOrderValue(reordered.map((item) => item.item_text));

              setQaData({ ...QaData, items: reordered });
            }}
          >
            <Droppable droppableId="ranking-list">
              {(provided) => (
                <div className="answer-ranking" {...provided.droppableProps} ref={provided.innerRef}>
                  {QaData?.items?.map((item, index) => (
                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`answer-ranking-row ${snapshot.isDragging ? "dragging" : ""}`}
                        >
                          <div className="answer-ranking-drag">
                            {index === 0 ? (
                              <FontAwesomeIcon icon={faArrowDown} />
                            ) : index === QaData?.items?.length - 1 ? (
                              <FontAwesomeIcon icon={faArrowUp} />
                            ) : (
                              <FontAwesomeIcon icon={faUpDown} />
                            )}
                          </div>

                          <div className="answer-ranking-number">{index + 1}.</div>
                          <div className="answer-ranking-text">{item.item_text}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        );

      case "rating":
        return (
          <div className="answer-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`answer-rating-icon ${ratingInput >= i + 1 ? "answer-rating-active" : ""}`}
                onClick={() => setRatingInput(i + 1)}
              >
                <FontAwesomeIcon
                  icon={iconOptions.find((opt) => opt.id === QaData?.rating_icon_id)?.icon}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  function tutorialRender(questionType) {
    switch (questionType) {
      case "openend":
        return <span>Write Your Answer</span>;
      case "closedend":
        return <span>Choose yes or no</span>;
      case "singlechoice":
        return <span>Choose one option</span>;
      case "multiplechoice":
        return <span>Choose multiple options</span>;
      case "range":
        return <span>Move the dot to adjust value </span>;
      case "rating":
        return <span>Tap an icon to rate</span>;
      case "rankingorder":
        return <span>Hold or Grab then move to reorder</span>;
      default:
        return null;
    }
  }

  const validateBeforeSubmit = () => {
    switch (questionType) {
      case "openend":
        if (!openendInput.trim()) return "Please write an answer.";
        break;
      case "closedend":
        if (!closedendInput) return "Please choose yes or no.";
        break;
      case "singlechoice":
        if (!singleChoiceInput?.id) return "Please choose an option.";
        break;
      case "multiplechoice":
        if (multipleChoice.length === 0) return "Please choose at least one option.";
        break;
      case "rankingorder":
        if (rankingOrderInput.length === 0) return "Please reorder the items before submitting.";
        break;
      case "rating":
        if (!ratingInput) return "Please give a rating.";
        break;
      default:
        break;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validateBeforeSubmit();
    if (validationError) {
      toast.warning(validationError);
      return;
    }

    let payload = { is_anonymous: enabled ? 1 : 0 };

    switch (questionType) {
      case "openend":
        payload.answerText = openendInput;
        break;
      case "closedend":
        payload.answerYesNo = closedendInput;
        break;
      case "rating":
        payload.ratingValue = ratingInput;
        break;
      case "range":
        payload.rangeValue = rangeInput;
        break;
      case "singlechoice":
        payload.optionId = singleChoiceInput.id;
        payload.optionText = singleChoiceInput.text;
        break;
      case "multiplechoice":
        payload.optionIds = multipleChoice.map((c) => c.id);
        payload.optionTexts = multipleChoice.map((c) => c.text);
        break;
      case "rankingorder":
        payload.rankingIds = rankingOrderInput;
        payload.rankingTexts = rankingOrderValue;
        break;
    }

    setSubmitting(true);

    try {
      await api.post(`/api/answers/answer-qa/${postId}/${questionId}/${questionType}`, payload);

      // this question is now answered — don't let a stale cache serve it again
      const QaStoreRaw = sessionStorage.getItem("QaStore");
      if (QaStoreRaw) {
        const cached = JSON.parse(QaStoreRaw);
        if (String(cached.question_id) === String(questionId)) {
          sessionStorage.removeItem("QaStore");
        }
      }

      toast.success("Answer submitted!");
      navigate(-1);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warning("You can't answer this question twice.");
        navigate(-1);
        return;
      }
      console.error("POST ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error submitting answer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="answer-page">
        <div className="answer-card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="answer-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="answer-card">
        <div className="comments-header">
          <h3 id="h3-label">
            <FontAwesomeIcon icon={faCircleQuestion} /> Answer Qustion
          </h3>
          <button
            type="button"
            className="back-btn-about-post"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="comments-header" style={{ alignItems: "center" }}>
          <div className="answer-author-div">
            <div className="comms-avatar-div">
              <AnonymousPf
                enabled={enabled}
                realPf={user?.avatar_url || "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"}
              />
            </div>
            <AnonymousNm enabled={enabled} realName={user?.username || "guest"} />
          </div>

          <div className="anonymous-toggle-div">
            <FontAwesomeIcon icon={faUserSecret} className="annoy-icon" />
            <div
              className={`toggle-container ${enabled ? "active" : ""}`}
              role="switch"
              aria-checked={enabled}
              tabIndex={0}
              onClick={() => setEnabled(!enabled)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEnabled(!enabled);
                }
              }}
            >
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="answer-title"> " {QaData?.title} "</h1>

        <form onSubmit={handleSubmit}>
          <div className="answer-body">{renderQuestion(QaData)}</div>
          <br />
          <p id="tutorial-label">Tutorial: {tutorialRender(questionType)}</p>
          <button type="submit" className="answer-submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnswerQa;