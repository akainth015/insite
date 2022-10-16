import React, { useEffect, useState } from "react";
import { Handle, useNodes } from "reactflow";
import { Box, Typography } from "@mui/material";

export default function TableDisplayNode(data) {
    const [inputData, setInputData] = useState(data.inputData);
    const nodes = useNodes();

    useEffect(() => {
        const thisNode = nodes.find((node) => node.id === data.id);
        if (thisNode.data.inputData) {
            setInputData(thisNode.data.inputData.slice(0, 10));
        }
    }, [nodes]);

    const onConnect = (params) => {
        const source = nodes.find((node) => node.id === params.source);
        setInputData(source.data.outputData.slice(0, 10));
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h7">Table Node</Typography>
                {inputData !== undefined && (
                    <table>
                        <tbody>
                            <tr key={"header"}>
                                {Object.keys(inputData[0]).map((key) => (
                                    <th>{key}</th>
                                ))}
                            </tr>
                            {inputData.map((item) => (
                                <tr key={item[1]}>
                                    {Object.values(item).map((val) => (
                                        <td>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Box>
            <Handle
                type="target"
                position="left"
                id="input_data"
                style={{ top: 10, background: "#555" }}
                onConnect={(params) => onConnect(params)}
                isConnectable="true"
            />
        </>
    );
}
