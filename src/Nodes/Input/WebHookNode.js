import { useContext, useEffect } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { NodeIdContext, useOutput } from "../nodes";
import { backendUrl, useSocketIoChannel } from "../../backend";

function WebHookNode() {
    const [, addActivationListener] = useSocketIoChannel("web-hook");
    const [, setData, dataHandle] = useOutput("Callback Payload", "object", null);
    const [, setLastActivated, activationHandle] = useOutput("Last Activated", null);
    const nodeId = useContext(NodeIdContext);

    useEffect(() => {
        return addActivationListener((event) => {
            const activationTime = new Date();
            setLastActivated(activationTime);
            setData(event);
        });
    }, [addActivationListener, setData, setLastActivated]);

    return (
        <Paper sx={{ padding: 2 }}>
            <Stack alignItems={"center"} direction={"row"} spacing={2}>
                <Typography>Your web-hook is available.</Typography>
                <Button
                    className={"nodrag"}
                    variant={"outlined"}
                    startIcon={<ContentCopy />}
                    onClick={() => navigator.clipboard.writeText(`${backendUrl}/hooks/${nodeId}`)}
                >
                    Copy URL
                </Button>
            </Stack>
            {activationHandle}
            {dataHandle}
        </Paper>
    );
}

export default WebHookNode;
