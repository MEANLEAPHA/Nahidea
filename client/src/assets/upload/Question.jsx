import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TagInput from "../util/tagInput";
import {useAnonymousTokens, AnonymousToggle }from "../util/anonymousTokens";
import { question_options,iconOptions } from "../data/post_type_data";

import "../style/upload/tag.css";

const token = localStorage.getItem("token");
export default function Questiion(){
const [loading, setLoading] = useState(false);
  // question setence
  const [title, setTitle] = useState('');

  // question topic related
  const [selectType, setSelectType] = useState(null);

  // tag state
  const [tags, setTags] = useState([]);

  const [questionFile, setQuestionFile] = useState(null);

  // question type state
  const [questionType, setQuestionType] = useState(null);

    // closed end state
    const [yestitle, setYestitle] = useState('');
    const [noTitle, setNoTitle] = useState('');

    // Range state
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [step, setStep] = useState(1);
    const [rangeValue, setRangeValue] = useState(0);

    // single choice
    const [singleChoices, setSingleChoices] = useState(["", "", ""]);

    // multiple choice
    const [multipleChoices, setMultipleChoices] = useState(["", "", ""]);
    const [includeAllAbove, setIncludeAllAbove] = useState(0);
  
    // ranking order
    const [rankingChoices, setRankingChoices] = useState(["", "", ""]);

    // rating 
    const [ratingIconId, setRatingIconId] = useState(1);

    const [isAnonymous, setIsAnonymous] = useState(false);
    const { tokens, countdown, consume } = useAnonymousTokens();

    
    const resetCloseEnd = () => { setYestitle(""); setNoTitle(""); };
    const resetRange = () => { setMin(null); setMax(null); setStep(1); setRangeValue(null); };
    const resetSingleChoice = () => { setSingleChoices(["", "", ""]); };
    const resetMultipleChoice = () => { setMultipleChoices(["","",""]); setIncludeAllAbove(false); };
    const resetRanking = () => { setRankingChoices(["","",""]); };
    const resetRating = () => { setRatingIconId(1); };

    const resetMap = {
      openend:        [resetCloseEnd, resetRange, resetSingleChoice, resetMultipleChoice, resetRanking, resetRating],
      closedend:      [resetRange, resetSingleChoice, resetMultipleChoice, resetRanking, resetRating],
      range:          [resetCloseEnd, resetSingleChoice, resetMultipleChoice, resetRanking, resetRating],
      singlechoice:   [resetCloseEnd, resetRange, resetMultipleChoice, resetRanking, resetRating],
      multiplechoice: [resetCloseEnd, resetRange, resetSingleChoice, resetRanking, resetRating],
      rankingorder:   [resetCloseEnd, resetRange, resetSingleChoice, resetMultipleChoice, resetRating],
      rating:         [resetCloseEnd, resetRange, resetSingleChoice, resetMultipleChoice, resetRanking],
    };
    const handlePostType = () => {
      (resetMap[questionType] || []).forEach(fn => fn());
    };

    // Dusplay question type
    let displayTypeQuestion;
    switch(questionType){
    case "openend" :
      displayTypeQuestion = <OpenEnd />
      break;
    case "closedend" :
      displayTypeQuestion = <ClosedEnd YestitleValue={yestitle} NoTitleValue={noTitle} setYestitle={setYestitle} setNoTitle={setNoTitle}/>
      break;
    case "range" :
      displayTypeQuestion =  <RangeInput
                                min={min}
                                max={max}
                                step={step}
                                SetStep={setStep}
                                SetMin = {setMin}
                                SetMax = {setMax}
                                value={rangeValue}
                                onChange={(e) => setRangeValue(e.target.value)}
                              />
      break;
    case "singlechoice" :
      displayTypeQuestion = <SingleChoice value={singleChoices} onChange={setSingleChoices}/>
      break;
    case "multiplechoice" :
      displayTypeQuestion = <MultipleChoice 
                              value={multipleChoices}
                              onChange={setMultipleChoices} 
                              includeAllAbove={includeAllAbove} 
                              setIncludeAllAbove={setIncludeAllAbove}
                            />
      break;
    case "rankingorder" :
      displayTypeQuestion = <RankingOrder value={rankingChoices} onChange={setRankingChoices} />
      break;
    case "rating" :
      displayTypeQuestion = <Rating value={ratingIconId} onChange={setRatingIconId}/>
      break;
    default: 
      displayTypeQuestion = <OpenEnd />
      break;
  }

  const Card = ({value, img}) => {
    return(
      <label>
        <input 
          type="radio" 
          name="question-type" 
          value={value} 
          onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
          checked={questionType === value} 
          className="radio" 
        />
        <img 
          src={img}
          alt={value} 
          className={questionType === value ? "selected" : ""} 
        />
      </label>
    )
  }
 
  const questionRadioType = [
    {id:1, value:"openend", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS90nUCMSa8ongTJCpTWgR_cy5mMtuXev1NCg&s"},
    {id:2, value:"closedend", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5OOdmroWDpWEbbytAew7LAkKvzUYhmZZx8Q&s"},
    {id:3, value:"singlechoice", img:"https://img.freepik.com/free-vector/electric-car-white-background_1308-21368.jpg?semt=ais_user_personalization&w=740&q=80"},
    {id:4, value:"multiplechoice", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThYff67knNe_Yfxy_91qsv35FgUhFWgvsAkA&s"},
    {id:5, value:"range", img:"https://img.freepik.com/premium-vector/blue-car-flat-style-illustration-isolated-white-background_108231-795.jpg?semt=ais_incoming&w=740&q=80"},
    {id:6, value:"rating", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKVybqeCw4hx6GtIiLMrnEKczyHi9PxmIIw&s"},
    {id:7, value:"rankingorder", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh7yenXHLnm2mRNd4ENksCtku0XUiaezTkSg&s"},
  ];

  const AppendRadioCard = () => {
    return(
      <>
      {
        questionRadioType.map(item => ( 
          <Card key={item.id} {...item}/>
        ))
      }
      </>
    )
  }
    
  

const handleSubmit = async (e) => {
  e.preventDefault();

  if(loading) return;
  setLoading(true);
  const formData = new FormData();
  tags.forEach((t) => formData.append("tags[]", t));
  formData.append("post_type", "question");
  formData.append("question_related_to", selectType?.value ?? "general");
  formData.append("isAnonymous", isAnonymous);
  if(questionFile){
     formData.append("questionFile", questionFile);
  }
  formData.append("question_title", title);

  switch(questionType){
    case "openend":
      formData.append("question_type", "openend");
      break;
    case "closedend":
      formData.append("question_type", "closedend");
      formData.append("yesTitle", yestitle);
      formData.append("noTitle", noTitle);
      break;
    case "range": 
      formData.append("question_type", "range");
      formData.append("rangeMin", min);
      formData.append("rangeMax", max);
      formData.append("rangeStep", step);
      formData.append("defaultRangeValue", rangeValue);
      break;
    case "singlechoice":
      formData.append("question_type", "singlechoice");
      singleChoices.forEach((c) => formData.append("choices[]", c));
      break;
    case "multiplechoice": 
      formData.append("question_type", "multiplechoice");
      multipleChoices.forEach((c) => formData.append("choices[]", c));
      formData.append("include_all_above", includeAllAbove);
      break;
    case "rankingorder":
      formData.append("question_type", "rankingorder");
      rankingChoices.forEach((c, i) => formData.append(`ranking[${i+1}]`, c));
      break;
    case "rating":
      formData.append("question_type", "rating");
      formData.append("rating_icon_id", ratingIconId);
      break;
    default:
      formData.append("question_type", "openend");
      break;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/create-posts`,
      formData,
      {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
    );
    console.log("Upload success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Upload failed:", err.response.data);
    } else {
      console.error("Upload failed:", err.message);
    }
  }

if (isAnonymous) consume();

 (resetMap[questionType] || []).forEach(fn => fn());

  setLoading(false);

};


    return (
    <form onSubmit={handleSubmit}>

      <label htmlFor="title">Caption</label>
      <input type="text" 
              name='title'
              className='input-title'
              onChange={(e)=> setTitle(e.target.value)} 
              value={title}
              placeholder="Type your text content here..."
      />
    <input type="file" accept="image/*" onChange={(e) => setQuestionFile(e.target.files[0])} />
      <label htmlFor="type">Question related to:</label>
       <Select
        options={question_options} 
        value={selectType}
        onChange={setSelectType}
      />
      <br />
   <AppendRadioCard />

  {displayTypeQuestion}
      
  <TagInput value={tags} onChange={setTags} maxTags={5} />

  <AnonymousToggle
          enabled={isAnonymous}
          setEnabled={setIsAnonymous}
          tokens={tokens}
          countdown={countdown}
        />
        <button type="submit">Upload</button>
      </form>
    );
}


const OpenEnd = () => {
  return(
     null
  )
};
const ClosedEnd = ({
  YestitleValue,
  NoTitleValue,
  setYestitle,
  setNoTitle,
}) => {
  return (
    <div>
      <label>Yes answer</label>
      <div>

        <input
          type="text"
          value={YestitleValue}
          onChange={(e) => setYestitle(e.target.value)}
        />
      </div>

      <label>No answer</label>
      <div>
       
        <input
          type="text"
          value={NoTitleValue}
          onChange={(e) => setNoTitle(e.target.value)}
        />
      </div>

    </div>
  );
};
const RangeInput = ({ min, max, step, value, onChange, SetMax, SetMin, SetStep}) => {
  return (
    <div>
      <input
        type="number"
        min="0"
        value={min}
        onChange={(e) => SetMin(Number(e.target.value))}
      />
      <input
        type="number"
        min="1"
        value={max}
        onChange={(e) => SetMax(Number(e.target.value))}
      />
      <input
        type="number"
        min="0.1"
        max="10"
        placeholder='0' 
        value={step}
        onChange={(e) => SetStep(Number(e.target.value))}
      />

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

      <span>Current value: {value}</span>
    </div>
  );
};
const SingleChoice = ({ value, onChange}) => {
  const maxChoices = 10;

  // update a choice value
  const handleChange = (index, newValue) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  // add a new choice (up to maxChoices)
  const addChoice = () => {
    if (value.length < maxChoices) {
      onChange([...value, ""]);
    }
  };

  // delete a choice (only if > 3 remain)
  const deleteChoice = (index) => {
    if (value.length > 3) {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  // remove all but leave first 3
  const removeAll = () => {
    if (value.length > 3) {
      onChange(value.slice(0, 3));
    }
  };

  return (
    <div>
      <div className="single-choice-parent">
        {value.map((choice, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "6px" }}>
            <input
              type="text"
              className="single-choice-input"
              value={choice}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            {value.length > 3 && (
              <button
                type='button'
                className="btn-delete-single-choice"
                onClick={() => deleteChoice(index)}
              >
                delete
              </button>
            )}
          </div>
        ))}
      </div>
      <hr />
      <div>
        <button onClick={addChoice} disabled={value.length >= maxChoices} type='button'>
          Add more choice
        </button>
        {value.length > 3 && (
          <button onClick={removeAll} type='button'>Remove all</button>
        )}
      </div>
    </div>
  );
};
const MultipleChoice = ({ value, onChange, includeAllAbove, setIncludeAllAbove}) => {
  const maxChoices = 10;

  // update a choice value
  const handleChange = (index, newValue) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  // add a new choice (up to maxChoices)
  const addChoice = () => {
    if (value.length < maxChoices) {
      onChange([...value, ""]);
    }
  };

  // delete a choice (only if > 3 remain)
  const deleteChoice = (index) => {
    if (value.length > 3) {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  // remove all but leave first 3
  const removeAll = () => {
    if (value.length > 3) {
      onChange(value.slice(0, 3));
    }
  };

  return (
    <div>
      <div className="multiple-choice-parent">
        {value.map((choice, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "6px" }}>
            <input
              type="text"
              className="multiple-choice-input"
              value={choice}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            {value.length > 3 && (
              <button
                className="btn-delete-multiple-choice"
                onClick={() => deleteChoice(index)}
                type='button'
              >
                delete
              </button>
            )}
          </div>
        ))}

        {/* Special "All Above" option */}
        {includeAllAbove === 1 && (
          <div style={{ display: "flex", marginBottom: "6px" }}>
            <input
              type="text"
              className="multiple-choice-input"
              value="All Above"
              readOnly
              disabled
            />
          </div>
        )}
      </div>

      <hr />
      <div>
        <button onClick={addChoice} disabled={value.length >= maxChoices} type='button'>
          Add more choice
        </button>
        {value.length > 3 && (
          <button onClick={removeAll} type='button'>Remove all</button>
        )}
        {!includeAllAbove && (
          <button onClick={() => setIncludeAllAbove(1)} type='button'>
            Add "All Above"
          </button>
        )}
        {includeAllAbove && (
          <button onClick={() => setIncludeAllAbove(0)} type='button'>
            Remove "All Above"
          </button>
        )}
      </div>
    </div>
  );
};
const RankingOrder = ({ value, onChange }) => {
  const [items, setItems] = useState(value.length ? value : ["", "", ""]);
  const maxItems = 10;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
    onChange(reordered);
  };

  const handleChange = (index, newValue) => {
    const updated = [...items];
    updated[index] = newValue;
    setItems(updated);
    onChange(updated);
  };

  const addItem = () => {
    if (items.length < maxItems) {
      const updated = [...items, ""];
      setItems(updated);
      onChange(updated);
    }
  };

  const deleteItem = (index) => {
    if (items.length > 3) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      onChange(updated);
    }
  };

  const removeAll = () => {
    if (items.length > 3) {
      const updated = items.slice(0, 3);
      setItems(updated);
      onChange(updated);
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ranking-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ width: "300px", margin: "0 auto" }}
            >
              {items.map((item, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        marginBottom: "6px",
                        background: snapshot.isDragging ? "#e0f7fa" : "#fafafa",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span style={{ marginRight: "8px" }}>{index + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleChange(index, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      {items.length > 3 && (
                        <button
                          className="btn-delete-ranking"
                          onClick={() => deleteItem(index)}
                          style={{ marginLeft: "8px" }}
                          type='button'
                        >
                          delete
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <hr />
      <div>
        <button onClick={addItem} disabled={items.length >= maxItems} type='button'>
          Add more choice
        </button>
        {items.length > 3 && (
          <button onClick={removeAll} type='button'>Remove all</button>
        )}
      </div>
    </div>
  );
};
const Rating = ({ value, onChange}) => {
  return (
    <div>
      <p>{Array.from({length:5}).map((_,i)=>(
        <FontAwesomeIcon 
          key={i}
          icon={iconOptions.find((opt) => opt.id === value)?.icon}
          style={{ fontSize: "24px", color: "#ff3434" }}
        />
      ))}</p>
    
      <button
        type="button"
        onClick={() => {
          const selector = document.getElementById("icon-selector");
          selector.style.display =
            selector.style.display === "none" ? "block" : "none";
        }}
      >
        Change icon type
      </button>

      <div id="icon-selector" style={{ display: "none", marginTop: "10px" }}>
        {iconOptions.map((opt) => (
          <label key={opt.id} style={{ marginRight: "15px", cursor: "pointer" }}>
            <input
              type="radio"
              name="iconType"
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              style={{ display: "none" }}
            />
            <FontAwesomeIcon
              icon={opt.icon}
              style={{
                fontSize: "28px",
                color: value === opt.id ? "#ff9800" : "#555",
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

