import {useEffect} from "react";
import {Card, CardContent} from "@mui/material";
import {useOutput} from "./nodes";

function getCurrentTimeString() {
    return new Date().toTimeString();
}

function ClockNode({id}) {
    const [timeString, setTimeString, timeHandle] = useOutput("Time", "text", getCurrentTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeString(getCurrentTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, [setTimeString]);

    return (
        <Card>
            <CardContent>
                {timeString}
            </CardContent>
            {timeHandle}
        </Card>
    );
}

export default ClockNode;
