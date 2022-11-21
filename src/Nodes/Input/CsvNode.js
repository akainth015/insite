import { useOutput } from "../nodes";
import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import Papa from "papaparse";
import FileInput from "../../Components/FileInput";

const FILE_INDEX = 0;

export default function CsvNode() {
    const [, setOutput, outputHandle] = useOutput("Data", "table", null);
    const [csvFile, setCsvFile] = useState(null);

    const getFile = (files) => {
        const file = files[FILE_INDEX] || null;
        setCsvFile(file);
    };

    useEffect(() => {
        if (csvFile !== null) {
            Papa.parse(csvFile, {
                dynamicTyping: true,
                header: true,
                complete(results) {
                    const { errors, data, meta } = results;

                    let wereErrors = errors.length > 0;
                    if (wereErrors) {
                        console.warn(`Errors were encountered while parsing ${csvFile.name}`, errors);
                    }

                    data.columns = meta.fields;
                    setOutput(data);
                },
            });
        }
    }, [csvFile, setOutput]);

    return (
        <>
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                <Typography align="center" mb={1}>
                    CSV File Input
                </Typography>
                <FileInput accept="text/csv,.csv" onChange={getFile} />
            </Paper>
            {outputHandle}
        </>
    );
}
