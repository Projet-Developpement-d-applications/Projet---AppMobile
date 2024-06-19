export const valideMdp = (value, setter, langue) => {
    var valide = true;

    if (!(/.{1,}/).test(value)) {
      setter(langue.valid.requis);
      valide = false;
    } else if (!(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/).test(value)) {
      setter(langue.valid.mdp)
      valide = false;
    } else {
      setter("");
    }

    return valide;
  }

export const valideNomPrenom = (value, setter, langue) => {
    var valide = true;

    if (!(/.{1,}/).test(value)) {
      setter(langue.valid.requis);
      valide = false;
    } else if (!(/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/).test(value)) {
      setter(langue.valid.nom);
      valide = false;
    } else {
      setter("");
    }

    return valide;
  }

export const validePseudo = (value, setter, langue) => {
    var valide = true;

    if (!(/.{1,}/).test(value)) {
      setter(langue.valid.requis);
      valide = false;
    } else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(value)) {
      setter(langue.valid.pseudo)
      valide = false;
    } else {
      setter("");
    }

    return valide;
  }