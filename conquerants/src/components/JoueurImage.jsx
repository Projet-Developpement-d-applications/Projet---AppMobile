import Axios from "axios";

const url = "https://conquerants.blob.core.windows.net/images/";

export async function getImage(saison, jeu, pseudo) {
    const completeUrl = url + saison + "/" + jeu + "/" + pseudo + ".jpg";
    try {
        const response = await Axios.get(completeUrl, {responseType: 'blob'});
        if (response.status === 200) {
            const image = await response.data;
            return URL.createObjectURL(image);
        }
    } catch(error)  {
        return undefined;
    };
}