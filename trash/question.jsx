// const PreviewRadio = ({ title, filesMedia, postTag, selectType, isAnonymous, setOpenPreview,
//          questionType,

//           singleChoices, 

//           multipleChoices, 
//           includeAllAbove,

//           min,
//           max,
//           step,
//           rangeValue,

//           ratingIconId,

//           rankingChoices

//       }) => {
//   const [selected, setSelected] = useState(1);

//   return (
  
//     <div id="select-action-dev">
//          <div id="select-radio">
//           <button type="button" onClick={() => setOpenPreview(false)} id="preview-closed-arrow"><ArrowLeftOutlined /></button>
//         <div  className='radio-button-div'>
//              {[{id: 1, label: "Preview"}, {id: 2, label: "Document"}, {id: 3, label: "Content Rule"}].map((opt) => (
//           <button
//             key={opt.id}
//             onClick={() => setSelected(opt.id)}
//             style={{
//               border: selected === opt.id ? "2px solid #fd7648" : "2px solid transparent",
//               color: selected === opt.id ? "#fd7648" : "grey",
//             }}
//             className='radio-button'
//           >
//             {opt.label}
//           </button>
//         ))}
//         </div>
//       </div>

//       {/* Word underneath */}
//       <div id="result-selected">
//          {  <Post 
//           titleValue={title} filesMediaValues= {filesMedia} postTagsValue={postTag} selectTypeValue={selectType} isAnonymousValue={isAnonymous} displaySelected={selected === 1 ? "block" : "none"}
//           questionTypeValue={questionType}

//             singleChoices={singleChoices}

//             multipleChoices={multipleChoices}
//             includeAllAbove={includeAllAbove}

//             min={min}
//             max={max}
//             step={step}
//             rangeValue={rangeValue}

//             ratingIconId={ratingIconId}

//             rankingChoices={rankingChoices}

//           />}
//          {selected === "Document" && "D" }
//          {selected === "Content Rule" &&"C" }

//     </div>
     
//     </div>
    

//   );
// };

// const Post = ({ titleValue, filesMediaValues, postTagsValue, selectTypeValue, isAnonymousValue, displaySelected, 
//   questionTypeValue, 
  
//     singleChoices,

//     multipleChoices,
//     includeAllAbove,

//     min,
//     max,
//     step,
//     rangeValue,

//     ratingIconId, 

//     rankingChoices
// }) =>{
//      const {username} = useOutletContext();
//      const navigate = useNavigate();
//     const [displayPostOpt, setDisplayPostOpt] = useState("none");
//     const [displayBgMoreIcon, setBgMoreIcon] = useState("none");
//     const wrapperRef = useRef(null);
//     const handlePostOpt = () => {
//         const Mode = localStorage.getItem("darkMode");
//        if(displayPostOpt === "none"){
//             setDisplayPostOpt("block");
//             Mode === "true" ? setBgMoreIcon("rgb(40, 40, 40)") : setBgMoreIcon("rgb(245, 245, 245)");
//        } 
//        else{
//             setDisplayPostOpt("none");
//             setBgMoreIcon("none") 
//        } 
//     }
//     useEffect(() => {
//         function handleClickOutside(event) {
//           if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//             setDisplayPostOpt("none");
//             setBgMoreIcon("none") 
//           }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//           document.removeEventListener("mousedown", handleClickOutside);
//         };
//       }, []);

//       function QuesitionType () {
        
