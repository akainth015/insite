import { CssBaseline, Stack } from "@mui/material";
import "./App.css";
import Canvas from "./Canvas";
import Sidebar from "./Components/Sidebar";
import SocketProvider from "./Nodes/SocketProvider";

function App() {
    return (
        <>
            <SocketProvider>
                <CssBaseline />
                <Stack direction="row">
                    <Canvas />
                    <Sidebar />
                </Stack>
            </SocketProvider>
        </>
    );
}

export default App;
