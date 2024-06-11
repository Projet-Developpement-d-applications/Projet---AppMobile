import React from "react";

function Erreur({ langue }) {
    return(
        <div>
            {langue.erreur}
        </div>
    );
}

export default Erreur;