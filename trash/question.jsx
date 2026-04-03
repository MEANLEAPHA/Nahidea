   const handlePostType = () => {
      if(questionType === "openend"){
        // close end
        setYestitle("");
        setYesFile(null);
        setNoTitle("");
        setNoFile(null);

        // range 
        setMin(null);
        setMax(null);
        setStep(1);
        setRangeValue(null);
        setRangeFile(null);

        // single choice
        setSingleChoices(["", "", ""]);
        setSingleChoiceFile(null);

        // multiple choice
        setMultipleChoices(["","",""]);
        setIncludeAllAbove(false);
        setMultipleChoiceFile(null);

        // ranking order
        setRankingChoices(["","",""]);
        setRankingOrderFile(null);

        //rating
        setRatingIconId(1);
        setRatingFile(null);
      }
      if(questionType === "closedend"){
        // range 
        setMin(null);
        setMax(null);
        setStep(1);
        setRangeValue(null);
        setRangeFile(null);

        // open end
        setOpenEndFile(null);


        // single choice
        setSingleChoices(["", "", ""]);
        setSingleChoiceFile(null);

        // multiple choice
        setMultipleChoices(["","",""]);
        setIncludeAllAbove(false);
        setMultipleChoiceFile(null);

         // ranking order
        setRankingChoices(["","",""]);
        setRankingOrderFile(null);

        //rating
        setRatingIconId(1);
        setRatingFile(null);
      }
      if(questionType === "range"){
        // close end
        setYestitle("");
        setYesFile(null);
        setNoTitle("");
        setNoFile(null);

        // open end
        setOpenEndFile(null);

        // single choice
        setSingleChoices(["", "", ""]);
        setSingleChoiceFile(null);

        // multiple choice
        setMultipleChoices(["","",""]);
        setIncludeAllAbove(false);
        setMultipleChoiceFile(null);

         // ranking order
        setRankingChoices(["","",""]);
        setRankingOrderFile(null);

        //rating
        setRatingIconId(1);
        setRatingFile(null);
      }
      if(questionType === "singlechoice"){
        // close end
        setYestitle("");
        setYesFile(null);
        setNoTitle("");
        setNoFile(null);

        // open end
        setOpenEndFile(null);

        // range 
        setMin(null);
        setMax(null);
        setStep(1);
        setRangeValue(null);
        setRangeFile(null);

        // multiple choice
        setMultipleChoices(["","",""]);
        setIncludeAllAbove(false);
        setMultipleChoiceFile(null);

        // ranking order
        setRankingChoices(["","",""]);
        setRankingOrderFile(null);

        //rating
        setRatingIconId(1);
        setRatingFile(null);
      }
      if(questionType === "multiplechoice"){
        // close end
        setYestitle("");
        setYesFile(null);
        setNoTitle("");
        setNoFile(null);

        // open end
        setOpenEndFile(null);

        // range 
        setMin(null);
        setMax(null);
        setStep(1);
        setRangeValue(null);
        setRangeFile(null);

        // single choice
        setSingleChoices(["", "", ""]);
        setSingleChoiceFile(null);

        // ranking order
        setRankingChoices(["","",""]);
        setRankingOrderFile(null);

        //rating
        setRatingIconId(1);
        setRatingFile(null);
      }
      if(questionType === "rankingorder"){
        // close end
        setYestitle("");
        setYesFile(null);
        setNoTitle("");
        setNoFile(null);

        // open end
        setOpenEndFile(null);

        // range 
        setMin(null);
        setMax(null);
        setStep(1);
        setRangeValue(null);
        setRangeFile(null);

        // single choice
        setSingleChoices(["", "", ""]);
        setSingleChoiceFile(null);

        // multiple choice
        setMultipleChoices(["","",""]);
        setIncludeAllAbove(false);
        setMultipleChoiceFile(null);

        //rating
        setRatingIconId(1);
        setRatingFile(null);
      }
      if(questionType === "rating"){
        // close end
        setYestitle("");
        setYesFile(null);
        setNoTitle("");
        setNoFile(null);

        // open end
        setOpenEndFile(null);

        // range 
        setMin(null);
        setMax(null);
        setStep(1);
        setRangeValue(null);
        setRangeFile(null);

        // single choice
        setSingleChoices(["", "", ""]);
        setSingleChoiceFile(null);

        // multiple choice
        setMultipleChoices(["","",""]);
        setIncludeAllAbove(false);
        setMultipleChoiceFile(null);

        // ranking order
        setRankingChoices(["","",""]);
        setRankingOrderFile(null);
      }
    }
      
     {
      // question setence
      const [title, setTitle] = useState('');
    
      // question topic related
      const [selectType, setSelectType] = useState(null);
    
      // tag state
      const [tags, setTags] = useState([]);
    
      // annoymous state
      
       const [isAnonymous, setIsAnonymous] = useState(false);
      const [annoymousUsed, setAnnoymousUsed] = useState(3);
      const [countDown, setCountDown] = useState(0);
      const intervalRef = useRef(null);
    
      // question type state
      const [questionType, setQuestionType] = useState(null);
    
        // open end state
        const [openEndFileValue, setOpenEndFile] = useState(null);
    
        // closed end state
        const [yestitle, setYestitle] = useState('');
        const [yesFile, setYesFile] = useState(null);
        const [noTitle, setNoTitle] = useState('');
        const [noFile, setNoFile] = useState(null);
    
        // Range state
        const [min, setMin] = useState(0);
        const [max, setMax] = useState(100);
        const [step, setStep] = useState(1);
        const [rangeValue, setRangeValue] = useState(0);
        const [rangeFile, setRangeFile] = useState(null);
    
        // single choice
        const [singleChoices, setSingleChoices] = useState(["", "", ""]);
        const [singleChoiceFile, setSingleChoiceFile] = useState(null);
    
        // multiple choice
        const [multipleChoices, setMultipleChoices] = useState(["", "", ""]);
        const [includeAllAbove, setIncludeAllAbove] = useState(0);
        const [multipleChoiceFile, setMultipleChoiceFile] = useState(null);
    
        // ranking order
        const [rankingChoices, setRankingChoices] = useState(["", "", ""]);
        const [rankingOrderFile, setRankingOrderFile] = useState(null);
    
        // rating 
        const [ratingIconId, setRatingIconId] = useState(1);
        const [ratingFile, setRatingFile] = useState(null);
}
          <form onSubmit={handleSubmit}>
        
              <label htmlFor="title">Caption</label>
              <input type="text" 
                      name='title'
                      className='input-title'
                      onChange={(e)=> setTitle(e.target.value)} 
                      value={title}
                      placeholder="Type your text content here..."
              />
        
              <label htmlFor="type">Question related to:</label>
              <Select
                options={question_options}
                value={selectType}
                onChange={setSelectType}
              />
        
              <br />
               <label>
                  <input 
                    type="radio" 
                    name="question-type" 
                    value="openend" 
                    onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                    checked={questionType === "openend"} 
                    className="radio" 
                  />
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS90nUCMSa8ongTJCpTWgR_cy5mMtuXev1NCg&s" 
                    alt="Open Ended" 
                    className={questionType === "openend" ? "selected" : ""} 
                  />
                </label>
        
              <label>
                <input 
                  type="radio" 
                  name="question-type" 
                  value="closedend" 
                  onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                  checked={questionType === "closedend"} 
                  className="radio" 
                />
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5OOdmroWDpWEbbytAew7LAkKvzUYhmZZx8Q&s" 
                  alt="Closed Ended" 
                  className={questionType === "closedend" ? "selected" : ""} 
                />
              </label>
        
              <label>
                <input 
                  type="radio" 
                  name="question-type" 
                  value="range" 
                  onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                  checked={questionType === "range"} 
                  className="radio" 
                />
                <img 
                  src="https://img.freepik.com/premium-vector/blue-car-flat-style-illustration-isolated-white-background_108231-795.jpg?semt=ais_incoming&w=740&q=80" 
                  alt="Range" 
                  className={questionType === "range" ? "selected" : ""} 
                />
              </label>
        
              <label>
                <input 
                  type="radio" 
                  name="question-type" 
                  value="singlechoice" 
                  onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                  checked={questionType === "singlechoice"} 
                  className="radio" 
                />
                <img 
                  src="https://img.freepik.com/free-vector/electric-car-white-background_1308-21368.jpg?semt=ais_user_personalization&w=740&q=80" 
                  alt="Single Choice" 
                  className={questionType === "singlechoice" ? "selected" : ""} 
                />
              </label>
        
              <label>
                <input 
                  type="radio" 
                  name="question-type" 
                  value="multiplechoice" 
                  onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                  checked={questionType === "multiplechoice"} 
                  className="radio" 
                />
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThYff67knNe_Yfxy_91qsv35FgUhFWgvsAkA&s" 
                  alt="Multiple Choice" 
                  className={questionType === "multiplechoice" ? "selected" : ""} 
                />
              </label>
        
              <label>
                <input 
                  type="radio" 
                  name="question-type" 
                  value="rankingorder" 
                  onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                  checked={questionType === "rankingorder"} 
                  className="radio" 
                />
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh7yenXHLnm2mRNd4ENksCtku0XUiaezTkSg&s" 
                  alt="Ranking Order" 
                  className={questionType === "rankingorder" ? "selected" : ""} 
                />
              </label>
        
              <label>
                <input 
                  type="radio" 
                  name="question-type" 
                  value="rating" 
                  onChange={(e) => {setQuestionType(e.target.value); handlePostType()}} 
                  checked={questionType === "rating"} 
                  className="radio" 
                />
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKVybqeCw4hx6GtIiLMrnEKczyHi9PxmIIw&s" 
                  alt="Rating" 
                  className={questionType === "rating" ? "selected" : ""} 
                />
                </label>
        
        {questionType === "openend" && (
          <OpenEnd
                  OpenEndFileValue={openEndFileValue}
                  SetOpenEndFile={setOpenEndFile}
                />
        )}
        
        {questionType === "closedend" && (
          <ClosedEnd
                  YestitleValue={yestitle}
                  NoTitleValue={noTitle}
                  YesFileValue={yesFile}
                  NoFileValue={noFile}
                  setYestitle={setYestitle}
                  setYesFile={setYesFile}
                  setNoTitle={setNoTitle}
                  setNoFile={setNoFile}
                />
        )}
        
        {questionType === "range" && (
          <RangeInput
                  min={min}
                  max={max}
                  step={step}
                  SetStep={setStep}
                  SetMin = {setMin}
                  SetMax = {setMax}
                  value={rangeValue}
                  onChange={(e) => setRangeValue(e.target.value)}
                  RangeFileValue={rangeFile} 
                  SetRangeFile={setRangeFile}
                />
        )}
        
        {questionType === "singlechoice" && (
          <SingleChoice value={singleChoices} onChange={setSingleChoices}  SingleChoiceFileValue={singleChoiceFile} SetSingleChoiceFile={setSingleChoiceFile}/>
        )}
        
        {questionType === "multiplechoice" && (
          <MultipleChoice
            value={multipleChoices}
            onChange={setMultipleChoices}
            includeAllAbove={includeAllAbove}
            setIncludeAllAbove={setIncludeAllAbove}
            MultipleChoiceFileValue={multipleChoiceFile}
            SetMultipleChoiceFile={setMultipleChoiceFile}
          />
        )}
        {questionType === "rankingorder" && (
          <RankingOrder value={rankingChoices} onChange={setRankingChoices} RankingOrderFileValue={rankingOrderFile} SetRankingOrderFile={setRankingOrderFile} />
        )}
        
        {questionType === "rating" && (
          <Rating value={ratingIconId} onChange={setRatingIconId} RatingFileValue={ratingFile} SetRatingFile={setRatingFile}/>
        )}
        
              <br />
              
              <TagInput value={tags} onChange={setTags} maxTags={5} />
        
              <AnonymousToggle
                enabled={isAnonymous}
                setEnabled={setIsAnonymous}
                tokens={tokens}
                countdown={countdown}
              />
        
              <button type="submit">Upload</button>
        
            </form>

            const iconOptions = [
  { id: 1, name: "star", icon: faStar },
  { id: 2, name: "heart", icon: faHeart },
  { id: 3, name: "happy", icon: faSmile },
  { id: 4, name: "crying", icon: faSadTear },
];

