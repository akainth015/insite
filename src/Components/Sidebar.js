import React from "react";
import {customNodeTypes} from "../Nodes/nodes";


export default function Sidebar() {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    function createDraggableForNodeType(nodeType) {
        return (
            <div key={nodeType} className={"dndnode default"} onDragStart={event => onDragStart(event, nodeType)}
                 draggable={"true"}>
                {nodeType}
            </div>
        )
    }

    return (
        <aside>
            <div className="description">
                You can drag the nodes between the pane.
            </div>
            {
                Object.keys(customNodeTypes)
                    .map(createDraggableForNodeType)
            }
        </aside>
    );
}
