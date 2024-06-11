import React from 'react';
import { useNavigate } from 'react-router-dom';

function AjoutModifJoueur({ langue }) {
    const navigate = useNavigate();

    const handleAjouterClick = () => {
        navigate('/ajoutJoueurs');
    };

    const handleModifierClick = () => {
        navigate('/modifJoueurs');
    };

    return(
        <div className='ajoutJoueur'>
            <button onClick={handleAjouterClick}>{langue.ajoutModifJoueur.ajout}</button>
            <button onClick={handleModifierClick}>{langue.ajoutModifJoueur.modif}</button>
        </div>
    );
}

export default AjoutModifJoueur;
