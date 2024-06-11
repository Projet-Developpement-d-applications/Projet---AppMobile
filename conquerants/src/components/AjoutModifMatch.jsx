import React from 'react';
import { useNavigate } from 'react-router-dom';

function AjoutModifMatch({ langue }) {
    const navigate = useNavigate();

    const handleAjouterClick = () => {
        navigate('/ajoutMatchs');
    };

    const handleModifierClick = () => {
        navigate('/modifMatchs');
    };

    return(
        <div className='ajoutMatch'>
            <button onClick={handleAjouterClick}>{langue.ajoutModifMatch.ajout}</button>
            <button onClick={handleModifierClick}>{langue.ajoutModifMatch.modif}</button>
        </div>
    );
}

export default AjoutModifMatch;
