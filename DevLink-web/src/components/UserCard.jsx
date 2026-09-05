import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user, onIgnore, onInterested }) => {

    const [requestSent, setRequestSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleInterested = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            const res = await axios.post(
                BASE_URL + `/request/send/interested/${user._id}`,
                {},
                {
                    withCredentials: true
                }
            );

            console.log("Interested response:", res.data);

            setRequestSent(true);

            // brief "Request Sent" flash, then move to next card
            setTimeout(() => {
                onInterested();
            }, 600);

        } catch (error) {
            console.error(
                "Error sending interested request:",
                error.response?.data || error
            );
            setErrorMsg(
                error.response?.data?.message || "Could not send request"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleIgnore = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            const res = await axios.post(
                BASE_URL + `/request/send/ignore/${user._id}`,
                {},
                {
                    withCredentials: true
                }
            );

            console.log("Ignore response:", res.data);

            // Move to next user
            onIgnore();

        } catch (error) {
            console.error(
                "Error ignoring user:",
                error.response?.data || error
            );
            setErrorMsg(
                error.response?.data?.message || "Could not skip user"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card w-96 bg-base-300 shadow-2xl">

            {/* Profile Image */}
            <figure>
                <img
                    src={user.photoUrl}
                    alt="User profile"
                    className="w-full h-80 object-cover"
                />
            </figure>

            <div className="card-body">

                {/* Name + Age */}
                <h2 className="card-title text-2xl">
                    {user.firstName} {user.lastName}
                    {user.age && `, ${user.age}`}
                </h2>

                {/* Gender */}
                {user.gender && (
                    <p className="text-sm opacity-70">
                        {user.gender}
                    </p>
                )}

                {/* About */}
                {user.about && (
                    <p className="mt-2">
                        {user.about}
                    </p>
                )}

                {/* Skills */}
                {user.Skills && user.Skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">

                        {user.Skills.map((skill, index) => (
                            <span
                                key={index}
                                className="badge badge-primary"
                            >
                                {skill}
                            </span>
                        ))}

                    </div>
                )}

                {/* Error message, if the last action failed */}
                {errorMsg && (
                    <p className="text-error text-sm mt-2">
                        {errorMsg}
                    </p>
                )}

                {/* Buttons */}
                <div className="card-actions justify-center mt-5">

                    {/* Ignore */}
                    <button
                        className="btn btn-error"
                        disabled={loading}
                        onClick={handleIgnore}
                    >
                        Ignore
                    </button>

                    {/* Interested */}
                    {requestSent ? (

                        <button
                            className="btn btn-success"
                            disabled
                        >
                            ✓ Request Sent
                        </button>

                    ) : (

                        <button
                            className="btn btn-primary"
                            disabled={loading}
                            onClick={handleInterested}
                        >
                            Interested
                        </button>

                    )}

                </div>

            </div>
        </div>
    );
};

export default UserCard;