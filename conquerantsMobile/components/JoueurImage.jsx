import Axios from "axios";

const url = "https://conquerants.blob.core.windows.net/images/";

export async function getImage(saison, jeu, pseudo) {
  const completeUrl = `${url}${saison}/${jeu.toLowerCase()}/${pseudo.toLowerCase()}.jpg`;

  try {
    const response = await Axios.get(completeUrl, { responseType: 'blob' });

    if (response.status === 200) {
      return completeUrl;
    } else {
      return undefined;
    }
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      console.error('Error fetching image:', error);
    }
    return undefined;
  }
}
