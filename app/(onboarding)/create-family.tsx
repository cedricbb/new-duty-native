import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import {router} from "expo-router";

export default function CreateFamilyScreen() {
    const [familyName, setFamilyName] = useState('')
    const [loading, setLoading] = useState(false)
    const { data: profile } = useProfile()
    const queryClient = useQueryClient()

    const handleCreateFamily = async () => {
        if (!familyName || !profile) return

        setLoading(true)

        const inviteCode = Math.floor(100000 + Math.random() * 900000).toString()

        try {
            const { data: { session } } = await supabase.auth.getSession()
            const { data: { user } } = await supabase.auth.getUser()

            if (!session?.user) {
                Alert.alert('Erreur', 'Tu dois être connecté')
                return
            }

            const userId = session.user.id

            console.log('Creating family for user:', userId)

            const { data: familyData, error: familyError } = await supabase
                .from('families')
                .insert({
                    name: familyName,
                    invite_code: inviteCode,
                    created_by: userId
                })
                .select('id')
                .single()

            if (familyError) throw familyError

            const newFamilyId = familyData.id

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    family_id: newFamilyId,
                    role: 'parent'
                })
                .eq('id', profile.id)

            if (profileError) throw profileError

            await queryClient.invalidateQueries({queryKey: ['profile', profile.id]})

            Alert.alert(
                'Succès ! 🦕',
                `Famille "${familyName}" créée !\n\nCode d'invitation : ${inviteCode}\n\nPartage ce code avec ta famille !`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(app)/dashboard')
                    }
                ]
            )

        } catch (error: any) {
            console.error('Error details:', error)
            Alert.alert('Erreur', error.message || 'Impossible de créer la famille.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue, {profile?.pseudo} !</Text>
            <Text style={styles.subtitle}>Pour commencer, crée ta meute Dino ou rejoins-en une.</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom de la famille (ex: Les T-Rex)"
                value={familyName}
                onChangeText={setFamilyName}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateFamily}
                disabled={loading || !familyName}
            >
                <Text style={styles.buttonText}>{loading ? 'Création...' : 'Créer ma famille Dino'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert('À faire !', 'Redirection vers la page "Rejoindre"')}>
                <Text style={styles.joinText}>J'ai un code d'invitation</Text>
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
        backgroundColor: '#f0f9ff'
    },
    title: {
        fontSize: 28,
        fontFamily: 'Fredoka_700Bold',
        marginBottom: 10,
        color: '#2c3e50' },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Fredoka_400Regular',
        textAlign: 'center',
        marginBottom: 40, color: '#7f8c8d'
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
        fontFamily: 'Fredoka_400Regular',
        width: '100%',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 18
    },
    joinText: {
        marginTop: 20,
        color: '#3498db',
        fontFamily: 'Fredoka_400Regular'
    }
})