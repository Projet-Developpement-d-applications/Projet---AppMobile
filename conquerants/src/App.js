import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Axios from 'axios';
import Navbar from './components/Navbar';
import Equipes from './components/Equipes';
import Joueurs from './components/Joueurs';
import Matchs from './components/Matchs';
import Accueil from './components/Accueil';
import Profil from './components/Profil';
import Connexion from './components/Connexion';
import Inscription from './components/Inscription';
import Predictions from './components/Predictions';
import ModifEquipes from './components/ModifEquipes';
import ModifJoueurs from './components/ModifJoueurs';
import ModifMatchs from './components/ModifMatchs';
import AjoutEquipes from './components/AjoutEquipes';
import AjoutJoueurs from './components/AjoutJoueurs';
import AjoutMatchs from './components/AjoutMatchs';
import Joueur from './components/Joueur';
import Erreur from './components/Erreur';
import 'bootstrap/dist/css/bootstrap.min.css';
import lang from './json/lang.json';
import AjoutPartie from './components/AjoutPartie';
import AjoutModifEquipe from './components/AjoutModifEquipe';
import AjoutModifJoueur from './components/AjoutModifJoueur';
import AjoutModifMatch from './components/AjoutModifMatch';
import Loading from './components/Loading';
import { encrypt } from './components/Encryption';
import Cookies from 'js-cookie';

