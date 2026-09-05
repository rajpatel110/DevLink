import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [resetUrl, setResetUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setError("");
            setResetUrl("");
            setLoading(true);

            const res = await axios.post(
                BASE_URL + "/forgotPassword",
                { emailId: email }
            );

            setResetUrl(res.data.resetUrl);

        } catch (err) {
            console.error("Forgot password error:", err);
            setError(
                err.response?.data || "Something went wrong. Please try again."
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
                        Enter your email to get a reset link
                    </p>

                    <div className="form-control mb-4">
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

                    {resetUrl && (
                        <div className="alert alert-success text-sm mb-4 break-all">
                            <span>
                                Reset link (email sending isn't set up yet, so it's shown here directly):
                                <br />
                                
                                    href={resetUrl}
                                    className="link link-primary"
                                >
                                    {resetUrl}
                                </a>
                            </span>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </p>
                    )}

                    <button
                        className="btn btn-primary w-full"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Generating..." : "Get Reset Link"}
                    </button>

                    <div className="divider">
                        OR
                    </div>

                    <p className="text-center text-sm">
                        <Link
                            to="/login"
                            className="text-primary cursor-pointer font-semibold hover:underline"
                        >
                            Back to Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;