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
                let csv = fileReader.result;
                let lines = csv.split("\n");
                let result = [];
                let headers = lines[0].split(",");
                for (let i = 1; i < lines.length; i++) {
                    let obj = {};
                    let currentline = lines[i].split(",");
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                //return result; //JavaScript object
                result = JSON.stringify(result); //JSON
                console.log(result);
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
