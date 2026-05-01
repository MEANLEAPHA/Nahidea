export default function SingleChoice ({ value, onChange}) {
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
