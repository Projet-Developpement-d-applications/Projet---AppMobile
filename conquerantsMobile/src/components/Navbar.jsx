import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Link } from 'react-router-native'; // Assuming you're using react-router-native for navigation
import logo from '../../images/logo.png';
import styles from '../styles/NavbarStyle';

function Navbar({ connecter, admin, handleLangue, langue, langues }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedLangue, setSelectedLangue] = useState(langues[0].langue); // Default to the first language

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLangueSelect = (lang) => {
        setSelectedLangue(lang);
        handleLangue(lang);
        toggleMenu(); // Close the menu after selecting language
    };

    return (
        <View style={styles.nav}>
            <Link to="/" style={styles.logo}>
                <Image source={logo} style={styles.logoImage} />
            </Link>
            <View style={styles.menuContainer}>
                <TouchableOpacity onPress={toggleMenu}>
                    <Text style={styles.menuIcon}>{menuOpen ? '✖' : '☰'}</Text>
                </TouchableOpacity>
                <DropDownPicker
                    open={menuOpen}
                    value={selectedLangue}
                    items={langues.map(lang => ({label: lang.langue, value: lang.langue}))}
                    setOpen={toggleMenu}
                    setValue={handleLangueSelect}
                    style={styles.langue}
                    textStyle={styles.langueText}
                />
            </View>
            <Modal visible={menuOpen} animationType="slide">
                <View style={styles.menu}>
                    <TouchableOpacity>
                        <Text style={styles.menuItem}>Equipes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.menuItem}>Joueurs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.menuItem}>Matchs</Text>
                    </TouchableOpacity>
                    {!admin && connecter && (
                        <TouchableOpacity>
                            <Text style={styles.menuItem}>{langue.navbar.predictions}</Text>
                        </TouchableOpacity>
                    )}
                    {admin && connecter && (
                        <View style={styles.adminDropdown}>
                            {langue.navbar.admin.map((item, index) => (
                                <TouchableOpacity key={index}>
                                    <Text style={styles.menuItem}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    <Link to={connecter ? "/profil/" : "/connexion"} style={styles.profileLink}>
                        <Text style={styles.profileIcon}>👤</Text>
                    </Link>
                </View>
            </Modal>
        </View>
    );
}

export default Navbar;
