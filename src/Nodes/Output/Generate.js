import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CircularProgress, TextField } from "@mui/material";
import { useInput } from "../nodes";
import { backendUrl, useSocketIoChannel } from "../../backend";

function Generate() {
    const [textInput, TIHandle] = useInput("Text Input", "any");
    const [currentText, setCurrentText] = useState("");
    const [data, setData] = useState(null);
    const [changed, setChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emitOnChannel, addActivationListener] = useSocketIoChannel("generate");

    useEffect(() => {
        if (textInput !== null) {
            if (typeof textInput !== "string") {
                setData(JSON.stringify(textInput));
                setChanged(true);
                return;
            }
            setCurrentText(currentText);
            setChanged(true);
        }
    }, []);

    useEffect(() => {
        return addActivationListener((data) => {
            setCurrentText(currentText + data);
            setLoading(false);
        });
    }, [addActivationListener, currentText]);

    useEffect(() => {
        setChanged(true);
    }, [textInput]);

    const onSubmit = () => {
        setLoading(true);
        if (data) {
            emitOnChannel({ text: currentText + " " + data });
            return;
        }
        emitOnChannel({ text: currentText });
    };

    return (
        <Card
            sx={{
                padding: "20px",
            }}
        >
            <Typography>This is your input: </Typography>
            <TextField
                value={currentText}
                label="Content"
                onChange={(e) => setCurrentText(e.target.value)}
                fullWidth
                multiline
            />
            {changed && <Button onClick={onSubmit}>Generate!</Button>}
            {loading && (
                <>
                    <Typography>Generating...</Typography>
                    <CircularProgress />
                </>
            )}
            {TIHandle}
        </Card>
    );
}

export default Generate;
