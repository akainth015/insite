import { CssBaseline, Stack } from '@mui/material';
import './App.css';
import Canvas from './Canvas';
import Sidebar from './Components/Sidebar';

function App() {
    return (
        <>
            <CssBaseline/>
            <Stack direction = "row">
                <Canvas/>
                <Sidebar/>
            </Stack>
        </>
    );
}

export default App;
