import { useState, useEffect } from "react";
export const ClosedEnd = ({ options, setOptions }) => {

  const updateOption = (index, newOption) => {
    const next = [...options];
    next[index] = newOption;
    setOptions(next);
  };

  return (
    <div>
      <h4>Closed End (Yes / No)</h4>

      {options.map((opt, index) => (
        <OptionInput
          key={opt.id}
          option={opt}
          onChange={(updated) => updateOption(index, updated)}
          onRemove={() => {
            const next = options.filter((_, i) => i !== index);
            setOptions(next);
          }}
        />
      ))}
    </div>
  );
};