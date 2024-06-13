import React, { createContext, useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import Loading from '../components/Loading';
import { useLangue } from '../Context/LangueContext';
import { encrypt } from '../components/Encryption';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { getCookieLangue } = useLangue();
    const [connecter, setConnecter] = useState(false);
    const [pendingConnexion, setPendingConnexion] = useState(true);

    useEffect(() => {
        const valideInfoConnexion = async () => {
          try {
            const response = await Axios.get("https://conquerants.azurewebsites.net/connexionStatus", { withCredentials: true });
            if (response.data === true) {
              setConnecter(true);
              refreshConnexion().then(() => setPendingConnexion(false));
            } else {
              setConnecter(false);
              handleDeconnexion().then(() => setPendingConnexion(false));
            }
          } catch (error) {
            console.error('An unexpected error occurred:', error);
            setConnecter(false);
            setPendingConnexion(false);
          }
        }
    
        if (pendingConnexion) {
          valideInfoConnexion();
          getCookieLangue();
        }
    }, [pendingConnexion]);

    const handleInscription = async (prenom, nom, pseudo, mdp, setter) => {
        await Axios.post("https://conquerants.azurewebsites.net/inscription", {
          prenom: prenom,
          nom: nom,
          pseudo: pseudo,
          mot_passe: encrypt(mdp),
        },
        { withCredentials: true }
        ).then((response) => {
          if (response.data) {
            const { role, pseudo } = response.data;
    
            setConnecter(true);
            setter("");
          }
        }).catch(error => {
          const errorMsg = error.response ? error.response.data.message : 'An unexpected error occurred.';
          setter(errorMsg);
        });
    }
    
    const refreshConnexion = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/refreshConnexion",
          { withCredentials: true }
        ).then((response) => {
          if (response.data) {
            const { role, pseudo } = response.data;
    
            setConnecter(true);
          }
        }).catch(error => {
          const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
          console.error(errorMessage);
        });
    }
    
    const handleConnexion = async (pseudo, mdp, setter) => {
        try {
          const response = await Axios.post("https://conquerants.azurewebsites.net/connexion", { pseudo: pseudo, mot_passe: encrypt(mdp) }, { withCredentials: true });
          if (response.data) {
            const { role, pseudo } = response.data;
            setConnecter(true);
          }
          setter("");
        } catch (error) {
          const errorMsg = error.response ? error.response.data.message : 'An unexpected error occurred.';
          setter(errorMsg);
        }
    }
    
    const handleDeconnexion = async () => {
        await Axios.get('https://conquerants.azurewebsites.net/deconnexion',
        {withCredentials: true}
        ).then(response => {
            setConnecter(false);
        })
        .catch(error => {
            console.error('Error invalidating cookie:', error);
        });
    }
    
    if (pendingConnexion) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={{ connecter, handleConnexion, handleInscription, handleDeconnexion }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;