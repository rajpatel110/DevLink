import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [age, setAge] = useState(user?.age || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [about, setAbout] = useState(user?.about || "");
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");

    const [skills, setSkills] = useState(
        user?.Skills ? user.Skills.join(", ") : ""
    );

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

        const handleSaveProfile = async () => {
        try {
            setError("");
            setMessage("");

            const skillsArray = skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0);

            const payload = {
                firstName,
                lastName,
                gender,
                about,
                photoUrl,
                Skills: skillsArray
            };

            if (age !== "") {
                payload.age = Number(age);
            }

            const res = await axios.patch(
                BASE_URL + "/profile/edit",
                payload,
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            // Update Redux with latest user data
            dispatch(addUser(res.data));

            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Error updating profile"
            );
        }
    };

    return (
        <div className="flex justify-center my-10">

            <div className="card w-96 bg-base-300 shadow-2xl">

                <div className="card-body">

                    <h2 className="text-2xl font-bold text-center mb-5">
                        Edit Profile
                    </h2>

                    {/* First Name */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">
                                First Name
                            </span>
                        </label>

                        <input
                            type="text"
                            value={firstName}
                            className="input input-bordered"
                            onChange={(e) =>
                                setFirstName(e.target.value)
                            }
                        />
                    </div>

                    {/* Last Name */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">
                                Last Name
                            </span>
                        </label>

                        <input
                            type="text"
                            value={lastName}
                            className="input input-bordered"
                            onChange={(e) =>
                                setLastName(e.target.value)
                            }
                        />
                    </div>

                    {/* Age */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">
                                Age
                            </span>
                        </label>

                        <input
                            type="number"
                            value={age}
                            className="input input-bordered"
                            onChange={(e) =>
                                setAge(e.target.value)
                            }
                        />
                    </div>

                    {/* Gender */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">
                                Gender
                            </span>
                        </label>

                        <select
                            value={gender}
                            className="select select-bordered"
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        >
                            <option value="">
                                Select Gender
                            </option>

                            <option value="male">
                                Male
                            </option>

                            <option value="female">
                                Female
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* About */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">
                                About
                            </span>
                        </label>

                        <textarea
                            value={about}
                            className="textarea textarea-bordered h-24"
                            onChange={(e) =>
                                setAbout(e.target.value)
                            }
                        />
                    </div>

                    {/* Photo URL */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text">
                                Photo URL
                            </span>
                        </label>

                        <input
                            type="text"
                            value={photoUrl}
                            className="input input-bordered"
                            onChange={(e) =>
                                setPhotoUrl(e.target.value)
                            }
                        />
                    </div>

                    {/* Skills */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">
                                Skills
                            </span>
                        </label>

                        <input
                            type="text"
                            value={skills}
                            placeholder="Java, React, Node.js"
                            className="input input-bordered"
                            onChange={(e) =>
                                setSkills(e.target.value)
                            }
                        />

                        <label className="label">
                            <span className="label-text-alt opacity-70">
                                Separate skills with commas
                            </span>
                        </label>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <p className="text-success text-center mb-3">
                            {message}
                        </p>
                    )}

                    {/* Error Message */}
                    {error && (
                        <p className="text-error text-center mb-3">
                            {error}
                        </p>
                    )}

                    {/* Save Button */}
                    <button
                        className="btn btn-primary w-full"
                        onClick={handleSaveProfile}
                    >
                        Save Profile
                    </button>

                </div>
            </div>

        </div>
    );
};

export default EditProfile;