//         switch (questionTypeValue) {
//           case "openend":
//             return <div>Answer</div>;
//           case "closedend":
//             return <div id='closend-preview'>
//                       <div id='closend-preview-yes'>Yes</div>
//                       <div id='closend-preview-no'>No</div>
//                     </div>;
//           case "singlechoice":
//             return <div className='singlechoice-preview-div'>
//                       {singleChoices.map((singleChoice) => (
//                           <div className='singlechoice-preview-option'>
//                               <input type="radio" value={singleChoice} name="singlechoice"/>
//                                <label htmlFor={singleChoice}>{singleChoice}</label>
//                           </div> 
//                       ))}
//                     </div>;
//           case "multiplechoice":
//             return <div className='multiplechoice-preview-div'>
//                       {multipleChoices.map((multipleChoice) => (
//                           <div className='multiplechoice-preview-option'>
//                               <input type="checkbox" value={multipleChoice} name="multiplechoice"/>
//                                <label htmlFor={multipleChoice}>{multipleChoice}</label>
//                           </div> 
//                       ))}
//                       {includeAllAbove === 1 && <div className='multiplechoice-preview-option'>
//                           <input type="checkbox" value="All above" name="multiplechoice"/>
//                            <label htmlFor="All above">All above</label>
//                       </div>}
//                     </div>;
//           case "range":
//             return <div className='range-preview-div'>
//                       <div className='range-preview-option'>
//                         <label htmlFor={min}>{min}</label>
//                           <input type="range" value={rangeValue} name="range" step={step}/>
//                           <label htmlFor={max}>{max}</label>
//                           <label htmlFor={rangeValue}>{rangeValue}</label>
//                       </div>
    
//                     </div>;
//           case "rating":
//             return <div className='rating-preview-div'>
//                   {Array.from({length:5}).map((_,i)=>(
//                     <FontAwesomeIcon 
//                       key={i}
//                       icon={iconOptions.find((opt) => opt.id === ratingIconId)?.icon}
//                       style={{ fontSize: "24px", color: "#ff3434" }}
//                     />
//                   ))}
//               </div>;
//           case "rankingorder":
//             return <div className='rankingorder-preview-div'>
//                       {rankingChoices.map((rankingChoice) => (
//                           <div className='rankingorder-preview-option'>
//                               <input value={rankingChoice} name="rankingorder" disabled/>
//                                <label htmlFor={rankingChoice}>{rankingChoice}</label>
//                           </div>
//                       ))};
//                     </div>;
//           default:
//             return null;
//         }
//       }
      
//     return(


//                 <div className="posts" style={{display:displaySelected}}>
//                       <div className='post-header'>
//                               <div className='post-user-profile'>
                                
//                                 <AnonymousPf enabled={isAnonymousValue} realPf='https://media1.tenor.com/m/3TrUXi0fv0EAAAAd/kanye-staring-kanye-licking.gif'/>

//                                   <div className='user-post-info'>
//                                       <p className='post-username'><span className="anonymous-name"><AnonymousNm enabled={isAnonymousValue} realName={username}/></span></p>
//                                       <p className='post-at'>Just now </p>
//                                   </div>
//                               </div>
                              
//                             <DotDropDown/>
//                       </div>
//                       <div className='post-body'>
                         

//                         {
//                           titleValue === ""  && postTagsValue.length === 0? <div className='post-skeleton-holder'><Skeleton active/></div> : (
//                             <div>
//                                <div className='post-caption'>
//                                  <p>{titleValue}</p>
//                               </div>
//                               <div className='post-content-type'>
//                                   <span className='content-type'>{selectTypeValue}</span>
//                               </div>
//                               <div className="post-question-answer-preview">
//                                   {QuesitionType()}
                                  
//                               </div>
//                               <div className='post-tags'>
//                                   <TagsPreview tagsValue={postTagsValue}/>
//                               </div>
//                             </div>
//                           )
//                         }


//                     <div className="post-thumbnail">
//                         {filesMediaValues ? (
//                           <img
//                             src={URL.createObjectURL(filesMediaValues)}
//                             alt="Confession"
//                           />
//                         ) :   <div className="media-preview-empty">
//                                   <Skeleton.Image active />
//                               </div>}
//                       </div>

//                       </div>
//                       <div className='post-footer'>
//                           <div className='post-footer-left'>
//                               <button className='button-action-footer'><FontAwesomeIcon icon={faHeart} /> <p><span>0</span><span className='count-label'> Like</span></p></button>
//                               <button className='button-action-footer'><FontAwesomeIcon icon={faMessage} /><p><span>0</span><span className='count-label'> Comment</span></p></button>
//                           </div>
//                           <div className='post-footer-right'>
//                               <button className='button-action-footer button-action-footer-last'><FontAwesomeIcon icon={faBookmark} /></button>
//                           </div>  
//                       </div>
//                 </div>
//     )
// }
