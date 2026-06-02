import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/page/ReportConversation.css';

const ReportConversation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId } = location.state || {};
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert('Please select a reason');

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/report-conversation/${conversationId}`, {
        reason,
        details,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Report submitted successfully');
      navigate('/conversations');
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <h2>Report Conversation</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>
          Reason:
          <select value={reason} onChange={(e) => setReason(e.target.value)} required>
            <option value="">Select reason</option>
            <option value="spam">Spam</option>
            <option value="abuse">Abuse</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Details:
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide more context..."
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportConversation;
