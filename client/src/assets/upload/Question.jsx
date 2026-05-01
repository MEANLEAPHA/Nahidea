import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from "react-router-dom";


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
import Rule from "../util/upload/Rule";
import PreviewRadio from "../util/upload/PreviewRadio";
import NahideaInfo from "../util/upload/NahideaInfo";
import {MoreFieldsConAndQues} from "../util/moreFlieds";

// import question type
import ClosedEnd from './questionType/ClosedEnd';
import OpenEnd from './questionType/OpenEnd';
import Range from './questionType/Range';
import SingleChoice from './questionType/SingleChoice';
import MultipleChoice from './questionType/MultipleChoice';
import RankingOrder from './questionType/RankingOrder';
import Rating from './questionType/Rating';

import{TagsPreview} from "../util/tagInput";
import {PlusOutlined,UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,SearchOutlined, BellOutlined, QuestionOutlined, FormOutlined, SoundOutlined, LogoutOutlined, MoonFilled, SunFilled, ExceptionOutlined, QuestionCircleOutlined, PlusSquareOutlined, SunOutlined, MoonOutlined} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

import { Skeleton, Menu, Switch  } from 'antd';
import { EditOutlined ,TagsOutlined,CloudUploadOutlined,LayoutOutlined,ArrowLeftOutlined,AppstoreOutlined, MailOutlined, SettingOutlined  } from '@ant-design/icons';

import { useOutletContext } from "react-router-dom";

// style 
import "../style/upload/tag.css";
import "../style/upload/Content.css";
import "../style/upload/Postpreview.css";

// get token
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
        <Range
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
  formData.append("isAnonymous", isAnonymous === true ? 1 : 0);
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

          <form onSubmit={handleSubmit} id="content-form">

            <div className="toast-feedback">
              <ToastContainer position="top-right" autoClose={2000} />
            </div>

            <div id='form-header-label'>
              <p id="content-label">Create Question</p> 
              <button id='preview-toggle' type="button" onClick={() => setOpenPreview(true)} ><LayoutOutlined /> Preview</button>
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
                maxLength={300} 
              />
              <div className="char-counter">
                {title.length}/300
              </div>
            </div>

            <Select
              options={question_type} 
              value={questionType}
              onChange={(value) => {
                setQuestionType(value);
                handlePostType();   
              }}
              classNamePrefix="custom"
              placeholder={questionType}
            />

            {QuestionTypeRenderer()}

            <MoreFieldsConAndQues
              tags={tags}
              setTags={setTags}
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
              tokens={tokens}
              conAndQuesFileValue={questionFile}
              setConAndQuesFileValue={setQuestionFile}
            />

            <div id="form-footer">
              <button type="submit" disabled={loading} id="content-post-button">
                {loading ? "Confessing..." : "Confess"}
              </button>
            </div>

          </form>
          <div id="article-rule">
            <Rule/>
          </div>
        </article>

        <article id='preview-article' style={{display: openPreview ? "block" : "none"}}> 
              <PreviewRadio
                title={title} filesMedia= {questionFile} postTag={tags} selectType={selectType?.value} isAnonymous={isAnonymous} setOpenPreview={setOpenPreview}

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

        <NahideaInfo />

      </div>
    );
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
const questionOptions = [
  { value: "openend", label: "Open End" },
  { value: "closedend", label: "Closed End" },
  { value: "singlechoice", label: "Single Choice" },
  { value: "multiplechoice", label: "Multiple Choice" },
  { value: "range", label: "Range" },
  { value: "rating", label: "Rating" },
  { value: "rankingorder", label: "Ranking Order" },
];

