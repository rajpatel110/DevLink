import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Body from "./components/Body";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Requests from "./components/Requests";
import Connections from "./components/Connections";

import { Provider } from "react-redux";
import appStore from "./utils/appStore";


function App() {

    return (

        <Provider store={appStore}>

            <BrowserRouter basename="/">

                <Routes>

                    <Route
                        path="/"
                        element={<Body />}
                    >

                        <Route
                            path="Feed"
                            element={<Feed />}
                        />

                        <Route
                            path="login"
                            element={<Login />}
                        />

                        <Route
                            path="signup"
                            element={<Signup />}
                        />

                        <Route
                            path="forgot-password"
                            element={<ForgotPassword />}
                        />

                        <Route
                            path="reset-password/:token"
                            element={<ResetPassword />}
                        />

                        <Route
                            path="profile"
                            element={<Profile />}
                        />

                        <Route
                            path="requests"
                            element={<Requests />}
                        />

                        <Route
                            path="connections"
                            element={<Connections />}
                        />

                    </Route>

                </Routes>

            </BrowserRouter>

        </Provider>

    );

}


export default App;