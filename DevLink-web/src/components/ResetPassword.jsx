import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        try {
            setError("");

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            setLoading(true);

            await axios.post(
                BASE_URL + `/resetPassword/${token}`,
                { password }
            );

            navigate("/login", {
                state: { passwordResetSuccess: true }
            });

        } catch (err) {
            console.error("Reset password error:", err);
            setError(
                err.response?.data?.replace("Error: ", "") ||
                "Something went wrong. The link may have expired."
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
                        Choose a new password
                    </p>

                    <div className="form-control mb-3">
                        <label className="label">
                            <span className="label-text font-medium">
                                New Password
                            </span>
                        </label>

                        <input
                            type="password"
                            value={password}
                            placeholder="Enter new password"
                            className="input input-bordered w-full"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-control mb-2">
                        <label className="label">
                            <span className="label-text font-medium">
                                Confirm Password
                            </span>
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm new password"
                            className="input input-bordered w-full"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <p className="text-xs text-gray-400 mb-4">
                        Must be 8+ characters with uppercase, lowercase, a number, and a symbol.
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </p>
                    )}

                    <button
                        className="btn btn-primary w-full"
                        disabled={loading}
                        onClick={handleReset}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;