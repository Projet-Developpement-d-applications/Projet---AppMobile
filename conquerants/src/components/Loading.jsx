import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import "../styles/Loading.css";

function Loading({ customClassName }) {

    const [className, setClassName] = useState("loading");

    useEffect(() => {
        if (customClassName) {
            setClassName(customClassName);
        }
    }, [customClassName]);

    return(
        <div className={className}>
            <SyncLoader
            size={30}
            color={"#d3333e"}
            />
        </div>
    );
}

export default Loading;