import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from './Loading';
import Erreur from './Erreur';
import ValoBanniere from '../images/valo.jpeg';
import RocketBanniere from '../images/rl.jpeg';
import LeagueBanniere from '../images/lol.jpeg';
import JoueurImage from '../images/joueur.jpg';
import Saison from './Saison';
import '../styles/equipes.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Equipes({ langue, jeu, saison, setSaison }) {

    const [equipes, setEquipes] = useState([]);
    const [saisons, setSaisons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isErreur, setIsErreur] = useState(false);
    const [image, setImage] = useState();
    const [description, setDescription] = useState("");
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [mobileSlide, setMobileSlide] = useState(false);

    const settings = {
        dots: !mobileSlide,
        arrows: !mobileSlide,
        infinite: false,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1
    };

    const fetchSaisons = async () => {
        await Axios.get("https://conquerants.azurewebsites.net/noAuth/saisons").then((response) => {
            setSaisons(response.data);
            if (saison === "") {
                setSaison(response.data[response.data.length - 1]);
            }
        }).catch((error) => {
            console.error("Error fecthing data", error);
        });
    };

    const {isFetching, isError} = useQuery({
        queryFn: () => fetchSaisons(),
        queryKey: ["equipes"],
        refetchOnWindowFocus: false,
    });

    

    useEffect(() => {
        const calculateSlidesToShow = () => {
            const width = window.innerWidth;
            if (width <= 450) {
                setSlidesToShow(1);
                setMobileSlide(true);
            } else if (width <= 768) {
                setSlidesToShow(1);
                setMobileSlide(false);
            } else if (width <= 1200) {
                setSlidesToShow(2);
                setMobileSlide(false);
            } else {
                setSlidesToShow(3);
                setMobileSlide(false);
            }
        };

        calculateSlidesToShow();
        window.addEventListener('resize', calculateSlidesToShow);

        return () => {
        window.removeEventListener('resize', calculateSlidesToShow);
        };
    }, []);

    useEffect(() => {
        const fetchEquipes = async () => {
            setIsLoading(true);

            await Axios.post("https://conquerants.azurewebsites.net/noAuth/equipeLimoilouParJeu", {jeu: jeu, saison: saison.debut}).then((response) => {
                setEquipes(response.data);
            }).catch((error) => {
                setIsErreur(true);
             console.error("Error fecthing data", error);
            });

            setIsLoading(false);
        };

        const setGameInfo = () => {
            switch(jeu) {
                case "Valorant":
                    setImage(ValoBanniere);
                    setDescription(langue.valo.description);
                    break;
    
                case "League of Legends":
                    setImage(LeagueBanniere);
                    setDescription(langue.lol.description);
                    break;
    
                case "Rocket League":
                    setImage(RocketBanniere);
                    setDescription(langue.rl.description);
                    break;
                default :
                    break;
            }
        }
        
        fetchEquipes();
        setGameInfo();
    }, [saison, jeu, langue]);

    if (isFetching || isLoading) {
        return <Loading/>
    }
    
    if (isError || isErreur) {
        return <Erreur/>
    }

    return (
        <div className='App'>
            <div className="imageContainer" style={{backgroundImage: `url(${image})`}}></div>
            <h1 className="titreJeu">{jeu.toUpperCase()}</h1>
            <Saison nomClass="saisonEquipe" saisons={saisons} saison={saison} setSaison={setSaison}/>
            <div className="content">
                <div className="infoJeu">
                    {equipes.length > 0 && <p className="nombreEquipe">{equipes.length > 1 ? langue.equipes.nos : langue.equipes.notre}</p>}
                    <h2 className="nomJeu">{jeu.toUpperCase()}</h2>
                    <p className="descriptionJeu">{description}</p>
                </div>

                <div>
                    {equipes.map((equipe, index) => {
                        return <div key={index}>
                            <p className="divisionEquipe">{"Division " + equipe.division}</p>
                            <h2 className="nomEquipe">{equipe.nom.toUpperCase()}</h2>
                            <div className="joueursContainer">
                                <Slider {...settings}>
                                    {equipe.joueurs.map((joueur, index) => {
                                    return <div key={index} className="joueurCarte">
                                            <div className="joueurBody" style={{backgroundImage: `url(${JoueurImage})`}}>
                                                <p className="joueurPseudo">{joueur.pseudo}</p>
                                            </div>
                                        </div>
                                    })}
                                </Slider>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default Equipes;