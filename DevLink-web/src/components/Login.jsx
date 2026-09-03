import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Login = () => {
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogin = async() => {
        try{
            const res = await axios.post(BASE_URL + "/login",{
            emailId: email,
            password: password
        },{withCredentials:true});
        console.log(res.data);
        dispatch(addUser(res.data));
        return navigate("/Feed");
    }
        catch(err){
            console.log(err);
        }
    };

return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
    <div className="card w-96 bg-base-300 shadow-2xl">
        <div className="card-body">
        <h2 className="text-3xl font-bold text-center mb-4">👻 DevLink</h2>
        <p className="text-center text-sm text-gray-400 mb-4">
            Login to continue
        </p>

        <div className="form-control mb-4">
            <label className="label">
            <span className="label-text font-medium">Email ID</span>
            </label>
            <input
            type="email"
            value={email}
            placeholder="Enter your email"
            className="input input-bordered w-full"
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="form-control mb-6">
            <label className="label">
            <span className="label-text font-medium">Password</span>
            </label>
            <input
            type="password"
            value={password}
            placeholder="Enter your password"
            className="input input-bordered w-full"
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button className="btn btn-primary w-full" onClick={handleLogin}>
            Login
        </button>

        <div className="divider">OR</div>

        <p className="text-center text-sm">
            Don't have an account?{" "}
            <span className="text-primary cursor-pointer font-semibold hover:underline">
            Sign Up
            </span>
        </p>
        </div>
    </div>
    </div>
);
};

export default Login;