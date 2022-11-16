import { CssBaseline, Stack } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Canvas from "./Canvas";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./LandingPage";
import Login from "./Firebase/login";
import SignUp from "./Firebase/signup";

function App() {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/trialCanvas"
                        element={
                            <>
                                <CssBaseline />
                                <Stack direction="row">
                                    <Canvas />
                                    <Sidebar />
                                </Stack>
                            </>
                        }
                    />
                </Routes>
            </HashRouter>
        </>
    );
}

export default App;
