import React, { useState, useEffect, useCallback} from "react";
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';


var aryIannaTimeZones = Intl.supportedValuesOf('timeZone');

export default function ClockNode() {
    const [selected, setSelected] = useState(aryIannaTimeZones[0]);
    const submit = () => {
        let date = new Date;
        let strTime = date.toLocaleString("en-US",{timeZone: selected});
        console.log(strTime);
    };
    return (
        <form>
        <select 
            value={selected} 
            style={{float : 'left', fontSize : '60%', textAlign : 'center'}}
            onChange={(e) => setSelected(e.target.value)}>
            {aryIannaTimeZones.map((value) => (
            <option value={value} key={value}>
                {value}
            </option>
            ))}
        </select>
        <button type="button" onClick={submit}>
            Submit
        </button>
        </form>
    );
}


