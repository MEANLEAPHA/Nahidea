export default function ClosedEnd ({
  YestitleValue,
  NoTitleValue,
  setYestitle,
  setNoTitle}){
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