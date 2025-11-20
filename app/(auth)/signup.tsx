import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
// import { DinoAvatar } from '../../components/DinoAvatar'; // Ton composant d'avant !

export default function LoginScreen() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signUpWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    pseudo: 'Nouveau Dino',
                    role: 'parent',
                }
            }
        });

        if (error) Alert.alert('Erreur', error.message)
        else Alert.alert(
            'Vérification requise',
            'Un email de confirmation a été envoyé. Vérifie ta boîte de réception pour valider ta famille Dino !',
            [
                {
                    text: 'J\'ai compris',
                    onPress: () => {
                        setEmail('')
                        setPassword('')
                        router.replace('/(auth)/login')
                    }
                }
            ]
        );
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
            <Text style={styles.title}>DinoTasks</Text>
            <Text style={styles.subtitle}>La famille s'organise !</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email du chef de meute"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe secret"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={signUpWithEmail}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Créer un compte</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f9ff', // Un bleu très pâle
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 36,
        color: '#2c3e50',
        marginBottom: 10,
        fontFamily: 'Fredoka_700Bold',
    },
    subtitle: {
        fontSize: 18,
        color: '#7f8c8d',
        marginBottom: 40,
        fontFamily: 'Fredoka_500Medium',
    },
    inputContainer: {
        width: '100%',
        gap: 15,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
        fontFamily: 'Fredoka_400Regular',
    },
    button: {
        backgroundColor: '#4CAF50', // Vert Dino
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Fredoka_600SemiBold',
    }
});