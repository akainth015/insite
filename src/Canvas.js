import React, { useState, useRef, useCallback } from "react";
import ReactFlow, { Background, ReactFlowProvider, useEdgesState, useNodesState, addEdge, Controls } from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Components/Sidebar";
import CSVNode from "./Nodes/CSVNode";
import TableDisplayNode from "./Nodes/TableDisplayNode";
let id = 0;
const getId = () => `node_${id++}`;
const nodeTypes = { csv: CSVNode, table: TableDisplayNode };

export default function Canvas() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const onConnect = useCallback((params) => setEdges((edges) => addEdge(params, edges)), [setEdges]);
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || type === null) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            if (type === "CSVNode") {
                const newNode = {
                    id: getId(),
                    type: "csv",
                    position,
                    data: { label: <CSVNode />, outputData: null, target: null },
                };

                setNodes((nodes) => nodes.concat(newNode));
                return;
            }

            if (type === "TableDisplayNode") {
                const newNode = {
                    id: getId(),
                    type: "table",
                    position,
                    data: { label: <TableDisplayNode />, inputData: null, toUpdate: true, source: null },
                };

                setNodes((nodes) => nodes.concat(newNode));
                return;
            }

            const newNode = {
                id: getId(),
                type,
                position,
                toUpdate: false,
                data: { label: `${type} node` },
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
                        nodeTypes={nodeTypes}
                        fitView
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
