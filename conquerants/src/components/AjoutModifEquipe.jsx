import React from 'react';
import { useNavigate } from 'react-router-dom';

function AjoutModifEquipe({ langue }) {
    const navigate = useNavigate();

    const handleAjouterClick = () => {
        navigate('/ajoutEquipes');
    };

    const handleModifierClick = () => {
        navigate('/modifEquipes');
    };

    return(
        <div className='ajoutEquipe'>
            <button onClick={handleAjouterClick}>{langue.ajoutModifEquipe.ajout}</button>
            <button onClick={handleModifierClick}>{langue.ajoutModifEquipe.modif}</button>
        </div>
    );
}

export default AjoutModifEquipe;
