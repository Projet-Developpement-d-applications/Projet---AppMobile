import React, { useState } from 'react';
import Axios from "axios";
import {Link} from "react-router-dom"; 
import { Container, Button, Row, Col } from 'react-bootstrap';
import banniere from '../images/banniere.png';
import Ripples from 'react-ripples';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Auth.css';
import { valideMdp, valideNomPrenom, validePseudo } from './Validation';
import Loading from './Loading';

Axios.defaults.baseURL = 'https://conquerants.azurewebsites.net';
Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function Inscription({ handleInscription, langue }) {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [mdp, setMdp] = useState("");
    const [loading, setLoading] = useState(false);

    const [pseudoErreur, setPseudoErreur] = useState("");
    const [prenomErreur, setPrenomErreur] = useState("");
    const [nomErreur, setNomErreur] = useState("");
    const [mdpErreur, setMdpErreur] = useState("");

    const [registerStatus, setRegisterStatus] = useState("");
  
    const register = () => {
      if (validePseudo(pseudo, setPseudoErreur, langue) & valideMdp(mdp, setMdpErreur, langue) & valideNomPrenom(nom, setNomErreur, langue) & valideNomPrenom(prenom, setPrenomErreur, langue)) {
        setLoading(true);
        handleInscription(prenom, nom, pseudo, mdp, setRegisterStatus).then(() => {
          setLoading(false);
        });
      }
    };

    const handleChange = (value, setter, valide, setterErreur) => {
      if ((/\s/g).test(value)) {
        return; 
      }

      valide(value, setterErreur, langue);
      setter(value);
    };
    
    return (
      <div>
        <h1 className="titre">{langue.auth.inscrire}</h1>
        <Container className="test">
            <Row>
              <Col className="colImage col-md-4"/>
              <Col className="colInput">
                <img className="image" src={banniere} alt="logo"/>
                <small id="error" className="text-danger form-text info">{registerStatus}</small>
                <div className="inputContainer">
                  <input required type="text" className="form-control customInput" value={prenom} 
                  onChange={(e) => {handleChange(e.target.value, setPrenom, valideNomPrenom, setPrenomErreur);}}/>
                  <label className="inputHolder">{langue.prenom}</label>
                  <small id="prenomErreur" className="text-danger form-text info">{prenomErreur}</small>
                </div>
                <div className="inputContainer">
                  <input required type="text" className="form-control customInput" value={nom} 
                  onChange={(e) => {handleChange(e.target.value, setNom, valideNomPrenom, setNomErreur);}}/>
                  <label className="inputHolder">{langue.nom}</label>
                  <small id="nomErreur" className="text-danger form-text info">{nomErreur}</small>
                </div>
                <div className="inputContainer">
                  <input required type="text" className="form-control customInput" value={pseudo} 
                  onChange={(e) => {handleChange(e.target.value, setPseudo, validePseudo, setPseudoErreur);}}/>
                  <label className="inputHolder">{langue.auth.email}</label>
                  <small id="pseudoErreur" className="text-danger form-text info">{pseudoErreur}</small>
                </div>
                <div className="inputContainer">
                  <input required type="password" className="form-control customInput" value={mdp} 
                  onChange={(e) => {handleChange(e.target.value, setMdp, valideMdp, setMdpErreur);}}/>
                  <label className="inputHolder">{langue.auth.mdp}</label>
                  <small id="mdpErreur" className="text-danger form-text info">{mdpErreur}</small>
                </div>
                <Ripples className="ripple">
                  <Button disabled={loading} className="customButton btn-secondary" onClick={() => register()}>
                    {langue.auth.inscription}
                  </Button>
                </Ripples>
                {loading && <Loading customClassName="loadingAuth"/>}
                <Link to="/connexion" className="lien">{langue.auth.inscription_connexion}</Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
  
  export default Inscription;