// React state import
import React, {useState, useRef, useEffect, memo} from "react";
import { useNavigate, useOutletContext  } from "react-router-dom";

// ant import
import { Skeleton, Menu, Switch, Dropdown, Space  } from 'antd';

// fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faHeart, faMessage} from "@fortawesome/free-regular-svg-icons";

// util import

import { AnonymousName, AnonymousProfile } from "../anonymousTokens";
import MoreDropDown from "./MoreDropDown";
import { MarkdownPreview} from "../moreFlieds";
import {MediaPreview} from "../mediaUploader";
import{TagsPreview} from "../tagInput";

// memo on annoymous prevnet re-render
const AnonymousPf = memo(AnonymousProfile);
const AnonymousNm = memo(AnonymousName);

export default function PreviewPost ({
    // primary
    titleValue, filesMediaValues, postTagsValue, selectTypeValue, isAnonymousValue, displaySelected,

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
        return null;
    }
    }
    return(
        <div className="posts preview-posts" style={{display:displaySelected}}>
            <div className='post-header'>
                <div className='post-user-profile'>
                <AnonymousPf enabled={isAnonymousValue} realPf='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif'/>
                    <div className='user-post-info'>
                        <p className='post-username'><AnonymousNm enabled={isAnonymousValue} realName={username}/></p>
                        <p className='post-at'>Just now</p>
                    </div>
                </div>
                <MoreDropDown/>
            </div>
            <div className='post-body'>
                {
                    titleValue === "" && textBodyValue === "" && postTagsValue.length === 0? <div className='post-skeleton-holder'><Skeleton active/></div> : (
                    <div>
                        <div className='post-caption'>
                            <p>{titleValue}</p>
                        </div>
                        <div className='post-content-type'>
                            <span className='content-type'>{selectTypeValue}</span>
                        </div>
                        <div className='post-body-text'>
                            <MarkdownPreview content={textBodyValue}/>
                            {questionTypeValue !== "" && QuesitionType()}
                        </div>
                        <div className='post-tags'>
                            <TagsPreview tagsValue={postTagsValue}/>
                        </div>
                    </div>
                    )
                }
                <div  className='post-thumbnail'>   
                    <MediaPreview files={filesMediaValues}/>
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
