import React from "react";
import CSVNode from "../Nodes/CSVNode";

export default function Sidebar() {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside>
            <div className="description">You can drag the nodes between the pane.</div>
            <div className="dndnode CSVNode" onDragStart={(event) => onDragStart(event, "CSVNode")} draggable>
                CSV Input Node
            </div>
            <div className="dndnode ClockNode" onDragStart={(event) => onDragStart(event, "ClockNode")} draggable>
                ClockNode Node
            </div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, "input")} draggable>
                Input Node
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, "output")} draggable>
                Output Node
            </div>
            <div className="dndnode default" onDragStart={(event) => onDragStart(event, "default")} draggable>
                Default Node
            </div>
            <div className="dndnode default" onDragStart={(event) => onDragStart(event, "FilterNode")} draggable>
                FilterNode
            </div>
        </aside>
    );
}
