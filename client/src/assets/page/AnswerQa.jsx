import React, {useEffect, useState, useRef} from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconOptions } from "../data/post_type_data";



const AnswerQa = () => {

    const {postId, questionId, questionType} = useParams();

    const [QaData, setQaData] = useState({});

    const [openendInput, setOpenendInput] = useState('');
    const [rangeInput, setRangeInput] = useState(null);
    const [ratingInput, setRatingInput] = useState(null);
    const [closedendInput, setClosedendInput] = useState(null);

    const [singleChoiceInput, setSingleChoiceInput] = useState({id: null, text: null});

    const [multipleChoice, setMultipleChoice] = useState([]); 


    const [rankingOrderInput, setRankingOrderInput] = useState([]);   
    const [rankingOrderValue, setRankingOrderValue] = useState([]);   
    
    useEffect(() => {
        const QaStore = JSON.parse(localStorage.getItem('QaStore') || '{}');
        if(String(QaStore.id) === String(questionId)){
            setQaData(QaStore);
        }
        else{
            // handleFetchQa();
               setQaData({});
        }
    //   handleFetchQa();
    }, [questionId, questionType]);


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
                        <input type="text" placeholder="Type your answer here" value={openendInput} onChange={(e) => setOpenendInput(e.target.value)}/>
                    );
                case "range":
                    return(
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>{QaData.range_min}</span>
                        <input
                        type="range"
                        min={QaData.range_min}
                        max={QaData.range_max}
                        step={QaData.step}
                        value={rangeInput ?? QaData.default_range_value}
                        onChange={(e) => setRangeInput(e.target.value)}
                        />
                        <span>{QaData.range_max}</span>
                    </div>
                    );
                case "closedend":
                    return(
                        <div>
                            {
                                [
                                    {label:'yes', value:'yes'}, 
                                    {label:'no', value:'no'}
                                ].map((option) => (
                                    <div key={option.value}>
                                    <input
                                        type="radio"
                                        id={option.value}
                                        name="closedend"
                                        value={option.value}
                                        checked={closedendInput === option.value}
                                        onChange={(e) => setClosedendInput(e.target.value)}
                                    />
                                    <label htmlFor={option.value}>{option.label}</label>
                                    </div>
                                ))
                            } 
                        </div>
                    );
                case "singlechoice":
                    return (
                        <div>
                        {QaData?.choice?.length > 0 ? (
                            QaData.choice.map(c => (
                            <div key={c.id}>
                                <input
                                type="radio"
                                id={`single-${c.id}`}
                                name="singlechoice"
                                value={c.id}
                                checked={singleChoiceInput?.id === c.id}
                                onChange={(e) => setSingleChoiceInput({ id: c.id, text: c.choice_text })}
                                />
                                <label htmlFor={`single-${c.id}`}>
                                {c.choice_text}
                                </label>
                            </div>
                            ))
                        ) : (
                            <p>Loading choices...</p>
                        )}
                        </div>
                    );
                    case "multiplechoice":
                        const allSelected =
                            QaData?.choices?.length > 0 &&
                            multipleChoice.length === QaData.choices.length;
                        return (
                            <div>
                            {QaData?.include_all_above === 1 && QaData?.choices?.length > 0 && (
                                <div>
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={allSelected}
                                    onChange={(e) => {
                                    setMultipleChoice(
                                        e.target.checked
                                        ? QaData.choices.map(c => ({ id: c.id, text: c.choice_text }))
                                        : []
                                    );
                                    }}
                                />
                                <label htmlFor="select-all">Select All</label>
                                </div>
                            )}

                            {QaData?.choices?.length > 0 ? (
                                QaData.choices.map(c => (
                                <div key={c.id}>
                                    <input
                                    type="checkbox"
                                    id={`multi-${c.id}`}
                                    value={c.id}
                                    checked={multipleChoice.some(sel => sel.id === c.id)}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        setMultipleChoice(prev =>
                                        prev.some(sel => sel.id === id)
                                            ? prev.filter(sel => sel.id !== id)
                                            : [...prev, { id: c.id, text: c.choice_text }]
                                        );
                                    }}
                                    />
                                    <label htmlFor={`multi-${c.id}`}>{c.choice_text}</label>
                                </div>
                                ))
                            ) : (
                                <p>Loading choices...</p>
                            )}
                            </div>
                    );

                    case "rankingorder":
                        return (
                            <DragDropContext
                            onDragEnd={(result) => {
                                if (!result.destination) return;

                                const reordered = Array.from(QaData?.items || []);
                                const [moved] = reordered.splice(result.source.index, 1);
                                reordered.splice(result.destination.index, 0, moved);

                                // IDs in order → analytics
                                setRankingOrderInput(reordered.map(item => item.id));

                                // Texts in order → display
                                setRankingOrderValue(reordered.map(item => item.item_text));

                                // Update UI
                                setQaData({ ...QaData, items: reordered });
                            }}
                            >
                            <Droppable droppableId="ranking-list">
                                {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {QaData?.items?.length > 0 ? (
                                    QaData.items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "10px",
                                                marginBottom: "8px",
                                                background: snapshot.isDragging ? "#e0f7fa" : "#fafafa",
                                                border: "1px solid #ccc",
                                                borderRadius: "6px",
                                                ...provided.draggableProps.style,
                                            }}
                                            >
                                            <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                                                {index + 1}.
                                            </span>
                                            <span style={{ flex: 1 }}>{item.item_text}</span>
                                            </div>
                                        )}
                                        </Draggable>
                                    ))
                                    ) : (
                                    <p>Loading items...</p>
                                    )}
                                    {provided.placeholder}
                                </div>
                                )}
                            </Droppable>
                            </DragDropContext>
                        );
                              
                    case "rating":
                        return (
                            <div className="rating-stars">
                            {Array.from({length:5}).map((_,i)=>(
                                <FontAwesomeIcon 
                                key={i}
                                icon={iconOptions.find(opt => opt.id === QaData?.rating_icon_id)?.icon}
                                style={{ fontSize: "28px", color: i < ratingInput ? "#ff3434" : "#ccc", cursor:"pointer" }}
                                onClick={() => setRatingInput(i+1)}
                                />
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




    return (
        <div>
            <h1>AnswerQa</h1>
            {!QaData ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit} id="answer-form">
                    <p>{QaData.title}</p>
                    <p>{QaData.question_related_to}</p>
                    {renderQuestion(QaData)}
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};



export default AnswerQa;