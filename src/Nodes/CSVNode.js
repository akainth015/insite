import React, { useState } from "react";
import { Handle, useReactFlow } from "reactflow";
import { Box, Typography } from "@mui/material";

export default function CSVNode(data) {
    const [file, setFile] = useState(null);
    const [thisData, setThisData] = useState(undefined);
    const flowInstance = useReactFlow();
    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    // I want to set the outputData of this node in nodes to the data from the file
    const setData = (fileData) => {
        const nodes = flowInstance.getNodes();
        const thisNode = nodes.find((node) => node.id === data.id);
        thisNode.data.outputData = fileData;
        setThisData(fileData);
        if (thisNode.data.target !== null) {
            const targetNode = nodes.find((node) => node.id === thisNode.data.target);
            targetNode.data.inputData = fileData;
            targetNode.data.toUpdate = true;
        }

        flowInstance.setNodes(nodes);
    };

    // I want to set the inputData of the targetNode to data
    const onConnect = (params) => {
        const nodes = flowInstance.getNodes();
        const targetNode = nodes.find((node) => node.id === params.target);
        const sourceNode = nodes.find((node) => node.id === params.source);

        targetNode.data.source = params.source;
        targetNode.data.inputData = thisData;
        targetNode.data.toUpdate = true;
        sourceNode.data.target = params.target;

        flowInstance.setNodes(nodes);
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
                    let currentline = splitCsv(lines[i]);

                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                //return result; //JavaScript object
                setData(result);
                console.log(result);
                result = JSON.stringify(result); //JSON
            };
            fileReader.readAsText(file);
        }
    };

    function splitCsv(str) {
        return str.split(",").reduce(
            (accum, curr) => {
                if (accum.isConcatting) {
                    accum.soFar[accum.soFar.length - 1] += "," + curr;
                } else {
                    accum.soFar.push(curr);
                }
                if (curr.split('"').length % 2 == 0) {
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
                    <button onClick={handleOnSubmit}>Import CSV</button>
                </form>
            </Box>
            <Handle
                type="source"
                position="right"
                id="data"
                style={{ top: 10, background: "#555" }}
                onConnect={(params) => onConnect(params)}
                isConnectable="true"
            />
        </>
    );
}
