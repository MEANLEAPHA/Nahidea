import React, {useEffect, useState, useRef} from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconOptions } from "../data/post_type_data";



const AnswerQa = () => {

    const {postId, questionId, questionType} = useParams();

    const [QaData, setQaData] = useState(null);

    const [openendInput, setOpenendInput] = useState('');
    const [rangeInput, setRangeInput] = useState(null);
    const [ratingInput, setRatingInput] = useState(null);
    const [closedendInput, setClosedendInput] = useState(null);
    const [singleChoiceInput, setSingleChoiceInput] = useState(null);
    const [multipleChoiceInput, setMultipleChoiceInput] = useState([]);
    const [rankingOrderInput, setRankingOrderInput] = useState([]);
    
    useEffect(() => {
        // const QaStore = JSON.parse(localStorage.getItem('QaStore') || '{}');
        // if(String(QaStore.id) === String(questionId)){
        //     setQaData(QaStore);
        // }
        // else{
        //     handleFetchQa();
        // }
      handleFetchQa();
    }, [questionId, questionType]);


    const handleFetchQa = async () => {
        try{
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/get-question/${questionId}/${questionType}`
            )
            const data = res.data.data;
            setQaData(data);
        }
        catch(err){
            console.error(err);
            setQaData(null);
        }
    }

        function renderQuestion(QaData){
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
                        {QaData.choice.map(choice => (
                            <div key={choice.singlechoice_id}>
                            <input
                                type="radio"
                                id={`single-${choice.singlechoice_id}`}
                                name="singlechoice"
                                value={choice.singlechoice_id}
                                checked={singleChoiceInput === choice.singlechoice_id}
                                onChange={(e) => setSingleChoiceInput(Number(e.target.value))}
                            />
                            <label htmlFor={`single-${choice.singlechoice_id}`}>{choice.choice_text}</label>
                            </div>
                        ))}
                        </div>
                    );


                case "multiplechoice":
                    return (
                        <div>
                        {QaData.choices.map(choice => (
                            <div key={choice.id}>
                            <input
                                type="checkbox"
                                id={`multi-${choice.multiplechoice_id}`}
                                name="multiplechoice"
                                value={choice.multiplechoice_id}
                                checked={multipleChoiceInput.includes(choice.multiplechoice_id)}
                                onChange={(e) => {
                                const id = Number(e.target.value);
                                setMultipleChoiceInput(prev =>
                                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                                );
                                }}
                            />
                            <label htmlFor={`multi-${choice.id}`}>{choice.choice_text}</label>
                            </div>
                        ))}
                        </div>
                    );

                    
                case "rankingorder":
                    return (
                    <DragDropContext
                            onDragEnd={(result) => {
                                if (!result.destination) return;
                                const reordered = Array.from(QaData.items);
                                const [moved] = reordered.splice(result.source.index, 1);
                                reordered.splice(result.destination.index, 0, moved);

                                // Update state with new positions
                                setRankingOrderInput(
                                reordered.reduce((acc, item, idx) => {
                                    acc[item.id] = idx + 1; // map option_id → position
                                    return acc;
                                }, {})
                                );

                                // Also update QaData.items so UI reflects new order
                                setQaData({ ...QaData, items: reordered });
                            }}
                            >
                            <Droppable droppableId="ranking-list">
                                {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
                                >
                                    {QaData.items.map((item, index) => (
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
                                    ))}
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
                            icon={iconOptions.find(opt => opt.id === QaData.rating_icon_id)?.icon}
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
            case "singlechoice": payload.optionId = singleChoiceInput; break;
            case "multiplechoice": payload.optionIds = multipleChoiceInput; break;
            case "rankingorder": payload.rankingMap = rankingOrderInput; break;
            case "range": payload.rangeValue = rangeInput; break;

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
            <form onSubmit={handleSubmit} id="answer-form">
                {renderQuestion(QaData)}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};



export default AnswerQa;