import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCopy, faFlag, faHeart, faMessage, faPenToSquare, faTrashCan} from "@fortawesome/free-regular-svg-icons";
import { faCircleDot,faEllipsisVertical, faRetweet} from "@fortawesome/free-solid-svg-icons";

import {TagInput }from "../util/tagInput";
import { useAnonymousTokens, AnonymousTokensCoolDown, AnonymousName, AnonymousProfile} from "../util/anonymousTokens";
import { toast, ToastContainer } from "react-toastify";
import { question_options,iconOptions, question_type } from "../data/post_type_data";
import {MoreFieldsQuestion} from "../util/moreFlieds";

import{TagsPreview} from "../util/tagInput";
import {PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

import { Skeleton, Menu, Switch  } from 'antd';
import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined, SettingOutlined  } from '@ant-design/icons';

import { useOutletContext } from "react-router-dom";

import "../style/upload/tag.css";
import "../style/upload/Content.css";
import "../style/upload/Postpreview.css";

const token = localStorage.getItem("token");

const AnonymousPf = memo(AnonymousProfile);
const AnonymousNm = memo(AnonymousName);

export default function Questiion(){
const [loading, setLoading] = useState(false);
  // question setence
  const [title, setTitle] = useState('');

  // question topic related
  const [selectType, setSelectType] = useState(null);

  // tag state
  const [tags, setTags] = useState([]);

  const [questionFile, setQuestionFile] = useState(null);
  const refFile = useRef(null);

  // question type state
  const [questionType, setQuestionType] = useState('openend');

  // const [questionType, setquestionType] = useState("openend");


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
    const [anonymousName, setAnonymousName] = useState(null);
    const { tokens, countdown, consume } = useAnonymousTokens();

    // preview toggle
     const [openPreview, setOpenPreview] = useState(false);

    const resetMain = () => {setAnonymousName(null),setSelectType(null), setQuestionType(null), setTitle(""), setTags([]), setQuestionFile(null), (refFile.current ? refFile.current.value = "" : null) };
    const resetCloseEnd = () => { setYestitle(""); setNoTitle(""); };
    const resetRange = () => { setMin(0); setMax(100); setStep(1); setRangeValue(0); };
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
      (resetMap[questionType?.value] || []).forEach(fn => fn());
    };

    // Dusplay question type
    function QuestionTypeRenderer() {
  switch (questionType?.value) {
    case "openend":
      return <OpenEnd />;
    case "closedend":
      return (
        <ClosedEnd
          YestitleValue={yestitle}
          NoTitleValue={noTitle}
          setYestitle={setYestitle}
          setNoTitle={setNoTitle}
        />
      );
    case "range":
      return (
        <RangeInput
          min={min}
          max={max}
          step={step}
          SetStep={setStep}
          SetMin={setMin}
          SetMax={setMax}
          value={rangeValue}
          onChange={(e) => setRangeValue(e.target.value)}
        />
      );
    case "singlechoice":
      return <SingleChoice value={singleChoices} onChange={setSingleChoices} />;
    case "multiplechoice":
      return (
        <MultipleChoice
          value={multipleChoices}
          onChange={setMultipleChoices}
          includeAllAbove={includeAllAbove}
          setIncludeAllAbove={setIncludeAllAbove}
        />
      );
    case "rankingorder":
      return <RankingOrder value={rankingChoices} onChange={setRankingChoices} />;
    case "rating":
      return <Rating value={ratingIconId} onChange={setRatingIconId} />;
    default:
      return <OpenEnd />;
  }
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
  if(anonymousName) formData.append("anonymousName", anonymousName);
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
      singleChoices.forEach((c) => formData.append("choices", c));
      break;
    case "multiplechoice": 
      formData.append("question_type", "multiplechoice");
      multipleChoices.forEach((c) => formData.append("choices", c));
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
  
  if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message || "Question posted successfully");
        if (isAnonymous) consume();
        (resetMap[questionType] || []).forEach(fn => fn());
        setLoading(false);
      } else {
        toast.error(res.data.message || "Failed to post question");
        (resetMap[questionType] || []).forEach(fn => fn());
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later");
      (resetMap[questionType] || []).forEach(fn => fn());
      setLoading(false);
    }
    (resetMap[questionType] || []).forEach(fn => fn());
};

    return (
      <div id="content-container">
          <article id='tool-article'>
              <AnonymousTokensCoolDown tokens={tokens} countdown={countdown} />
              <form onSubmit={handleSubmit}>
                <div className="toast-feedback">
                          <ToastContainer position="top-right" autoClose={2000} />
                        </div>
                         <div id='form-header-label'>
                                  <p id="content-label">Create Question</p> 
                                  <button id='preview-toggle' type="button" onClick={() => setOpenPreview(true)} ><LayoutOutlined /> Preview</button>
                          </div>
                <div className='toast-feedback'>
                  <ToastContainer position="top-right" autoClose={2000}/>
                </div>

                 <Select
                     options={question_options} 
                  value={selectType}
                  onChange={setSelectType}
                    classNamePrefix="custom"
                    placeholder="Select Question Related To"
                  />
                    <div className="title-wrapper">
                      <p className="title-label" >Confession Text</p>
                  
                      <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Write your question here..."
                        type="text"
                        required
                        id="title-input"
                        
                        maxLength={300} // enforce limit
                      />
                      <div className="char-counter">
                        {title.length}/300
                      </div>
                    </div>

              {/* <input type="file" accept="image/*" onChange={(e) => setQuestionFile(e.target.files[0])} ref={refFile}/> */}
                
            {/* <AppendRadioCard /> */}

       

            <Select
                     options={question_type} 
                  value={questionType}
                  onChange={(value) => {
                    setQuestionType(value);
                    handlePostType();   // clear/reset old values
                  }}
                    classNamePrefix="custom"
                    placeholder={questionType}
                  />
                       {QuestionTypeRenderer()}
{/*                 
            <TagInput value={tags} onChange={setTags} maxTags={5} /> */}
{/* 
            <AnonymousToggle
                    enabled={isAnonymous}
                    setEnabled={setIsAnonymous}
                    tokens={tokens}
                  /> */}
                   <MoreFieldsQuestion
                            tags={tags}
                            setTags={setTags}
                            isAnonymous={isAnonymous}
                            setIsAnonymous={setIsAnonymous}
                            tokens={tokens}
                            questionFileValue={questionFile}
                            setQuestionValue={setQuestionFile}
                          />
                  <div id="form-footer">
          <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Confessing..." : "Confess"}
        </button>
      </div>
        <div id="form-footer-2">
        <p>Nahidea Rule</p>
        <p>Private Policy</p>
        <p>User Agreement</p>
        <p>Accessibility</p>
        <p>Nahidea. © 2026. All rights reserved </p>
      </div>
              </form>
          </article>
          <article id='preview-article' style={{display: openPreview ? "block" : "none"}}> 
              <PreviewRadio title={title} filesMedia= {questionFile} postTag={tags} selectType={selectType?.value} isAnonymous={isAnonymous} setOpenPreview={setOpenPreview}
              questionType={questionType?.value}
                singleChoices={singleChoices}

                multipleChoices={multipleChoices}
                includeAllAbove={includeAllAbove}

                min={min}
                max={max}
                step={step}
                rangeValue={rangeValue}

                ratingIconId={ratingIconId}

                rankingChoices={rankingChoices}
              />
          </article>
      </div>
    );
}
const PreviewRadio = ({ title, filesMedia, postTag, selectType, isAnonymous, setOpenPreview,
         questionType,

          singleChoices, 

          multipleChoices, 
          includeAllAbove,

          min,
          max,
          step,
          rangeValue,

          ratingIconId,

          rankingChoices

      }) => {
  const [selected, setSelected] = useState(1);

  return (
  
    <div id="select-action-dev">
         <div id="select-radio">
          <button type="button" onClick={() => setOpenPreview(false)} id="preview-closed-arrow"><ArrowLeftOutlined /></button>
        <div  className='radio-button-div'>
             {[{id: 1, label: "Preview"}, {id: 2, label: "Document"}, {id: 3, label: "Content Rule"}].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              border: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
              color: selected === opt.id ? "#fd7648" : "grey",
            }}
            className='radio-button'
          >
            {opt.label}
          </button>
        ))}
        </div>
      </div>

      {/* Word underneath */}
      <div id="result-selected">
         {  <Post 
          titleValue={title} filesMediaValues= {filesMedia} postTagsValue={postTag} selectTypeValue={selectType} isAnonymousValue={isAnonymous} displaySelected={selected === 1 ? "block" : "none"}
          questionTypeValue={questionType}

            singleChoices={singleChoices}

            multipleChoices={multipleChoices}
            includeAllAbove={includeAllAbove}

            min={min}
            max={max}
            step={step}
            rangeValue={rangeValue}

            ratingIconId={ratingIconId}

            rankingChoices={rankingChoices}

          />}
         {selected === "Document" && "D" }
         {selected === "Content Rule" &&"C" }

    </div>
     
    </div>
    

  );
};

