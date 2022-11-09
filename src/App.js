import { CssBaseline, Stack } from "@mui/material";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import Canvas from "./Canvas";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./LandingPage";

function App() {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
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
