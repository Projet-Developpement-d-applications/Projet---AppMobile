import { StyleSheet } from 'react-native';

const MatchSemaineStyle = StyleSheet.create({
  matchContainer: {
    borderWidth: 2,
    borderColor: '#181818',
    borderRadius: 25,
    marginTop: '10rem',
    backgroundColor: '#141414',
  },
  matchTableTh: {
    backgroundColor: '#101010',
    borderWidth: 2,
    borderColor: '#181818',
    color: '#f5f5f5',
    padding: '1rem',
    fontSize: '1.5rem',
    verticalAlign: 'middle',
    width: '15rem',
  },
  matchTableTd: {
    backgroundColor: '#141414',
    borderBottomWidth: 2,
    borderBottomColor: '#141414',
  },
  match: {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    marginBottom: '1rem',
  },
  lastMatch: {
    marginBottom: 0,
  },
  noMatch: {
    color: '#808080',
    display: 'flex',
    marginTop: '1rem',
  },
  team: {
    display: 'flex',
    width: 'auto',
    margin: 0,
    padding: '0.25rem',
    backgroundColor: '#0F0F0F',
    justifyContent: 'space-between',
    fontSize: '1.25rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  line: {
    width: 'auto',
    height: 1,
    backgroundColor: '#808080',
  },
  teamName: {
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
  },
  score: {
    marginRight: '0.5rem',
  },
  winner: {
    borderLeftWidth: 6,
    borderLeftColor: '#d4af37',
    color: 'white',
  },
  winnerScore: {
    color: '#d4af37',
  },
  loser: {
    borderLeftWidth: 6,
    borderLeftColor: '#808080',
    color: '#808080',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: 0,
    borderBottomWidth: 0,
    padding: '1rem',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#101010',
  },
});

export default MatchSemaineStyle;
