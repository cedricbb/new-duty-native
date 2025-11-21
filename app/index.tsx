import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { router } from 'expo-router';

export default function IndexGatekeeper() {
    const { session } = useAuth();
    const { data: profile, isLoading } = useProfile();

    useEffect(() => {
        if (!session || isLoading) return;

        if (profile) {
            // UTILISER setTimeout(0) pour sortir du cycle de rendu
            setTimeout(() => {
                if (profile.family_id === null) {
                    router.replace('/(onboarding)/create-family');
                } else {
                    router.replace('/(tabs)/dashboard');
                }
            }, 0); // Délai minimal qui résout le problème de React
        }
    }, [session, profile, isLoading]);

    // Si l'utilisateur n'est pas authentifié, on ne fait rien (laisse _layout le gérer)
    if (!session) {
        return null;
    }

    // 2. Affichage pendant le chargement
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    // Fallback au cas où le profil est null mais l'utilisateur est connecté (erreur inattendue)
    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
    },
});