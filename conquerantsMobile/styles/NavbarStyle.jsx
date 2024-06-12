import { StyleSheet } from 'react-native';

const NavbarStyle = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#101010',
        borderBottomWidth: 2,
        borderBottomColor: '#181818',
        paddingVertical: 10,
        zIndex: 999,
        height: 70,
        width: '100%',
        top: 0,
        position: 'absolute'
    },
    logo: {
        marginRight: 'auto',
        paddingLeft: 20,
        position: 'relative'
    },
    logoImage: {
        width: 50,
        height: 50
    },
    menuContainer: {
        flexDirection: 'row'
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 10
    },
    langue: {
        marginLeft: 10
    },
    langueIcon: {
        fontSize: 20
    },
    menu: {
        position: 'absolute',
        top: 70,
        right: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5
    },
    menuItem: {
        marginBottom: 10
    },
    profileLink: {
        position: 'absolute',
        right: 0
    },
    profileIcon: {
        fontSize: 20
    },
    langueDropdown: {
        width: 100,
        backgroundColor: 'white',
        borderRadius: 5
    },
    langueText: {
        fontSize: 16,
        padding: 10
    },
    langueTextHighlight: {
        color: 'blue'
    },
    adminDropdown: {
        marginTop: 10
    },
    adminDropdownMenu: {
        backgroundColor: '#141414',
        borderWidth: 2,
        borderColor: '#181818',
        padding: 10
    },
    adminDropdownText: {
        color: '#f5f5f5'
    }
});

export default NavbarStyle;