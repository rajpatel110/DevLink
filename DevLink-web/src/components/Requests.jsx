import axios from "axios";
import { useEffect, useState } from "react";

import { BASE_URL } from "../utils/constants";


const Requests = () => {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch received requests
    const getRequests = async () => {

        try {

            const res = await axios.get(
                BASE_URL + "/user/requests/received",
                {
                    withCredentials: true
                }
            );

            console.log(
                "Received requests:",
                res.data
            );

            setRequests(res.data.data);

        } catch (error) {

            console.error(
                "Error fetching requests:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getRequests();

        // eslint-disable-next-line react-hooks/set-state-in-effect

    }, []);


    // Accept / Reject
    const handleReview = async (
        status,
        requestId
    ) => {

        try {

            await axios.post(
                BASE_URL +
                `/request/review/${status}/${requestId}`,
                {},
                {
                    withCredentials: true
                }
            );


            // Remove request from UI
            setRequests((prevRequests) =>
                prevRequests.filter(
                    (request) =>
                        request._id !== requestId
                )
            );

        } catch (error) {

            console.error(
                "Error reviewing request:",
                error.response?.data || error
            );

        }

    };


    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-screen">

                <span className="loading loading-spinner loading-lg"></span>

            </div>

        );

    }


    if (requests.length === 0) {

        return (

            <div className="flex justify-center items-center min-h-screen">

                <h2 className="text-2xl font-bold">

                    No connection requests

                </h2>

            </div>

        );

    }


    return (

        <div className="min-h-screen p-10">

            <h1 className="text-3xl font-bold text-center mb-8">

                Connection Requests

            </h1>


            <div className="flex flex-wrap justify-center gap-6">

                {requests.map((request) => {

                    const user = request.fromUserId;


                    return (

                        <div
                            key={request._id}
                            className="card w-80 bg-base-300 shadow-xl"
                        >

                            {/* Photo */}
                            <figure>

                                <img
                                    src={user.photoUrl}
                                    alt="Profile"
                                    className="w-full h-64 object-cover"
                                />

                            </figure>


                            <div className="card-body">

                                {/* Name */}
                                <h2 className="card-title">

                                    {user.firstName}{" "}
                                    {user.lastName}

                                    {user.age &&
                                        `, ${user.age}`}

                                </h2>


                                {/* Gender */}
                                {user.gender && (

                                    <p className="text-sm opacity-70">

                                        {user.gender}

                                    </p>

                                )}


                                {/* About */}
                                <p>

                                    {user.about}

                                </p>


                                {/* Skills */}
                                {user.Skills &&
                                    user.Skills.length > 0 && (

                                        <div className="flex flex-wrap gap-2">

                                            {user.Skills.map(
                                                (skill, index) => (

                                                    <span
                                                        key={index}
                                                        className="badge badge-primary"
                                                    >
                                                        {skill}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}


                                {/* Buttons */}
                                <div className="flex justify-center gap-3 mt-4">

                                    <button
                                        className="btn btn-success"
                                        onClick={() =>
                                            handleReview(
                                                "accepted",
                                                request._id
                                            )
                                        }
                                    >
                                        Accept
                                    </button>


                                    <button
                                        className="btn btn-error"
                                        onClick={() =>
                                            handleReview(
                                                "rejected",
                                                request._id
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

};


export default Requests;