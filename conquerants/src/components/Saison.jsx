import React from "react";

function Saison({saisons, saison, setSaison, nomClass }) {

    const handleChange = (value) =>  {
        const saisonTemp = JSON.parse(value);
        setSaison(saisonTemp);
    }

    return (
        <select className={nomClass} value={JSON.stringify(saison)} onChange={e => handleChange(e.target.value)}>
            {saisons.map((saison, index) => (
                <option key={index} value={JSON.stringify(saison)}>
                    {saison.debut + "-" + saison.fin}
                </option>
            ))}
        </select>
    );
}

export default Saison;