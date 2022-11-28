import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, { addEdge, Background, Controls, MarkerType, MiniMap, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

import { Box } from "@mui/system";
import {
    createConnection,
    createNode,
    inputNodeTypes,
    modificationNodeTypes,
    machineLearningNodes,
    outputNodeTypes,
    setNodesState,
    setNodeValues,
} from "./Nodes/nodes";

import { useAuthUser } from "./Firebase/Auth";
import Save from "./Components/Save";
import { saveFlow, getFlow, getAllFlows } from "./Firebase/firestore";

const proOptions = { hideAttribution: true };

export default function Canvas(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [name, setName] = useState(props.name ? props.name : null);
    const [id, setId] = useState(props.id ? props.id : uuidv4());
    const auth = useAuthUser();
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
        (connection) => {
            console.debug(`Connection created`, connection);

            setEdges((edges) => {
                // Break any co-terminal connections
                edges
                    .filter(
                        ({ target, targetHandle }) =>
                            target === connection.target && targetHandle === connection.targetHandle
                    )
                    .forEach((edge) => edge.data.removeConnection());

                // Remove any co-terminal connections
                edges = edges.filter(
                    ({ target, targetHandle }) =>
                        target !== connection.target || targetHandle !== connection.targetHandle
                );

                connection.data = {
                    removeConnection: createConnection(connection),
                };
                connection.markerEnd = {
                    type: MarkerType.ArrowClosed,
                    height: 20,
                    width: 20,
                };
                return addEdge(connection, edges);
            });
        },
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

            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || type === null) {
                return;
            }
            console.log(`Creating a ${type} node`);

            const position = reactFlowInstance.project({
                x: event.clientX,
                y: event.clientY,
            });

            const nodeId = uuidv4();
            const newNode = {
                id: nodeId,
                type,
                position,
                data: {
                    delete: createNode(nodeId),
                    type: type,
                },
            };
            setNodes((nodes) => nodes.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    const nodeTypes = useMemo(() => {
        return Object.assign({}, inputNodeTypes, modificationNodeTypes, outputNodeTypes, machineLearningNodes);
    }, []);

    // Storage functions
    const onSave = (param) => {
        if (reactFlowInstance) {
            let flow = reactFlowInstance.toObject();
            for (const node of flow.nodes) {
                delete node.data.delete;
            }
            for (const edge of flow.edges) {
                delete edge.data.removeConnection;
            }
            if (param) {
                saveFlow(auth, id, param, flow);
            } else {
                saveFlow(auth, id, name, flow);
            }
        }
    };

    const onRestore = (restoreId, name) => {
        const restoreFlow = async (restoreId, name) => {
            const flow = await getFlow(auth, restoreId);

            if (flow) {
                for (const node of flow.nodes) {
                    createNode(node.id);
                }
                setNodes(flow.nodes || []);
                setTimeout(() => {
                    setNodeValues(flow.values);
                    for (const edge of flow.edges) {
                        edge.data = { ...edge.data, removeConnection: createConnection(edge) };
                    }
                    setEdges(flow.edges || []);
                }, 60);
                setId(restoreId);
                setName(name);
            }
        };
        restoreFlow(restoreId, name);
    };

    return (
        <Box sx={{ height: "100vh", width: "80vw", backgroundColor: "#282c34" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                onEdgesDelete={(edges) => edges.forEach((e) => e.data.removeConnection())}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onLoad={setReactFlowInstance}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
            >
                <Background />
                <Controls>
                    {auth && <Save onSave={onSave} onRestore={onRestore} setName={setName} name={name} />}
                </Controls>
                <MiniMap />
            </ReactFlow>
        </Box>
    );
}
