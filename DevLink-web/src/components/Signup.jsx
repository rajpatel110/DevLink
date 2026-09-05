import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            setError("");
            setLoading(true);

            await axios.post(
                BASE_URL + "/signup",
                {
                    firstName,
                    lastName,
                    emailId: email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            // Signup doesn't log the user in so send them to Login 
            navigate("/login", {
                state: { signupSuccess: true }
            });

        } catch (err) {
            console.error("Signup error:", err.response?.data || err);

            setError(
                err.response?.data?.replace("error saving the user. ", "") ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">

            <div className="card w-96 bg-base-300 shadow-2xl">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center mb-4">
                        👻 DevLink
                    </h2>

                    <p className="text-center text-sm text-gray-400 mb-4">
                        Create your account
                    </p>

                    {/* First Name */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text font-medium">
                                First Name
                            </span>
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            placeholder="Enter your first name"
                            className="input input-bordered w-full"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text font-medium">
                                Last Name
                            </span>
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            placeholder="Enter your last name"
                            className="input input-bordered w-full"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text font-medium">
                                Email ID
                            </span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="form-control mb-2">
                        <label className="label">
                            <span className="label-text font-medium">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <p className="text-xs text-gray-400 mb-4">
                        Must be 8+ characters with uppercase, lowercase, a number, and a symbol.
                    </p>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </p>
                    )}

                    {/* Signup button */}
                    <button
                        className="btn btn-primary w-full"
                        disabled={loading}
                        onClick={handleSignup}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>

                    <div className="divider">
                        OR
                    </div>

                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary cursor-pointer font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Signup;