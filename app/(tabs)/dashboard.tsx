import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import { useProfile } from '@/hooks/useProfile'
import {StatCard} from "@/components/StatCard"
import {FontAwesome5, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons"
import {LinearGradient} from "expo-linear-gradient"
import { ProgressBar, MD3Colors } from 'react-native-paper'

export default function DashboardScreen() {

    const { data: profile, isLoading } = useProfile();

    // Données réelles du profil
    const pseudo = profile?.pseudo ?? 'Chef de Meute'
    const points = profile?.points ?? 0
    const familyIdShort = profile?.family_id?.substring(0, 4) ?? 'N/A'
    const dayStreak = profile?.day_streak ?? 0

    // Données en dur (à remplacer plus tard)
    const tasksDone = 15
    const weeklyGoal = 20

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Chargement du profil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.helloLabel}>Bon retour,</Text>
                    <Text style={styles.helloText}>{pseudo} ! 👋</Text>
                </View>
            </View>

            <View style={styles.coinMainContainer}>
                <View style={styles.coinContainer}>
                    <View style={styles.firstLineCoin}>
                        <Text style={styles.coinLabel}>Dino coins</Text>
                        <Text style={styles.coinValue}><FontAwesome5 name="coins" size={24} color="#FDC830" /> {points}</Text>
                    </View>
                    <View>
                        <ProgressBar progress={0.9} color='#F37335' style={styles.progressBar}/>
                    </View>
                    <View>
                        <Text style={styles.coinText}>53 coins pour le niveau suivant !</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsRow}>
                <StatCard
                    title="Coins"
                    value={points}
                    icon={<FontAwesome5 name="coins" size={24} color="#FFF" />}
                    colors={['#FDC830', '#F37335']}
                />
                <StatCard
                    title="Tâches faites"
                    value={tasksDone}
                    icon={<FontAwesome5 name="check-circle" size={24} color="#FFF" />}
                    colors={['#4facfe', '#00f2fe']}
                />
            </View>

            <View style={styles.statsRow}>
                <StatCard
                    title="Objectif Hebdo"
                    value={`${tasksDone} / ${weeklyGoal}`}
                    icon={<MaterialCommunityIcons name="target" size={28} color="#FFF" />}
                    colors={['#ff9a9e', '#fecfef']}
                />
                <StatCard
                    title="Série"
                    value={dayStreak}
                    icon={<FontAwesome5 name="fire" size={22} color="#FFF" />}
                    colors={['#a8e063', '#56ab2f']}
                />
            </View>

            <TouchableOpacity
                style={styles.mainButtonContainer}
                onPress={() => Alert.alert("Action", "Création de tâche")}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#11998e', '#38ef7d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.mainButtonGradient}
                >
                    <MaterialCommunityIcons name="plus-circle" size={28} color="white" style={{marginRight: 10}} />
                    <Text style={styles.mainButtonText}>Nouvelle Tâche</Text>
                </LinearGradient>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#F3F8EE',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    helloText: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 24,
        color: '#2c3e50',
    },
    helloLabel: {
        fontFamily: 'Fredoka_400Regular',
        fontSize: 20,
        color: '#7f8c8d',
    },
    title: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 20,
        color: '#2c3e50',
        textAlign: 'center'
    },
    coinMainContainer: {
        flexDirection: 'column',
        borderRadius: 20,
        backgroundColor: 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowColor: '#FDD12F',
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 20
    },
    coinContainer: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
    },
    firstLineCoin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinLabel: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 18,
        color: '#2c3e50',
    },
    coinValue: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 28,
        color: '#F37335',
    },
    coinText: {
        fontFamily: 'Fredoka_400Regular',
        fontSize: 14,
        color: '#2c3e50',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 10,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    mainButtonContainer: {
        marginTop: 10,
        borderRadius: 15,
        elevation: 6,
        shadowColor: '#11998e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    mainButtonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButtonText: {
        color: 'white',
        fontFamily: 'Fredoka_700Bold',
        fontSize: 18,
    },
});