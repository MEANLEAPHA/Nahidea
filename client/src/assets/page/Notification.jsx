
import React, {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import axios from "axios";

import "../style/page/Notification.css";

const token =
localStorage.getItem("token");

const Notification = () => {

  const navigate =
  useNavigate();

  const [
    notification,
    setNotification
  ] = useState([]);

  useEffect(() => {

    getNotification();

  }, []);

  /*
  =========================
  GET NOTIFICATIONS
  =========================
  */

  const getNotification =
  async () => {

    try {

      const res =
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/get-all`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNotification(
        res.data.notifications
      );

    } catch (err) {

      console.error(err);

    }

  };

  /*
  =========================
  FOLLOW BACK
  =========================
  */

  const followBack =
  async (senderId) => {

    try {

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/add-follow/${senderId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      /*
      refresh notifications
      */

      getNotification();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="nahideaNotificationPage">

      <h1>
        Notifications
      </h1>

      {
        notification.map((item) => (

          <div
            key={item.id}
            className="nahideaNotificationCard"
          >

            {/* CONTENT */}

            <div
              className="nahideaNotificationContent"
              onClick={() => {

                /*
                only navigate if post exists
                */

                if (
                  item.post_id
                ) {

                  navigate(
                    `/aboutpost/${item.post_id}#${item.comment_id}`
                  );

                }

              }}
            >

              <p>
                {item.content}
              </p>

            </div>

            {/* FOLLOW BUTTON */}

            {
              item.type === "follow"
              && (
                <button
                  className="nahideaFollowBackBtn"
                  onClick={(e) => {

                    e.stopPropagation();

                    followBack(
                      item.sender_id
                    );

                  }}
                >
                  Follow Back
                </button>
              )
            }

            {
              item.type ===
              "follow_back"
              && (
                <div className="nahideaMutualBadge">

                  Friends

                </div>
              )
            }

          </div>

        ))
      }

    </div>

  );

};

export default Notification;