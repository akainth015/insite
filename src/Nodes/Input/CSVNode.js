import { useOutput } from "../nodes";
import React from "react";
import { Box, Typography } from "@mui/material";

export default function CSVNode() {
    const [output, setOutput, outputHandle] = useOutput("Output", "object[], object", null);
    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        fileReader.onload = function (e) {
            let csv = fileReader.result;
            // Replace \r\n and \r with \n
            csv = csv.replaceAll("\r\n", "\n");
            csv = csv.replaceAll("\r", "\n");
            let lines = csv.split("\n");
            let result = [];
            let headers = lines[0].split(",");
            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                let currentline = splitCsv(lines[i]);

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            //return result; //JavaScript object
            setOutput(result);
            result = JSON.stringify(result); //JSON
        };
        fileReader.readAsText(file);
    };

    function splitCsv(str) {
        return str.split(",").reduce(
            (accum, curr) => {
                if (accum.isConcatting) {
                    accum.soFar[accum.soFar.length - 1] += "," + curr;
                } else {
                    accum.soFar.push(curr);
                }
                if (curr.split('"').length % 2 === 0) {
                    accum.isConcatting = !accum.isConcatting;
                }
                return accum;
            },
            { soFar: [], isConcatting: false }
        ).soFar;
    }

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
                </form>
            </Box>
            {outputHandle}
        </>
    );
}
