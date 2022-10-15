import React, { memo, useState } from "react";
import { Handle } from "reactflow";

export default memo(() => {
    const [file, setFile] = useState(null);
    const fileReader = new FileReader();
    const onFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (file) {
            fileReader.onload = function (e) {
                const csvOutput = e.target.result;
                console.log(csvOutput);
            };
            fileReader.readAsText(file);
        }
    };

    return (
        <>
            <div>CSV Input Node</div>
            <form>
                <input type="file" id="csvFile" name="csvFile" accept=".csv" onChange={onFileChange} />
                <button onClick={handleOnSubmit}>Import CSV</button>
            </form>
            <Handle
                type="source"
                position="right"
                id="a"
                style={{ top: 10, background: "#555" }}
                isConnectable="true"
            />
        </>
    );
});
