import {Handle, Position} from 'reactflow';
import {useState} from "react";
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {ContentCopy} from "@mui/icons-material";

function WebHookNode() {
    const [webHookStatus, setWebHookStatus] = useState("STARTING");

    let statusText;
    switch (webHookStatus) {
        case "STARTING":
            statusText = "Your web-hook is starting...";
            break;
        case "STARTED":
            statusText = "Your web-hook is available.";
            break;
        default:
            console.error("The web-hook component is in an illegal state");
            break;
    }

    return (
        <Card>
            <CardContent>
                <Stack alignItems={"center"} direction={"row"} spacing={2}>
                    <Typography>
                        {statusText}
                    </Typography>
                    {
                        webHookStatus === "STARTED" ?
                            <Button className={"nodrag"} variant={"outlined"} startIcon={<ContentCopy/>}>
                                Copy URL
                            </Button> : null
                    }
                </Stack>
            </CardContent>
            <Handle id={"hits"} type="source" position={Position.Bottom}/>
        </Card>
    );
}

export default WebHookNode;
