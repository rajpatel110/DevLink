import axios from "axios";
import { useEffect, useState } from "react";

import { BASE_URL } from "../utils/constants";


const Connections = () => {

    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);


    const getConnections = async () => {

        try {

            const res = await axios.get(
                BASE_URL + "/user/connections",
                {
                    withCredentials: true
                }
            );

            console.log(
                "Connections:",
                res.data
            );

            setConnections(res.data.data);

        } catch (error) {

            console.error(
                "Error fetching connections:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getConnections();

        // eslint-disable-next-line react-hooks/set-state-in-effect

    }, []);


    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-screen">

                <span className="loading loading-spinner loading-lg"></span>

            </div>

        );

    }


    if (connections.length === 0) {

        return (

            <div className="flex justify-center items-center min-h-screen">

                <h2 className="text-2xl font-bold">

                    You have no connections yet.

                </h2>

            </div>

        );

    }


    return (

        <div className="min-h-screen p-10">

            <h1 className="text-3xl font-bold text-center mb-8">

                My Connections

            </h1>


            <div className="flex flex-wrap justify-center gap-6">

                {connections.map((user) => (

                    <div
                        key={user._id}
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
                            {user.about && (

                                <p>

                                    {user.about}

                                </p>

                            )}


                            {/* Skills */}
                            {user.Skills &&
                                user.Skills.length > 0 && (

                                    <div className="flex flex-wrap gap-2 mt-2">

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

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};


export default Connections;