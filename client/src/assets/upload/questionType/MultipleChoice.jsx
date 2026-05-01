export default function MultipleChoice({ value, onChange, includeAllAbove, setIncludeAllAbove}){
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