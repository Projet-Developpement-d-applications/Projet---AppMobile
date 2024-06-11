import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { createRipples } from 'react-ripples';
import { Container, Button, Row, Col } from 'react-bootstrap';
import banniere from '../images/banniere.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Auth.css';
import { valideMdp, validePseudo } from './Validation';
import Loading from './Loading';
import HCaptcha from '@hcaptcha/react-hcaptcha';

function Connexion({ handleConnexion, langue }) {

  const [pseudo, setPseudo] = useState("");
  const [mdp, setMdp] = useState("");
  const [pseudoErreur, setPseudoErreur] = useState("");
  const [mdpErreur, setMdpErreur] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [essai, SetEssai] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const Ripples = createRipples({
    color: 'rgba(255, 255, 255, .2)',
    during: 1500,
  });

  const login = () => {
    if (validePseudo(pseudo, setPseudoErreur, langue) & valideMdp(mdp, setMdpErreur, langue)) {
      setLoading(true);
      handleConnexion(pseudo, mdp, setLoginStatus).then(() => {
        setLoading(false);

        var index = essai + 1;
        SetEssai(index);

        if (index >= 3) {
          setShowCaptcha(true);

        }
      });
    }
  }

  const handleCaptchaVerify = async (token) => {
    if (token) {
      setShowCaptcha(false);
    }

  }

  const handleChange = (value, setter, valide, setterErreur) => {
    if ((/\s/g).test(value)) {
      return;
    }

    valide(value, setterErreur, langue);
    setter(value);
  };

  return (
    <div>
      <h1 className="titre">{langue.auth.connecter}</h1>
      <Container className="test">
        <Row>
          <Col className="colImage col-md-4" />
          <Col className="colInput">
            <img className="image" src={banniere} alt="logo" />
            <small id="error" className="text-danger form-text info">{loginStatus}</small>
            <div className="inputContainer">
              <input required type="text" className="form-control customInput" value={pseudo}
                onChange={(e) => { handleChange(e.target.value, setPseudo, validePseudo, setPseudoErreur); }} />
              <label className="inputHolder">{langue.auth.email}</label>
              <small id="pseudoErreur" className="text-danger form-text info">{pseudoErreur}</small>
            </div>
            <div className="inputContainer">
              <input required type="password" className="form-control customInput" value={mdp}
                onChange={(e) => { handleChange(e.target.value, setMdp, valideMdp, setMdpErreur); }} />
              <label className="inputHolder">{langue.auth.mdp}</label>
              <small id="mdpErreur" className="text-danger form-text info">{mdpErreur}</small>
            </div>
            <Ripples className="ripple">
              <Button disabled={loading || showCaptcha} className="customButton btn-secondary" onClick={() => login()}>
                {langue.auth.connexion}
              </Button>
            </Ripples>

            {showCaptcha && <HCaptcha
              sitekey="2f487480-dd52-4e39-8da7-413792810717"
              onVerify={handleCaptchaVerify} />
            }

            {loading && <Loading customClassName="loadingAuth" />}
            <Link to="/inscription" className="lien">{langue.auth.connexion_inscription}</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Connexion;