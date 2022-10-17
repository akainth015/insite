import React, { useEffect, useState } from "react";
import { Handle, useNodes, useEdges, useReactFlow } from "reactflow";
import { Box, Typography } from "@mui/material";
import Waiting from "../Components/Waiting";

export default function TableDisplayNode(data) {
    const [inputData, setInputData] = useState(data.inputData);
    const flowInstance = useReactFlow();
    const nodes = useNodes();
    const edges = useEdges();

    useEffect(() => {
        const thisNode = nodes.find((node) => node.id === data.id);
        if (thisNode.data.toUpdate) {
            const thisNode = nodes.find((node) => node.id === data.id);
            if (thisNode.data.inputData) {
                setInputData(thisNode.data.inputData.slice(0, 10));
            }
            thisNode.data.toUpdate = false;
            flowInstance.setNodes(nodes);
        }
    }, [data, flowInstance, nodes]);

    const onConnect = (params) => {
        const source = nodes.find((node) => node.id === params.source);
        const target = nodes.find((node) => node.id === params.target);
        source.data.target = params.target;
        target.data.source = params.source;
        if (source.data.outputData) {
            setInputData(source.data.outputData.slice(0, 10));
        }

        flowInstance.setNodes(nodes);
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
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h7">Table Node</Typography>

                {inputData ? (
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
                ) : (
                    <Waiting />
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
