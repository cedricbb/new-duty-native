import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ReactNode} from "react";
import {LinearGradient} from "expo-linear-gradient";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: ReactNode;
    colors: [string, string];
    onPress?: () => void;
};

export const StatCard = ({ title, value, icon, colors, onPress }: StatCardProps) => (
    <TouchableOpacity
        style={[styles.cardContainer, { shadowColor: colors[0] }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }} // Dégradé en diagonale (Haut-Gauche)
            end={{ x: 1, y: 1 }}   // Vers (Bas-Droite)
            style={styles.cardGradient}
        >
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    cardContainer: {
        width: '47%',
        borderRadius: 20,
        elevation: 8,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        backgroundColor: 'transparent',
    },
    cardGradient: {
        padding: 15,
        borderRadius: 20,
        height: 140,
        justifyContent: 'space-between',
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: "auto"
    },
    cardTitle: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 14,
        color: '#FFF', // Texte en blanc sur dégradé
        marginTop: 10,
        opacity: 0.9,
        textAlign: 'center',
    },
    cardValue: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 26,
        color: '#FFF',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
    },
});