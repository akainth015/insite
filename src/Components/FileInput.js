import { AttachFile, FileOpen } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";

export default function FileInput({ accept, onChange }) {
    const [files, setFiles] = useState(null);
    const [isDragTarget, setIsDropTarget] = useState(false);

    const activeFilesText = (
        <Typography>
            {files && files.length > 0 ? [...files].map((file) => file.name).join(", ") : "Select or drop a file"}
        </Typography>
    );

    return (
        <Stack
            component="label"
            className="nodrag nowheel"
            alignItems={"center"}
            padding={2}
            sx={{
                border: "dashed 4px #aaa",
                cursor: "pointer",
                minWidth: "182px",
                transition: "border 500ms",
                "&:hover": {
                    border: "dashed 4px #333",
                },
                "& *": {
                    pointerEvents: "none",
                },
            }}
            onDragEnter={() => setIsDropTarget(true)}
            onDragLeave={() => setIsDropTarget(false)}
            onDrop={(event) => {
                setFiles(event.dataTransfer.files);
                onChange(event.dataTransfer.files);
                setIsDropTarget(false);
                event.preventDefault();
                event.stopPropagation();
            }}
        >
            {isDragTarget ? (
                <>
                    <AttachFile fontSize={"large"} color={"action"} />
                    <Typography>Drop to Select!</Typography>
                </>
            ) : (
                <>
                    <FileOpen fontSize={"large"} color={"action"} />
                    {activeFilesText}
                </>
            )}
            <input
                type="file"
                accept={accept}
                style={{
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    zIndex: -1,
                }}
                onChange={(event) => {
                    setFiles(event.target.files);
                    onChange(event.target.files);
                }}
            />
        </Stack>
    );
}
