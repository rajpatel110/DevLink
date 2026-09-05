import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const signupSuccess = location.state?.signupSuccess;
    const passwordResetSuccess = location.state?.passwordResetSuccess;

        const handleLogin = async () => {
        try {
            // Clear previous error
            setError("");

            const res = await axios.post(
                BASE_URL + "/login",
                {
                    emailId: email,
                    password: password
                },
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            dispatch(addUser(res.data));

            navigate("/Feed");

        } catch (err) {
            console.log(err);

            setError(
                err.response?.data?.replace("Error: ", "") ||
                "Something went wrong. Please try again."
            );
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
                        Login to continue
                    </p>

                    {signupSuccess && (
                        <p className="text-success text-sm text-center mb-4">
                            Account created! Please log in.
                        </p>
                    )}

                    {passwordResetSuccess && (
                        <p className="text-success text-sm text-center mb-4">
                            Password reset! Please log in with your new password.
                        </p>
                    )}

                    {/* Email */}
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

                    <p className="text-right text-sm mb-4">
                        <Link
                            to="/forgot-password"
                            className="text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </p>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </p>
                    )}

                    {/* Login button */}
                    <button
                        className="btn btn-primary w-full"
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                    <div className="divider">
                        OR
                    </div>

                    <p className="text-center text-sm">
                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="text-primary cursor-pointer font-semibold hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;