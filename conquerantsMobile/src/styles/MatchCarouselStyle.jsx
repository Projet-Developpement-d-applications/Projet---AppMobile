import { StyleSheet } from 'react-native';

const MatchCarouselStyle = StyleSheet.create({
  upcomingMatches: {
    backgroundColor: '#04000c',
    borderLeftWidth: 6,
    borderLeftColor: '#d3333e',
    height: 'auto',
    width: '100%',
    display: 'flex',
    overflowX: 'scroll',
    WebkitOverflowScrolling: 'touch',
    userSelect: 'none',
  },
  upcomingMatchesScrollbar: {
    scrollbarWidth: 'thin',
  },
  upcomingMatchesScrollbarThumb: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  matchCards: {
    display: 'flex',
  },
  matchGroup: {
    display: 'block',
    padding: 0,
    borderRightWidth: 1,
    borderRightColor: '#f5f5f5',
  },
  matchList: {
    display: 'flex',
    color: '#c0c0c0',
  },
  date: {
    display: 'flex',
    paddingVertical: 10,
    paddingHorizontal: 25,
    fontSize: 'large',
    fontWeight: '600',
    margin: 0,
    color: '#c0c0c0',
  },
  card: {
    display: 'block',
    width: 145,
    minWidth: 145,
    borderRadius: 0,
    borderRightWidth: 1,
    borderRightColor: '#f5f5f5',
    color: '#f5f5f5',
    backgroundColor: '#04000c',
  },
  lastCard: {
    borderRightWidth: 0,
  },
  cardText: {
    margin: 0,
    fontWeight: '400',
  },
  lastCardText: {
    paddingBottom: 20,
  },
  gameImg: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    width: 40,
    height: 'auto',
  },
  heure: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    textDecorationLine: 'underline',
  },
});

export default MatchCarouselStyle;
