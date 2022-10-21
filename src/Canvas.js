import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, { addEdge, Background, Controls, useEdgesState, useNodesState, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

import { Box } from "@mui/system";
import { createNode, inputNodeTypes, modificationNodeTypes, outputNodeTypes, onNewConnection } from "./Nodes/nodes";

const proOptions = { hideAttribution: true };

export default function Canvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
        (connection) => {
            console.debug(`Connection created`, connection);
            nodes.find((node) => node.id === connection.target).data[connection.targetHandle] = {
                nodeId: connection.source,
                channel: connection.sourceHandle,
            };
            onNewConnection(connection);
            setEdges((edges) => addEdge(connection, edges));
        },
        [nodes, setEdges]
    );
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            console.debug("A drop event was completed on the canvas", event);
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || type === null) {
                return;
            }
            console.log(`Found a request to create a ${type} node`);

            const position = reactFlowInstance.project({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: uuidv4(),
                type,
                position,
                data: {},
            };
            createNode(newNode.id);
            setNodes((nodes) => nodes.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const nodeTypes = useMemo(() => {
        return Object.assign({}, inputNodeTypes, modificationNodeTypes, outputNodeTypes);
    }, []);

    return (
        <Box sx = {{height: "100vh", width: "80vw", backgroundColor: "#282c34"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onLoad={setReactFlowInstance}
                onInit={setReactFlowInstance}
                fitView
                nodeTypes={nodeTypes}
                proOptions={proOptions}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </Box>
    );
}