function App() {

  const [connecter, setConnecter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [saison, setSaison] = useState("");
  const [saisons, setSaisons] = useState([]);
  const [langue, setLangue] = useState(lang.fr);
  const [pseudoUser, setPseudoUser] = useState("");
  const [pendingConnexion, setPendingConnexion] = useState(true);

  const creerCookieLangue = (langue) => {
    Cookies.set("langue", langue, {expires: 365});
  }

  const handleLangue = (langue) => {
    if (langue === "fr") {
      setLangue(lang.fr);
    } else {
      setLangue(lang.en);
    }

    creerCookieLangue(langue);
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [saisonsResponse] = await Promise.all([
                Axios.get('https://conquerants.azurewebsites.net/noAuth/saisons')
            ]);
            setSaisons(saisonsResponse.data);
            setSaison(saisonsResponse.data[saisonsResponse.data.length -1]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const valideInfoConnexion = async () => {
      await Axios.get("https://conquerants.azurewebsites.net/connexionStatus", 
        { withCredentials: true }
        ).then((response) => {
          // Si le token est valide on connecte sinon deconnexion
          if (response.data === true) {
            // rafraichit le token
            setConnecter(true);
            refreshConnexion().then(setPendingConnexion(false));
          } else {
            setConnecter(false);
            handleDeconnexion().then(setPendingConnexion(false));
          }
      }).catch(error => {
        const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
        setConnecter(false);
        setPendingConnexion(false);
        return false;
      });
    }

    const getCookieLangue = () => {
      const langueTemp = Cookies.get("langue");
      if (langueTemp) {
        handleLangue(langueTemp);
      }
    }

    if (pendingConnexion) {
      valideInfoConnexion();
      getCookieLangue();
    }
  });

  const handleConnexion = async (pseudo, mdp, setter) => {
    await Axios.post("https://conquerants.azurewebsites.net/connexion", 
      { pseudo: pseudo, mot_passe: encrypt(mdp)},
      { withCredentials: true }
      ).then((response) => {
      if (response.data) {
        const { role, pseudo } = response.data;

        setConnecter(true);
        setAdmin(role === "ADMIN");
        setPseudoUser(pseudo);
      }
      setter("");
    }).catch(error => {
      const errorMsg = error.response ? error.response.data.message : 'An unexpected error occurred.';
      setter(errorMsg);
    });
  }

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
        setAdmin(role === "ADMIN");
        setPseudoUser(pseudo);
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
        setAdmin(role === "ADMIN");
        setPseudoUser(pseudo);
      }
    }).catch(error => {
      const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
      console.error(errorMessage);
    });
  }

  const handleDeconnexion = async () => {
    await Axios.get('https://conquerants.azurewebsites.net/deconnexion',
    {withCredentials: true}
    ).then(response => {
        setConnecter(false);
        setAdmin(false);
        setPseudoUser("");
    })
    .catch(error => {
        console.error('Error invalidating cookie:', error);
    });
  }

  if (pendingConnexion) {
    return <div className="App"><Loading/></div>
  }

  return (
    <React.StrictMode>
    <BrowserRouter>
      <div className="App">
        <Navbar langue={langue} langues={lang.langues} connecter={connecter} admin={admin} handleLangue={handleLangue}/>
        <div id="content">
        <Routes>
          <Route exact path="/" element={<Accueil langue={langue} />} />
          <Route path="/equipes/valo" element={<Equipes langue={langue} jeu="Valorant" setSaison={setSaison} saison={saison} />} />
          <Route path="/equipes/lol" element={<Equipes langue={langue} jeu="League of Legends" setSaison={setSaison} saison={saison} />} />
          <Route path="/equipes/rl" element={<Equipes langue={langue} jeu="Rocket League" setSaison={setSaison} saison={saison} />} />
          <Route path="/joueurs" element={<Joueurs saisonFiltre={saison} setSaisonFiltre={setSaison} saisons={saisons} langue={langue} />} />
          <Route path="/joueur/:saison/:jeu/:pseudo" element={<Joueur langue={langue} langueStat={lang.fr}/>} />
          <Route path="/matchs" element={<Matchs saisonFiltre={saison} setSaisonFiltre={setSaison} saisons={saisons} langue={langue} />} />

          <Route path="/predictions" element={connecter ? <Predictions langue={langue} saisonFiltre={saison} setSaisonFiltre={setSaison} saisons={saisons} /> : <Navigate to="/" /> } />

          <Route path="/connexion" element={connecter ? <Navigate to="/" /> : <Connexion langue={langue} handleConnexion={handleConnexion}/>} />
          <Route path="/inscription" element={connecter ? <Navigate to="/" /> : <Inscription langue={langue} handleInscription={handleInscription}/>} />
          <Route path="/profil" element={connecter ? <Profil langue={langue} handleDeconnexion={handleDeconnexion} pseudo={pseudoUser}/>: <Navigate to="/" />} />

          <Route path="/ajoutEquipes" element={admin ? <AjoutEquipes langue={langue} />: <Navigate to="/" />} />
          <Route path="/modifEquipes" element={admin ? <ModifEquipes langue={langue} />: <Navigate to="/" />} />
          <Route path="/ajoutModifEquipe" element={admin ? <AjoutModifEquipe langue={langue} />: <Navigate to="/" />} />
          <Route path="/ajoutJoueurs" element={admin ? <AjoutJoueurs langue={langue} />: <Navigate to="/" />} />
          <Route path="/modifJoueurs" element={admin ? <ModifJoueurs langue={langue} />: <Navigate to="/" />} />
          <Route path="/ajoutModifJoueur" element={admin ? <AjoutModifJoueur langue={langue} />: <Navigate to="/" />} />
          <Route path="/ajoutMatchs" element={admin ? <AjoutMatchs langue={langue} />: <Navigate to="/" />} />
          <Route path="/modifMatchs" element={admin ? <ModifMatchs langue={langue} />: <Navigate to="/" />} />
          <Route path="/ajoutModifMatch" element={admin ? <AjoutModifMatch langue={langue} />: <Navigate to="/" />} />
          <Route path="/ajoutPartie" element={admin ? <AjoutPartie langue={langue} langueStat={lang.fr}/>: <Navigate to="/" />} />
          <Route path="*" element={<Erreur langue={langue} />}/>
        </Routes>
        </div>
      </div> 
    </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
