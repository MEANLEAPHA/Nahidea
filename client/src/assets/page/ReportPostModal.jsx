// components/ReportPostModal.jsx

import React, { useState } from "react";
import axios from "axios";

import {
  Modal,
  Radio,
  Input,
  Button,
  message
} from "antd";

import {
  WarningOutlined
} from "@ant-design/icons";

import "../style/page/ReportPostModal.css";

const { TextArea } = Input;

const REPORT_OPTIONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "violence", label: "Violence or dangerous content" },
  { value: "misinformation", label: "False information" },
  { value: "sexual_content", label: "Sexual or adult content" },
  { value: "copyright", label: "Copyright violation" },
  { value: "self_harm", label: "Self-harm or suicide" },
  { value: "scam", label: "Scam or fraud" },
  { value: "other", label: "Other" },
];

const token = localStorage.getItem("token");

export default function ReportPostModal({
  open,
  setOpen,
  postId
}) {

  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {

    if (!reportType) {
      return message.warning("Please select a reason");
    }

    try {

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/report-post`,
        {
          post_id: postId,
          report_type: reportType,
          reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 201) {
        message.success("Report submitted");

        setOpen(false);
        setReportType("");
        setReason("");
      }

    } catch (err) {

      if (err.response?.status === 409) {
        message.warning("You already reported this post");
      } else {
        message.error("Failed to submit report");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={520}
      className="report-modal"
    >

      <div className="report-header">
        <WarningOutlined className="report-icon" />
        <div>
          <h2>Report Post</h2>
          <p>
            Your report is anonymous. Moderators will review this content.
          </p>
        </div>
      </div>

      <div className="report-body">

        <Radio.Group
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="report-radio-group"
        >

          {REPORT_OPTIONS.map((item) => (
            <Radio
              key={item.value}
              value={item.value}
              className="report-radio"
            >
              {item.label}
            </Radio>
          ))}

        </Radio.Group>

        <TextArea
          placeholder="Additional details (optional)"
          rows={4}
          maxLength={500}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="report-textarea"
        />

        <div className="report-footer">
          <Button
            size="large"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSubmit}
            className="report-submit-btn"
          >
            Submit Report
          </Button>
        </div>

      </div>

    </Modal>
  );
}