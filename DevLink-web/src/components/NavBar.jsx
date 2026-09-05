import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";


const NavBar = () => {

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [requestCount, setRequestCount] = useState(0);


    // Get number of pending connection requests
    const getRequests = async () => {

        if (!user) {
            setRequestCount(0);
            return;
        }

        try {

            const res = await axios.get(
                BASE_URL + "/user/requests/received",
                {
                    withCredentials: true
                }
            );

            setRequestCount(res.data.data.length);

        } catch (error) {

            console.error(
                "Error fetching request count:",
                error
            );

        }
    };


    useEffect(() => {

        getRequests();

        // ESLint warning because getRequests updates state
        // eslint-disable-next-line react-hooks/set-state-in-effect

    }, [user]);


    // Logout
    const handleLogout = async () => {

        try {

            await axios.post(
                BASE_URL + "/logout",
                {},
                {
                    withCredentials: true
                }
            );

        } catch (error) {

            console.error("Logout error:", error);

        } finally {

            // Clear Redux state
            dispatch(removeUser());
            dispatch(removeFeed());

            navigate("/login");

        }
    };


    return (

        <div className="navbar bg-base-300 shadow-sm">

            {/* Logo */}
            <div className="flex-1">

                <Link
                    to="/Feed"
                    className="btn btn-ghost text-xl"
                >
                    👻DevLink
                </Link>

            </div>


            {/* Right side */}
            <div className="flex gap-2 items-center">

                {user && (

                    <>

                        {/* Welcome */}
                        <p className="font-medium">

                            Welcome, {user.firstName}

                        </p>


                        {/* Profile dropdown */}
                        <div className="dropdown dropdown-end mx-5">

                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >

                                <div className="w-10 rounded-full">

                                    <img
                                        alt="Profile"
                                        src={user.photoUrl}
                                    />

                                </div>

                            </div>


                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-60 p-2 shadow"
                            >

                                {/* Profile */}
                                <li>

                                    <Link to="/profile">

                                        Profile

                                    </Link>

                                </li>


                                {/* Connections */}
                                <li>

                                    <Link to="/connections">

                                        Connections

                                    </Link>

                                </li>


                                {/* Connection Requests */}
                                <li>

                                    <Link
                                        to="/requests"
                                        className="justify-between"
                                    >

                                        Connection Requests

                                        {requestCount > 0 && (

                                            <span className="badge badge-error">

                                                {requestCount}

                                            </span>

                                        )}

                                    </Link>

                                </li>


                                {/* Logout */}
                                <li>

                                    <button
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>

                                </li>

                            </ul>

                        </div>

                    </>

                )}

            </div>

        </div>

    );
};

export default NavBar;