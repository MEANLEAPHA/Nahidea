import React, {useEffect, useState, useRef} from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleQuestion} from"@fortawesome/free-regular-svg-icons";
import { faThumbsDown, faThumbsUp,  faHandPointer, faHandPeace, faHand, faLocationCrosshairs, faStar, faUpDown, faRankingStar} from "@fortawesome/free-solid-svg-icons";
import { iconOptions } from "../data/post_type_data";
import{SignatureOutlined, FolderOpenOutlined} from '@ant-design/icons';
import '../style/page/AnswerQa.css';

const AnswerQa = () => {
    const {postId, questionId, questionType} = useParams();
    const [QaData, setQaData] = useState({});
    const [openendInput, setOpenendInput] = useState('');
    const [rangeInput, setRangeInput] = useState(null);
    const [ratingInput, setRatingInput] = useState(0);
    const [closedendInput, setClosedendInput] = useState(null);
    const [singleChoiceInput, setSingleChoiceInput] = useState({id: null, text: null});
    const [multipleChoice, setMultipleChoice] = useState([]); 
    const [rankingOrderInput, setRankingOrderInput] = useState([]);   
    const [rankingOrderValue, setRankingOrderValue] = useState([]);   
    
    useEffect(() => {
        const QaStoreRaw = sessionStorage.getItem('QaStore');
  

        if (!QaStoreRaw) {
            handleFetchQa();
             setQaData({});
            return;
        }

        const QaStore = JSON.parse(QaStoreRaw);


        if (String(QaStore.question_id) === String(questionId)) {
            setQaData(QaStore);
        } else {
            handleFetchQa();
             setQaData({});
        }

    }, [questionId]);

    const handleFetchQa = async () => {
        try{
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/get-question/${questionId}/${questionType}`
            )
            const data = res.data.datas;
            setQaData(data);
        }
        catch(err){
            console.error(err);
            setQaData(null);
        }
    }

        function renderQuestion(QaData){
            if (!QaData) return null;
            switch(questionType){
                case "openend":
                    return(
                        // <input type="text" placeholder="Type your answer here" value={openendInput} onChange={(e) => setOpenendInput(e.target.value)}/>
                        <textarea
                            className="answer-textarea"
                            placeholder="Type your answer here..."
                            value={openendInput}
                            onChange={(e)=>
                            setOpenendInput(e.target.value)
                            }
                        />
                    );
                case "range":
                    return(
                    <div className="answer-range">
                        <span className="answer-range-value">
                            {QaData?.range_min}
                        </span>

                        <input
                            className="answer-slider"
                            type="range"
                            min={QaData?.range_min}
                            max={QaData?.range_max}
                            step={QaData?.range_step}
                            value={
                            rangeInput ??
                            QaData?.default_range_value ??
                            QaData?.range_min
                            }
                            onChange={(e) =>
                            setRangeInput(e.target.value)
                            }
                        />

                        <span className="answer-range-value">
                            {QaData?.range_max}
                        </span>

                        <div className="answer-current-value">
                            {rangeInput ??
                            QaData?.default_range_value ??
                            QaData?.range_min}
                        </div>

                        </div>
                    );
                case "closedend":
                    return(
                        <div className="answer-yesno">
                            <div
                            className={`answer-yes ${
                            closedendInput === "yes"
                            ? "answer-yes-active"
                            : ""
                            }`}
                            onClick={() =>
                            setClosedendInput("yes")
                            }
                            >
                            YES
                            </div>

                            <div
                            className={`answer-no ${
                            closedendInput === "no"
                            ? "answer-no-active"
                            : ""
                            }`}
                            onClick={() =>
                            setClosedendInput("no")
                            }
                            >
                            NO
                            </div>

                            </div>
                    );
                case "singlechoice":
                    return (
                        <div className="answer-choice-list">
                            {QaData?.choice?.map(c => (
                                <label
                                    key={c.id}
                                    className={`answer-choice-card ${
                                    singleChoiceInput?.id === c.id
                                    ? "answer-choice-active"
                                    : ""
                                    }`}
                                    >

                                    <input
                                    hidden
                                    type="radio"
                                    checked={singleChoiceInput?.id === c.id}
                                    onChange={() =>
                                    setSingleChoiceInput({
                                    id:c.id,
                                    text:c.choice_text
                                    })
                                    }
                                    />

                                    <div className="answer-radio"/>

                                    <span>{c.choice_text}</span>

                                </label>

                                ))}

                        </div>
                    );
                    case "multiplechoice":
                        const allSelected =
                            QaData?.choices?.length > 0 &&
                            multipleChoice.length === QaData.choices.length;
                        return (
                            <div className="answer-choice-list">
                                {QaData?.choices?.map(c => (

                                    <label
                                    key={c.id}
                                    className={`answer-choice-card ${
                                    multipleChoice.some(
                                    m => m.id === c.id
                                    )
                                    ? "answer-choice-active"
                                    : ""
                                    }`}
                                    >

                                        <input
                                        hidden
                                        type="checkbox"
                                        checked={multipleChoice.some(
                                        m => m.id === c.id
                                        )}
                                        onChange={() => {

                                        setMultipleChoice(prev =>
                                        prev.some(
                                        m => m.id === c.id
                                        )
                                        ? prev.filter(
                                        m => m.id !== c.id
                                        )
                                        : [
                                        ...prev,
                                        {
                                        id:c.id,
                                        text:c.choice_text
                                        }
                                        ]
                                        )

                                        }}
                                        />

                                        <div className="answer-checkbox"/>

                                        <span>{c.choice_text}</span>

                                    </label>

                                    ))}
                                     {QaData?.include_all_above === 1 &&
                                    QaData?.choices?.length > 0 && (

                                    <label
                                        className={`answer-choice-card ${
                                        allSelected
                                            ? "answer-choice-active"
                                            : ""
                                        }`}
                                    >

                                        <input
                                        hidden
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={(e) => {

                                            if (e.target.checked) {

                                            setMultipleChoice(
                                                QaData.choices.map(c => ({
                                                id: c.id,
                                                text: c.choice_text
                                                }))
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

                    case "rankingorder":
                        return (
                             <DragDropContext
                                onDragEnd={(result) => {

                                    if (!result.destination) return;

                                    const reordered = Array.from(
                                    QaData?.items || []
                                    );

                                    const [moved] = reordered.splice(
                                    result.source.index,
                                    1
                                    );

                                    reordered.splice(
                                    result.destination.index,
                                    0,
                                    moved
                                    );

                                    setRankingOrderInput(
                                    reordered.map(item => item.id)
                                    );

                                    setRankingOrderValue(
                                    reordered.map(
                                        item => item.item_text
                                    )
                                    );

                                    setQaData({
                                    ...QaData,
                                    items: reordered
                                    });

                                }}
                                >

                                <Droppable droppableId="ranking-list">

                                    {(provided) => (

                                    <div
                                        className="answer-ranking"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >

                                        {QaData?.items?.map(
                                        (item, index) => (

                                            <Draggable
                                            key={item.id}
                                            draggableId={String(item.id)}
                                            index={index}
                                            >

                                            {(provided, snapshot) => (

                                                <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`answer-ranking-row ${
                                                    snapshot.isDragging
                                                    ? "dragging"
                                                    : ""
                                                }`}
                                                >
                                                
                                                <div className="answer-ranking-drag">
                                                    <FontAwesomeIcon icon={faUpDown} />
                                                </div>

                                                <div className="answer-ranking-number">
                                                    {index + 1}
                                                </div>

                                                <div className="answer-ranking-text">
                                                    {item.item_text}
                                                </div>

                                                </div>

                                            )}

                                            </Draggable>

                                        )
                                        )}

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
                                className={`answer-rating-icon ${
                                ratingInput >= i + 1
                                ? "answer-rating-active"
                                : ""
                                }`}
                                onClick={() =>
                                setRatingInput(i + 1)
                                }
                                >

                                <FontAwesomeIcon
                                icon={
                                iconOptions.find(
                                opt =>
                                opt.id === QaData?.rating_icon_id
                                )?.icon
                                }
                                />

                                </div>

                                ))}

                                </div>
                        );

            }
        }
    
    const handleSubmit = async (e) => {
        const token = localStorage.getItem("token");
        e.preventDefault();
        let payload = {};

        switch(questionType) {
           case "openend": payload.answerText = openendInput; break;
            case "closedend": payload.answerYesNo = closedendInput; break;
            case "rating": payload.ratingValue = ratingInput; break;
            case "range": payload.rangeValue = rangeInput; break;
            case "singlechoice": 
                payload.optionId = singleChoiceInput.id; 
                payload.optionText = singleChoiceInput.text; 
                break;
            case "multiplechoice": 
                payload.optionIds = multipleChoice.map(c => c.id);
                payload.optionTexts = multipleChoice.map(c => c.text);
                break;
            case "rankingorder":
                payload.rankingIds = rankingOrderInput;  
                payload.rankingTexts = rankingOrderValue; 
                break;

        }

        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/answer-qa/${postId}/${questionId}/${questionType}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            } catch (err) {
            console.error("POST ERROR:", err.response || err.message);
            }
        };

function iconRender(questionType){
    switch(questionType){

    case "openend":
      return <SignatureOutlined />;

    case "closedend":
      return <FontAwesomeIcon icon={faThumbsUp}/>;

    case "singlechoice":
      return <FontAwesomeIcon icon={faHandPointer} />;

    case "multiplechoice":
      return <FontAwesomeIcon icon={faHandPeace} />;

    case "range":
      return <FontAwesomeIcon icon={faLocationCrosshairs} />;

    case "rating":
      return  <FontAwesomeIcon icon={faStar} />;

    case "rankingorder":
      return <FontAwesomeIcon icon={faRankingStar} />;

    default:
      return null;
  }
}
 function tutorialRender(questionType){
    switch(questionType){

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
      return  <span>Tap an icon to rate</span>;

    case "rankingorder":
      return <span>Hold or Grab then move to reorder</span>;

    default:
      return null;
  }
}


    return (
        <div className="answer-page">
            <div className="answer-card">
                <h3 id='h3-label'><FontAwesomeIcon icon={faCircleQuestion} /> Answer Qustion</h3>
                <p id='tutorial-label'>Tutorial: {tutorialRender(questionType)}</p>
                <div className="answer-header">
                    <div id='header-top'>
                        <div className="answer-type">{iconRender(questionType)} {questionType}</div>
                        <div className='dots'></div>
                         <div className="answer-related">{QaData?.question_related_to}</div>
                    </div>
                    
                    <h1 className="answer-title"> " {QaData?.title} "</h1>
                   
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="answer-body">{renderQuestion(QaData)}</div>
                    <button type="submit" className="answer-submit">Submit Answer</button>
                 </form>
            </div>
        </div>
        );
};



export default AnswerQa;