import { useState, useEffect } from "react";

export default function OpenEnd({ onChange }) {
  const [file, setFile] = useState(null);

  useEffect(() => {
    onChange({
      openendFile: file
    });
  }, [file]);

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    </div>
  );
}