const OpenEnd = ({OpenEndFileValue,SetOpenEndFile}) => {
  return(
     <div>
        <input type="file" onChange={(e) => SetOpenEndFile(e.target.files[0])} />
        {OpenEndFileValue && (
          <div>
            {OpenEndFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(OpenEndFileValue)}
                alt="image preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => SetOpenEndFile(null)}>Delete</button>
          </div>
        )}
     </div>
  )
};
const ClosedEnd = ({
  YestitleValue,
  NoTitleValue,
  YesFileValue,
  NoFileValue,
  setYestitle,
  setYesFile,
  setNoTitle,
  setNoFile
}) => {
  return (
    <div>
      <label>Yes answer</label>
      <div>
        <input type="file" onChange={(e) => setYesFile(e.target.files[0])} />
        <input
          type="text"
          value={YestitleValue}
          onChange={(e) => setYestitle(e.target.value)}
        />
        {YesFileValue && (
          <div>
            {YesFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(YesFileValue)}
                alt="Yes preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => setYesFile(null)}>Delete</button>
          </div>
        )}
        {(YesFileValue && YestitleValue) && (<button onClick={(e) => {
          setYesFile(null);
          setYestitle("");
        }}>Clear all</button>)}
      </div>

      <label>No answer</label>
      <div>
        <input type="file" onChange={(e) => setNoFile(e.target.files[0])} />
        <input
          type="text"
          value={NoTitleValue}
          onChange={(e) => setNoTitle(e.target.value)}
        />
        {NoFileValue && (
          <div>
            
            {NoFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(NoFileValue)}
                alt="No preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => setNoFile(null)}>Delete</button>
          </div>
        )}
      </div>

    </div>
  );
};
const RangeInput = ({ min, max, step, value, onChange, SetMax, SetMin, SetStep, RangeFileValue, SetRangeFile }) => {
  return (
    <div>
       <input type="file" onChange={(e) => SetRangeFile(e.target.files[0])} />
        {RangeFileValue && (
          <div>
            {RangeFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(RangeFileValue)}
                alt="image preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => SetRangeFile(null)}>Delete</button>
          </div>
        )}
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
const SingleChoice = ({ value, onChange, SingleChoiceFileValue, SetSingleChoiceFile }) => {
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
      <input type="file" onChange={(e) => SetSingleChoiceFile(e.target.files[0])} />
        {SingleChoiceFileValue && (
          <div>
            {SingleChoiceFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(SingleChoiceFileValue)}
                alt="image preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => SetSingleChoiceFile(null)}>Delete</button>
          </div>
        )}
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
        <button onClick={addChoice} disabled={value.length >= maxChoices}>
          Add more choice
        </button>
        {value.length > 3 && (
          <button onClick={removeAll}>Remove all</button>
        )}
      </div>
    </div>
  );
};
const MultipleChoice = ({ value, onChange, includeAllAbove, setIncludeAllAbove, MultipleChoiceFileValue, SetMultipleChoiceFile }) => {
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
      <input type="file" onChange={(e) => SetMultipleChoiceFile(e.target.files[0])} />
        {MultipleChoiceFileValue && (
          <div>
            {MultipleChoiceFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(MultipleChoiceFileValue)}
                alt="image preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => SetMultipleChoiceFile(null)}>Delete</button>
          </div>
      )}
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
        <button onClick={addChoice} disabled={value.length >= maxChoices}>
          Add more choice
        </button>
        {value.length > 3 && (
          <button onClick={removeAll}>Remove all</button>
        )}
        {!includeAllAbove && (
          <button onClick={() => setIncludeAllAbove(1)}>
            Add "All Above"
          </button>
        )}
        {includeAllAbove && (
          <button onClick={() => setIncludeAllAbove(0)}>
            Remove "All Above"
          </button>
        )}
      </div>
    </div>
  );
};
const RankingOrder = ({ value, onChange, RankingOrderFileValue, SetRankingOrderFile }) => {
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
      <input type="file" onChange={(e) => SetRankingOrderFile(e.target.files[0])} />
        {RankingOrderFileValue && (
          <div>
            {RankingOrderFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(RankingOrderFileValue)}
                alt="image preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => SetRankingOrderFile(null)}>Delete</button>
          </div>
        )}
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
        <button onClick={addItem} disabled={items.length >= maxItems}>
          Add more choice
        </button>
        {items.length > 3 && (
          <button onClick={removeAll}>Remove all</button>
        )}
      </div>
    </div>
  );
};
const Rating = ({ value, onChange, RatingFileValue, SetRatingFile }) => {
  return (
    <div>
      <input type="file" onChange={(e) => SetRatingFile(e.target.files[0])} />
        {RatingFileValue && (
          <div>
            {RatingFileValue.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(RatingFileValue)}
                alt="image preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
            <button onClick={(e) => SetRatingFile(null)}>Delete</button>
          </div>
        )}
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
  if(questionType === "openend"){
    formData.append("question_type", "openend")
    if(openEndFileValue){
      formData.append("openendFile", openEndFileValue);
    }
  };

  if (questionType === "closedend"){
    formData.append("question_type", "closedend");
    formData.append("yesTitle", yestitle);
    formData.append("noTitle", noTitle);
    if (yesFile) {
      formData.append("yesFile", yesFile);
    }
    if (noFile) {
      formData.append("noFile", noFile);
    }
  };
  
  if(questionType === "range"){
    formData.append("question_type", "range");
    formData.append("rangeMin", min);
    formData.append("rangeMax", max);
    formData.append("rangeStep", step);
    formData.append("defaultRangeValue", rangeValue);
    formData.append("rangeFile", rangeFile);
  };

  if(questionType === "singlechoice"){
    formData.append("question_type", "singlechoice");
    formData.append("singleChoiceFile", singleChoiceFile);
    singleChoices.forEach((c) => formData.append("choices[]", c));
  };

  if(questionType === "multiplechoice"){
    formData.append("question_type", "multiplechoice");
    multipleChoices.forEach((c) => formData.append("choices[]", c));
    formData.append("include_all_above", includeAllAbove); // bool
    formData.append("multipleChoiceFile", multipleChoiceFile);
  }

  if(questionType === "rankingorder"){
    formData.append("question_type", "rankingorder");
    rankingChoices.forEach((c, i) =>
      formData.append(`ranking[${i+1}]`, c)
    );
    formData.append("rankingOrderFile", rankingOrderFile);
  }

  if(questionType === "rating"){
    formData.append("question_type", "rating");
    formData.append("rating_icon_id", ratingIconId); 
    formData.append("ratingFile", ratingFile);
  }
  