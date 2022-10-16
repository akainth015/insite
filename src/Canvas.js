import React, {useCallback, useRef, useState} from "react";
import ReactFlow, {addEdge, Background, Controls, ReactFlowProvider, useEdgesState, useNodesState,} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Components/Sidebar";
import {customNodeTypes} from "./Nodes/nodes";

let id = 0;
const getId = () => `dndnode_${id++}`;

const proOptions = { hideAttribution: true };

export default function Canvas() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const onConnect = useCallback(
        (params) => setEdges((edges) => addEdge(params, edges)),
        [setEdges]
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
                id: getId(),
                type,
                position,
                data: {},
            };
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
                        nodeTypes={customNodeTypes}
                        proOptions={proOptions}
                    >
                        <Background/>
                        <Controls/>
                    </ReactFlow>
                </div>
                <Sidebar/>
            </ReactFlowProvider>
        </div>
    );
}
