import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useAuth} from "@/contexts/AuthContext";

export default function FamilyScreen() {

    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ton profil a toi !</Text>
            <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                <Text style={styles.signOutText}><MaterialIcons name="logout" size={12} color="black" /> Déconnexion</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' },
    title: { fontFamily: 'Fredoka_700Bold', fontSize: 24, color: '#2c3e50' },
    signOutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(231, 76, 60, 0.1)', // Rouge très transparent
    },
    signOutText: {
        fontFamily: 'Fredoka_400Regular',
        fontSize: 12,
        lineHeight: 14,
        color: '#e74c3c',
    },
});