const Post = ({ titleValue, filesMediaValues, postTagsValue, selectTypeValue, isAnonymousValue, displaySelected, 
  questionTypeValue, 
  
    singleChoices,

    multipleChoices,
    includeAllAbove,

    min,
    max,
    step,
    rangeValue,

    ratingIconId, 

    rankingChoices
}) =>{
     const {username} = useOutletContext();
     const navigate = useNavigate();
    const [displayPostOpt, setDisplayPostOpt] = useState("none");
    const [displayBgMoreIcon, setBgMoreIcon] = useState("none");
    const wrapperRef = useRef(null);
    const handlePostOpt = () => {
        const Mode = localStorage.getItem("darkMode");
       if(displayPostOpt === "none"){
            setDisplayPostOpt("block");
            Mode === "true" ? setBgMoreIcon("rgb(40, 40, 40)") : setBgMoreIcon("rgb(245, 245, 245)");
       } 
       else{
            setDisplayPostOpt("none");
            setBgMoreIcon("none") 
       } 
    }
    useEffect(() => {
        function handleClickOutside(event) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDisplayPostOpt("none");
            setBgMoreIcon("none") 
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      function QuesitionType () {
        
        switch (questionTypeValue) {
          case "openend":
            return <div>Answer</div>;
          case "closedend":
            return <div id='closend-preview'>
                      <div id='closend-preview-yes'>Yes</div>
                      <div id='closend-preview-no'>No</div>
                    </div>;
          case "singlechoice":
            return <div className='singlechoice-preview-div'>
                      {singleChoices.map((singleChoice) => (
                          <div className='singlechoice-preview-option'>
                              <input type="radio" value={singleChoice} name="singlechoice"/>
                               <label htmlFor={singleChoice}>{singleChoice}</label>
                          </div> 
                      ))}
                    </div>;
          case "multiplechoice":
            return <div className='multiplechoice-preview-div'>
                      {multipleChoices.map((multipleChoice) => (
                          <div className='multiplechoice-preview-option'>
                              <input type="checkbox" value={multipleChoice} name="multiplechoice"/>
                               <label htmlFor={multipleChoice}>{multipleChoice}</label>
                          </div> 
                      ))}
                      {includeAllAbove === 1 && <div className='multiplechoice-preview-option'>
                          <input type="checkbox" value="All above" name="multiplechoice"/>
                           <label htmlFor="All above">All above</label>
                      </div>}
                    </div>;
          case "range":
            return <div className='range-preview-div'>
                      <div className='range-preview-option'>
                        <label htmlFor={min}>{min}</label>
                          <input type="range" value={rangeValue} name="range" step={step}/>
                          <label htmlFor={max}>{max}</label>
                          <label htmlFor={rangeValue}>{rangeValue}</label>
                      </div>
    
                    </div>;
          case "rating":
            return <div className='rating-preview-div'>
                  {Array.from({length:5}).map((_,i)=>(
                    <FontAwesomeIcon 
                      key={i}
                      icon={iconOptions.find((opt) => opt.id === ratingIconId)?.icon}
                      style={{ fontSize: "24px", color: "#ff3434" }}
                    />
                  ))}
              </div>;
          case "rankingorder":
            return <div className='rankingorder-preview-div'>
                      {rankingChoices.map((rankingChoice) => (
                          <div className='rankingorder-preview-option'>
                              <input value={rankingChoice} name="rankingorder" disabled/>
                               <label htmlFor={rankingChoice}>{rankingChoice}</label>
                          </div>
                      ))};
                    </div>;
          default:
            return "hi";
        }
      }
      
    return(


                <div className="posts" style={{display:displaySelected}}>
                      <div className='post-header'>
                              <div className='post-user-profile'>
                                
                                <AnonymousPf enabled={isAnonymousValue} realPf='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif'/>

                                  <div className='user-post-info'>
                                      <p className='post-username'><span className="anonymous-name"><AnonymousNm enabled={isAnonymousValue} realName={username}/></span></p>
                                      <p className='post-at'>Just now </p>
                                  </div>
                              </div>
                              
                            <DotDropDown/>
                      </div>
                      <div className='post-body'>
                         

                        {
                          titleValue === ""  && postTagsValue.length === 0? <div className='post-skeleton-holder'><Skeleton active/></div> : (
                            <div>
                               <div className='post-caption'>
                                 <p>{titleValue}</p>
                              </div>
                              <div className='post-content-type'>
                                  <span className='content-type'>{selectTypeValue}</span>
                              </div>
                              <div className="post-question-answer-preview">
                                  {QuesitionType()}
                                  
                              </div>
                              <div className='post-tags'>
                                  <TagsPreview tagsValue={postTagsValue}/>
                              </div>
                            </div>
                          )
                        }


                    <div className="post-thumbnail">
                        {filesMediaValues ? (
                          <img
                            src={URL.createObjectURL(filesMediaValues)}
                            alt="Confession"
                          />
                        ) :   <div className="media-preview-empty">
                                  <Skeleton.Image active />
                              </div>}
                      </div>

                      </div>
                      <div className='post-footer'>
                          <div className='post-footer-left'>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faHeart} /> <p><span>0</span><span className='count-label'> Like</span></p></button>
                              <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} /><p><span>0</span><span className='count-label'> Comment</span></p></button>
                          </div>
                          <div className='post-footer-right'>
                              <button className='button-action-footer button-action-footer-last'><FontAwesomeIcon icon={faBookmark} /></button>
                          </div>  
                      </div>
                </div>
    )
}

