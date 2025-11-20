import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// Importe le router si tu prévois des navigations
// import { router } from 'expo-router';

// --- Composant Carte Réutilisable (Style) ---
const StatCard = ({ title, value, icon, color, onPress }: { title: string, value: string | number, icon: string, color: string, onPress?: () => void }) => (
    <TouchableOpacity
        style={[styles.card, { backgroundColor: color, shadowColor: color }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
    </TouchableOpacity>
);
// ---------------------------------------------

export default function DashboardScreen() {
    const { signOut } = useAuth();
    const { data: profile, isLoading } = useProfile();

    // Données réelles du profil
    const pseudo = profile?.pseudo ?? 'Chef de Meute';
    const points = profile?.points ?? 0;
    const familyIdShort = profile?.family_id?.substring(0, 4) ?? 'N/A';

    // Données en dur (à remplacer plus tard)
    const tasksDone = 15;
    const weeklyGoal = 20;

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Chargement du profil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* 1. Bloc de Bienvenue et Déconnexion */}
            <View style={styles.header}>
                <Text style={styles.helloText}>Salut, {pseudo} !</Text>
                <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                    <Text style={styles.signOutText}><MaterialIcons name="logout" size={12} color="black" /> Déconnexion</Text>
                </TouchableOpacity>
            </View>

            {/* 2. Cartes de Statistiques */}
            <View style={styles.statsRow}>
                <StatCard
                    title="Mes Points"
                    value={points}
                    icon="⭐"
                    color="#FFECB3" // Jaune pâle
                />
                <StatCard
                    title="Tâches faites"
                    value={tasksDone}
                    icon="✅"
                    color="#B2EBF2" // Bleu clair
                />
            </View>

            <View style={styles.statsRow}>
                <StatCard
                    title="Objectif (Semaine)"
                    value={`${tasksDone} / ${weeklyGoal}`}
                    icon="🎯"
                    color="#F8BBD0" // Rose clair
                />
                <StatCard
                    title="Ma Famille"
                    value={`ID: ${familyIdShort}`}
                    icon="🏡"
                    color="#DCEDC8" // Vert très pâle
                    onPress={() => { /* router.push('/family-settings') */ Alert.alert("Fonctionnalité", "Page des membres à construire !") }}
                />
            </View>

            {/* 3. Bouton principal "Créer Tâche" (Exemple) */}
            <TouchableOpacity
                style={styles.mainButton}
                onPress={() => { /* router.push('/create-task') */ Alert.alert("Prochaine Étape", "Formulaire de création de tâche!") }}
            >
                <Text style={styles.mainButtonText}>+ Créer une nouvelle Tâche</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f9ff', // Fond légèrement coloré
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {},
    helloText: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 16,
        color: '#2c3e50',
    },
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
    // --- Cartes de Statistiques ---
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    card: {
        width: '48%', // Pour laisser un peu d'espace entre les cartes
        padding: 15,
        borderRadius: 15, // Coins très arrondis
        // Ombre Douce (Clé du style Duolingo/IA)
        elevation: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    cardIcon: {
        fontSize: 24,
        marginBottom: 5,
    },
    cardTitle: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    cardValue: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 28,
        color: '#000',
    },
    // --- Bouton Principal ---
    mainButton: {
        backgroundColor: '#4CAF50', // Vert primaire
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    mainButtonText: {
        color: 'white',
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 20,
    },
});