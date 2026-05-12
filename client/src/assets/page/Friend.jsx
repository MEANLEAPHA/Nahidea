import { useState } from "react";

import axios from "axios";

import "../style/page/Friend.css";



// follow
export default function FollowButton({

    userId,

    initialState

}) {

    const [status, setStatus] =
        useState(initialState);

    const [loading, setLoading] =
        useState(false);



    const handleFollow = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const res = await axios.post(

                `${import.meta.env.VITE_SERVER_URL}/${userId}`,

                {},

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setStatus(res.data.status);

        } catch (err) {

            alert(
                err.response?.data?.message
            );

        } finally {

            setLoading(false);

        }

    };



    const handleUnfollow = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            await axios.delete(

                `http://localhost:5000/api/follows/${userId}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setStatus(null);

        } catch (err) {

            alert(
                err.response?.data?.message
            );

        } finally {

            setLoading(false);

        }

    };



    return (

        <button

            className="follow-btn"

            disabled={loading}

            onClick={
                status
                    ? handleUnfollow
                    : handleFollow
            }

        >

            {
                loading
                    ? "Loading..."
                    : status === "accepted"
                    ? "Following"
                    : status === "pending"
                    ? "Requested"
                    : "Follow"
            }

        </button>

    );

}



// follow request
export default function FollowRequestCard({

    request,

    onAccept

}) {

    const accept = async () => {

        const token =
            localStorage.getItem("token");

        await axios.post(

            `${import.meta.env.VITE_SERVER_URL}/api/follows/accept/${request.id}`,

            {},

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        onAccept(request.id);

    };



    return (

        <div className="request-card">

            <img
                src={request.avatar}
                alt=""
                className="avatar"
            />

            <div className="request-info">

                <h4>
                    {request.username}
                </h4>

                <p>
                    requested to follow you
                </p>

            </div>

            <button
                className="accept-btn"
                onClick={accept}
            >
                Accept
            </button>

        </div>

    );

}