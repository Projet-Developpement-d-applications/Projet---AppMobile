import { StyleSheet } from 'react-native';

const PredictionsStyle = StyleSheet.create({
  nouvellePrediction: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#161616',
    borderRadius: 15,
    width: '90%',
  },
  predictions: {
    marginTop: '6rem',
    padding: '1rem',
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#161616',
    width: '90%',
    borderRadius: 15,
    marginBottom: '5rem',
  },
  predictionInfo: {
    backgroundColor: '#121212',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#d3333e',
    margin: '2rem 1rem 1rem 1rem',
    padding: '1rem',
  },
  selectionPrediction: {
    margin: '1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionSaison: {
    height: 40,
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#161616',
    borderRadius: 10,
    color: '#b5b5b5',
  },
  predictionsContainer: {
    borderWidth: 2,
    borderColor: '#d3333e',
    borderRadius: 15,
    padding: '1rem',
    marginTop: '1rem',
  },
  tableauPredictions: {
    margin: 0,
    marginTop: '1rem',
    borderRadius: 15,
    overflow: 'hidden',
  },
  tableauPredictionsTheadTh: {
    backgroundColor: '#121212',
    color: '#f5f5f5',
    padding: '1rem',
    fontSize: '1.5rem',
    verticalAlign: 'middle',
  },
  tableauPredictionsTbodyTd: {
    color: '#f5f5f5',
    backgroundColor: 'transparent',
    height: '5rem',
  },
  tableauPredictionsOdd: {
    backgroundColor: '#141414',
  },
  tableauPredictionsEven: {
    backgroundColor: '#181818',
  },
  tableauPredictionsHover: {
    backgroundColor: 'rgba(211, 51, 62, 0.4)',
  },
  tableauPredictionsTr: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#181818',
    backgroundColor: '#171717',
  },
  win: {
    color: '#00cc00',
    fontSize: 'large',
  },
  lose: {
    color: 'red',
    fontSize: 'large',
  },
});

export default PredictionsStyle;
