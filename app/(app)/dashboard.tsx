import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useAuth} from "@/contexts/AuthContext";
import {useProfile} from "@/hooks/useProfile";

export default function DashboardScreen() {
    const { signOut } = useAuth();
    // On charge les données du profil de l'utilisateur
    const { data: profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Chargement du profil...</Text>
            </View>
        );
    }

    // Le nom de famille n'est pas dans le profil, mais on peut afficher le family_id pour vérification
    // Le pseudo est affiché dans l'onboarding, mais affichons-le ici aussi !
    const pseudo = profile?.pseudo ?? 'Chef de Meute';
    const points = profile?.points ?? 0;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue, {pseudo} ! 👋</Text>
            <Text style={styles.pointsText}>
                Total de points de vie : **{points}** ✨
            </Text>

            {/* Vérification du Family ID (seulement pour le dév) */}
            <Text style={styles.detailText}>
                ID Famille : {profile?.family_id ? profile.family_id.substring(0, 8) + '...' : 'Non assigné'}
            </Text>

            <View style={styles.spacer} />

            {/* Bouton de Déconnexion */}
            <TouchableOpacity
                style={styles.button}
                onPress={signOut}
            >
                <Text style={styles.buttonText}>Déconnexion et Nouvelle Famille</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        padding: 20,
    },
    title: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 28,
        marginBottom: 10,
        color: '#2c3e50',
        textAlign: 'center',
    },
    pointsText: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 20,
        marginVertical: 15,
        color: '#4CAF50',
    },
    detailText: {
        fontFamily: 'Fredoka_400Regular',
        fontSize: 14,
        color: '#7f8c8d',
    },
    spacer: {
        height: 50,
    },
    button: {
        backgroundColor: '#e74c3c', // Rouge pour la déconnexion
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 18,
    }
})