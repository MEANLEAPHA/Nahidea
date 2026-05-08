import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const token = localStorage.getItem("token");

const ReportComment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [type, setType] = useState("spam");
  const [reason, setReason] = useState("");

  const submit = async () => {
    await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/comments/${state.commentId}/report`,
      { report_type: type, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(-1);
  };

  return (
    <div className="report-box">

      <select onChange={(e) => setType(e.target.value)}>
        <option value="spam">Spam</option>
        <option value="harassment">Harassment</option>
        <option value="hate_speech">Hate Speech</option>
        <option value="violence">Violence</option>
        <option value="nudity">Nudity</option>
        <option value="misinformation">Misinformation</option>
        <option value="scam">Scam</option>
        <option value="bullying">Bullying</option>
        <option value="self_harm">Self Harm</option>
        <option value="illegal_activity">Illegal</option>
        <option value="child_safety">Child Safety</option>
        <option value="terrorism">Terrorism</option>
        <option value="other">Other</option>
      </select>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain..."
      />

      <button onClick={submit}>
        Report
      </button>

    </div>
  );
};

export default ReportComment;