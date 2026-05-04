import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

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
        const QaStore = JSON.parse(localStorage.getItem('QaStore') || '{}');
        if(String(QaStore.id) === String(questionId)){
            setQaData(QaStore);
        }
        else{
            handleFetchQa();
        }
    });


    const handleFetchQa = async () => {
        try{
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/get-qa/${questionId}/${questionType}`
            )
            const data = res.data;
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
                        <span>{min}</span>
                        <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={onChange}
                        />
                        <span>{max}</span>
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
                    return(
                        <div></div>
                    );
                case "multiplechoice":
                    return(
                        <div></div>
                    );
                case "rankingorder":
                    return(
                        <div></div>
                    );
                case "rating":
                    return(
                        <div></div>
                    );
            }
        }
    
    function handleSubmit(){

    }


    return (
        <div>
            <h1>AnswerQa</h1>
            <form onSubmit={handleSubmit} id="answer-form">
                {renderQuestion(QaData)}
            </form>
        </div>
    );
};

// const Openend = () => {
//     return (

//     )
// }

export default AnswerQa;