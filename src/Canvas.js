import React, { useCallback, useRef, useState } from "react";
import ReactFlow, { addEdge, Background, Controls, ReactFlowProvider, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

import Sidebar from "./Components/Sidebar";
import { createNode, inputNodeTypes, modificationNodeTypes, outputNodeTypes, onNewConnection } from "./Nodes/nodes";

const proOptions = { hideAttribution: true };
const nodeTypes = Object.assign({}, inputNodeTypes, modificationNodeTypes, outputNodeTypes);

export default function Canvas() {
    const reactFlowWrapper = useRef(null);
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

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || type === null) {
                return;
            }
            console.log(`Found a request to create a ${type} node`);

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
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

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
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
                    </ReactFlow>
                </div>
                <Sidebar />
            </ReactFlowProvider>
        </div>
    );
}
