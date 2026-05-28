// React state import
import React, {useState, useRef, useEffect, memo} from "react";
import { useNavigate, useOutletContext} from "react-router-dom";

// ant import
import { Skeleton, Menu, Switch, Dropdown, Space  } from 'antd';
import{SignatureOutlined, FolderOpenOutlined} from '@ant-design/icons';

// fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faHeart, faMessage} from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown, faThumbsUp,  faHandPointer, faHandPeace, faHand, faLocationCrosshairs, faStar} from "@fortawesome/free-solid-svg-icons";

// util import
import { AnonymousName, AnonymousProfile } from "../anonymousTokens";
import MoreDropDown from "./MoreDropDown";
import { MarkdownPreview} from "../moreFlieds";
import {MediaPreview} from "../mediaUploader";
import{TagsPreview} from "../tagInput";
import {DisplayAnimatedIcon} from "../../util/upload/AnimatedIcon";

//data
import { iconOptions } from "../../data/post_type_data";

//auth

import { useAuth } from '../../context/AuthContext';


// memo on annoymous prevnet re-render
const AnonymousPf = memo(AnonymousProfile);
const AnonymousNm = memo(AnonymousName);

export default function PreviewPost ({
    // primary
    titleValue, filesMediaValues, postTagsValue, selectTypeValue, selectTypeIcon, isAnonymousValue, displaySelected,
    post_type,

    //content
    textBodyValue, 

    // question
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

}){
    const {username} = useOutletContext();
    const {user} = useAuth();
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
            return <div className="question-preview-card">
                        <div className="question-preview-header question-preview-header-open-end">
                            <span className="question-badge openend-badge">
                               <SignatureOutlined /> Write Your Answer
                            </span>
                            <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>
                    </div>;
        case "closedend":
            return <div className="closed-preview-card question-preview-card">
                        <div className="question-preview-header">
                            <span className="question-badge yesno-badge">
                             <FontAwesomeIcon icon={faThumbsUp}/> Yes / No <FontAwesomeIcon icon={faThumbsDown}/>
                            </span>
                            <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>

                          <div className="yesno-div">
                            <div className="yes-chip">
                              Yes
                            </div>

                            <div className="no-chip">
                              No
                            </div>
                        </div>
                    </div>;
        case "singlechoice":
            return <div className="question-preview-card">
                    {/* {singleChoices.map((singleChoice) => (
                        <div className='singlechoice-preview-option'>
                            <input type="radio" value={singleChoice} name="singlechoice"/>
                                <label htmlFor={singleChoice}>{singleChoice}</label>
                        </div> 
                    ))} */}
                        <div className="question-preview-header">
                        <span className="question-badge single-badge"><FontAwesomeIcon icon={faHandPointer} /> Pick One</span>
                        <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                        </div>

                        <div className="question-preview-options two-grid">
                        {singleChoices
                        .slice(0, singleChoices.length > 4 ? 3 : 4)
                        .map((c, i) => (
                            <div key={i} className="option-chip">
                            {c}
                            </div>
                        ))}

                        {singleChoices.length > 4 && (
                        <div className="option-chip more-chip">
                            +{singleChoices.length - 3} more
                        </div>
                        )}

                        </div>
                    </div>;
        case "multiplechoice":
            return <div className="question-preview-card">
                    {/* {multipleChoices.map((multipleChoice) => (
                        <div className='multiplechoice-preview-option'>
                            <input type="checkbox" value={multipleChoice} name="multiplechoice"/>
                                <label htmlFor={multipleChoice}>{multipleChoice}</label>
                        </div> 
                    ))}
                    {includeAllAbove === 1 && <div className='multiplechoice-preview-option'>
                        <input type="checkbox" value="All above" name="multiplechoice"/>
                            <label htmlFor="All above">All above</label>
                    </div>} */}
                        <div className="question-preview-header">
                            <span className="question-badge multiple-badge">
                             <FontAwesomeIcon icon={faHandPeace} /> Pick Multiple
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>

                         <div className="question-preview-options two-grid">
                            {multipleChoices
                            .slice(0, multipleChoices.length > 4 ? 3 : 4)
                            .map((c, i) => (
                                <div key={i} className="option-chip">
                                {c}
                                </div>
                            ))}

                            {multipleChoices.length > 4 && (
                            <div className="option-chip more-chip">
                                +{multipleChoices.length - 3} more
                            </div>
                            )}

                        </div>
                    </div>;
        case "range":
            return <div className= "question-preview-card">

                <div className="question-preview-header">
                            <span className="question-badge range-badge">
                            <FontAwesomeIcon icon={faLocationCrosshairs} /> Range
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>
                          <div className='range-preview-option'>
                                  <label id="min-label">{min}</label>

                <div className="range-wrapper">
                    <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={rangeValue}
                    onChange={(e) => setRangeValue(Number(e.target.value))}
                    />
                        <div
                    className="custom-thumb"
                    style={{
                        left: `${((rangeValue - min) / (max - min)) * 100}%`
                    }}
                    >
                    {rangeValue}
                    </div>
                </div>
                <label id="max-label">{max}</label>
                          </div>
              

                </div>
        case "rating":
            return  <div className="question-preview-card">
                 <div className="question-preview-header">
                            <span className="question-badge rating-badge">
                              <FontAwesomeIcon icon={faStar} /> Rate
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>
                {Array.from({length:5}).map((_,i)=>(
                    <FontAwesomeIcon 
                    key={i}
                    icon={iconOptions.find((opt) => opt.id === ratingIconId)?.icon}
                    style={{ fontSize: "24px", color: "grey" }}
                    />
                ))}
            </div>;
        case "rankingorder":
            return <div className="question-preview-card">
                    {/* {rankingChoices.map((rankingChoice) => (
                        <div className='rankingorder-preview-option'>
                            <input value={rankingChoice} name="rankingorder" disabled/>
                                <label htmlFor={rankingChoice}>{rankingChoice}</label>
                        </div>
                    ))}; */}
                    <div className="question-preview-header">
                            <span className="question-badge rank-badge">
                              <FontAwesomeIcon icon={faHand} /> Move the Rankings
                            </span>
                              <span className="case-unsolved">
                                <FolderOpenOutlined /> Unsolved
                            </span>
                          </div>

                          <div className="question-preview-options two-grid">
                                {rankingChoices
                                    .slice(0, rankingChoices.length > 4 ? 3 : 4)
                                    .map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="option-chip rank-chip"
                                    >
                                        <span className="rank-number">
                                        #{idx + 1}
                                        </span>

                                        <span className="rank-text">
                                        {item}
                                        </span>
                                    </div>
                                    ))}

                                {rankingChoices.length > 4 && (
                                    <div className="option-chip more-chip">
                                    +{rankingChoices.length - 3} more
                                    </div>
                                )}
                            </div>
                    </div>;
    default:
        return null;
    }
    }
    return(
        <div className="posts preview-posts" style={{display:displaySelected}}>
            <div className='post-header'>
                <div className='post-user-profile'>
                    {/* avatar_url from auth */}
                <AnonymousPf enabled={isAnonymousValue} realPf={user?.avatar_url || 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix'}/> 
                    <div className='user-post-info'>
                        <p className='post-username'>
                            <AnonymousNm enabled={isAnonymousValue} realName={user?.username || 'guest'}/>
                            {selectTypeIcon && (
                                <div className='dot'></div>
                             )}     
                            {selectTypeIcon && (
                            <div className='category-post-div'>
                                    <span className="post-type-label">{selectTypeValue}</span> 
                                    <DisplayAnimatedIcon src={selectTypeIcon || 'https://cdn.lordicon.com/ulnswmkk.json'} />
                            </div>
                            )}
                        </p>
                        <p className='post-at'>Just now</p>
                    </div>
                </div>
                <MoreDropDown post_type={post_type}/> 
            </div>
            <div className='post-body'> 
                {
                    titleValue === "" && postTagsValue.length === 0 ? <div className='post-skeleton-holder'>
                        <Skeleton active style={{marginTop:"10px"}}/></div> : (
                    <>
                      <div className='post-body-text'>
                            {questionTypeValue !== "" && QuesitionType()}
                        </div>
                        <div className='post-caption'>
                            <p>{titleValue}</p>
                        </div>
                        {
                            textBodyValue && (
                                <div className='post-body-text'>
                                    <MarkdownPreview content={textBodyValue}/>
                                </div>
                            )
                        }
                       
                       {
                        postTagsValue.length !== 0 && (
                            <div className='post-tags'>
                                <TagsPreview tagsValue={postTagsValue}/>
                            </div>
                        )
                       }
                    </>
                    )
                }
                <div  className='post-thumbnail'>   
                    {titleValue === "" && postTagsValue.length === 0 ?
                   <Skeleton.Image active/>
                            
                            :
                            <MediaPreview files={filesMediaValues}/>
                    }
            
                </div>
            </div>

            <div className='post-footer'>
                <div className='post-footer-left'>
                    <button className='button-action-footer'><FontAwesomeIcon icon={faHeart} className='button-action-footer-icon'/> <p><span>0</span><span className='count-label'> Like</span></p></button>
                    <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} className='button-action-footer-icon'/><p><span>0</span><span className='count-label'> Comment</span></p></button>
                </div>
                <div className='post-footer-right'>
                    <button className='button-action-footer button-action-footer-last'><FontAwesomeIcon icon={faBookmark} /></button>
                </div>  
            </div>

        </div>
    )
}