const QuestionAnswerPreview = ({ questionType }) => {
  switch (questionType) {
    case "openend":
      return null;

    case "closedend":
      return <div>yes/no</div>;

    case "range":
      return <div>range</div>;

    case "singlechoice":
      return <div>singlechoice</div>;

    case "multiplechoice":
      return <div>multiplechoice</div>;

    case "rankingorder":
      return <div>rankingorder</div>;

    case "rating":
      return <div>rating</div>;

    default:
      return null;
  }
};

const items = [
  {
    key: 'sub1',
    label: 'Rule 1',
    icon: <MailOutlined />,
    children: [
      { key: '1', label: 'hi' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
  {
    key: 'sub2',
    label: 'Rule blah blah',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Rule of Survival',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];
const DropDownRule = () => {
  
  const [current, setCurrent] = useState('1');
 
  const onClick = e => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <>
      
      <Menu
       
        onClick={onClick}
        style={{ width: 256 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </>
  );
};

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

const questionOptions = [
  { value: "openend", label: "Open End" },
  { value: "closedend", label: "Closed End" },
  { value: "singlechoice", label: "Single Choice" },
  { value: "multiplechoice", label: "Multiple Choice" },
  { value: "range", label: "Range" },
  { value: "rating", label: "Rating" },
  { value: "rankingorder", label: "Ranking Order" },
];

const DotDropDown = ({ theme, toggleTheme  }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const menuItems = [
    {
      label: (
        <li onClick={() => navigate("/user")}>
          <UserOutlined /> View Account
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li
          onClick={(e) => {
            toggleTheme();
            e.stopPropagation();
          }}
        >
          {theme ? <MoonOutlined /> : <SunOutlined />}{" "}
          {theme ? <span>Dark Mode</span> : <span>Light Mode</span>} 
        </li>
      ),
      key: "1",
    },
    {
      label: (
        <li onClick={() => navigate("/help")}>
          <SettingOutlined /> <span>Setting</span>
        </li>
      ),
      key: "2",
    },
    {
      label: (
        <li onClick={() => navigate("/help")}>
          <QuestionCircleOutlined /> <span>Help</span>
        </li>
      ),
      key: "3",
    },
    {
      label: (
        <li onClick={() => navigate("/feedback")}>
          <ExceptionOutlined /> <span>Feedback</span>
        </li>
      ),
      key: "4",
    },
    {  label: (
     
         <hr />
     
      ),
      key: "5" },
    {
      label: (
        <li onClick={() => navigate("/logout")}>
          <LogoutOutlined /> Logout
        </li>
      ),
      key: "6",
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} classNames={{ root: "profile-dropdown"}}>
      <div className='post-header-right'>
      <FontAwesomeIcon icon={faEllipsisVertical} className='icon-formore'/>
      </div>
    </Dropdown>
  );
};