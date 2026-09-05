import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {

    const feed = useSelector((store) => store.feed);

    const dispatch = useDispatch();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false);

    const getFeed = async () => {

        if (feed) return;

        try {

            const res = await axios.get(
                BASE_URL + "/feed",
                {
                    withCredentials: true
                }
            );

            console.log("Feed response:", res.data);

            dispatch(addFeed(res.data.data));

        } catch (error) {

            console.error("Error fetching feed:", error);

            setError(true);
        }
    };

    useEffect(() => {
        getFeed();
    }, []);

    // Error
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h2 className="text-2xl font-bold text-red-500">
                    Error loading feed
                </h2>
            </div>
        );
    }

    // Loading
    if (!feed) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // No more users
    if (feed.length === 0 || currentIndex >= feed.length) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h2 className="text-2xl font-bold">
                    No more users available.
                </h2>
            </div>
        );
    }

    const currentUser = feed[currentIndex];

    // Move to next user
    const handleNext = () => {
        setCurrentIndex(currentIndex + 1);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">

            <div className="flex items-center gap-5">

                {/* Current User Card */}
                <UserCard
                    key={currentUser._id}
                    user={currentUser}
                    onIgnore={handleNext}
                    onInterested={handleNext}
                />

                {/* Next Button */}
                {currentIndex < feed.length - 1 && (
                    <button
                        onClick={handleNext}
                        className="btn btn-circle btn-lg"
                    >
                        →
                    </button>
                )}

            </div>

        </div>
    );
};

export default Feed;