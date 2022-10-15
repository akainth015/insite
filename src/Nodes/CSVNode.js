import React, { useState } from "react";
import { Handle } from "reactflow";
import { Box, Typography } from "@mui/material";

export default function CSVNode() {
    const [file, setFile] = useState(null);
    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (file) {
            fileReader.onload = function (e) {
                const csvOutput = e.target.result;
                console.log(csvOutput);
            };
            fileReader.readAsText(file);
        }
    };

    return (
        <>
            <Box
                sx={{
                    width: 190,
                    height: 80,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    alignItems: "center",
                    alignText: "center",
                }}
            >
                <Typography variant="h7">CSV Node</Typography>
                <form>
                    <input type="file" id="csvFile" name="csvFile" accept=".csv" onChange={onFileChange} />
                    <button onClick={handleOnSubmit}>Import CSV</button>
                </form>
            </Box>
            <Handle
                type="source"
                position="right"
                id="a"
                style={{ top: 10, background: "#555" }}
                isConnectable="true"
            />
        </>
    );
}
