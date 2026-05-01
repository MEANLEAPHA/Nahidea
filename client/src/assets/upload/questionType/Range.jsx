export default function Range ({ min, max, step, value, onChange, SetMax, SetMin, SetStep})  {
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