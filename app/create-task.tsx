import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

const ICONS_LIST = [
    { id: 'broom', lib: MaterialCommunityIcons, name: 'broom', label: 'Balayer' },
    { id: 'bed', lib: MaterialCommunityIcons, name: 'bed', label: 'Lit' },
    { id: 'trash', lib: MaterialCommunityIcons, name: 'trash-can', label: 'Poubelle' },
    { id: 'dishes', lib: MaterialCommunityIcons, name: 'silverware-clean', label: 'Vaisselle' },
    { id: 'toy', lib: MaterialCommunityIcons, name: 'toy-brick', label: 'Jouets' },
    { id: 'plant', lib: MaterialCommunityIcons, name: 'flower', label: 'Plantes' },
    { id: 'dog', lib: MaterialCommunityIcons, name: 'dog', label: 'Chien' },
    { id: 'book', lib: MaterialCommunityIcons, name: 'book-open-variant', label: 'Devoirs' },
];

const POINTS_OPTIONS = [5, 10, 20, 50, 100];

export default function CreateTaskScreen() {

    const { data: profile } = useProfile();
    const queryClient = useQueryClient();
    const [isTomorrow, setIsTomorrow] = useState(false);
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(10);
    const [selectedIcon, setSelectedIcon] = useState('broom');
    const [loading, setLoading] = useState(false);

    const handleCreateTask = async () => {
        const dueDate = new Date();
        if (isTomorrow) {
            dueDate.setDate(dueDate.getDate() + 1);
        }
        if (!title.trim()) {
            Alert.alert("Oups !", "Il faut donner un nom à la mission !");
            return;
        }
        if (!profile?.family_id) {
            Alert.alert("Erreur", "Tu n'as pas de famille associée.");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.from('chores').insert({
                title: title,
                points_value: points,
                icon: selectedIcon,
                family_id: profile.family_id,
                created_by: profile.id,
                status: 'pending',
                due_date: dueDate.toISOString(),
            });
            if (error) throw error;
            Alert.alert("Mission Créée !", "La tâche a été ajoutée au tableau de bord.", [
                {
                    text: "Super",
                    onPress: () => {
                        queryClient.invalidateQueries({ queryKey: ['chores'] });
                        router.back();
                    }
                }
            ]);
        } catch (err: any) {
            Alert.alert("Erreur", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Nouvelle Quête 🚀</Text>
                <Text style={styles.label}>Nom de la quête ?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Ranger ma chambre..."
                    value={title}
                    onChangeText={setTitle}
                    maxLength={40}
                />
                <Text style={styles.label}>Choisis une icône</Text>
                <View style={styles.iconsGrid}>
                    {ICONS_LIST.map((iconItem) => {
                        const IconLib = iconItem.lib;
                        const isSelected = selectedIcon === iconItem.id;
                        return (
                            <TouchableOpacity
                                key={iconItem.id}
                                style={styles.iconButtonContainer}
                                onPress={() => setSelectedIcon(iconItem.id)}
                                activeOpacity={0.7}
                            >
                                {isSelected ? (
                                    <LinearGradient
                                        colors={['#11998e', '#38ef7d']}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                ) : (
                                    <View style={styles.iconBackgroundNormal} />
                                )}

                                <IconLib
                                    name={iconItem.name as any}
                                    size={28}
                                    color={isSelected ? 'white' : '#7f8c8d'}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <Text style={styles.label}>Récompense : {points} Pts</Text>
                <View style={styles.pointsRow}>
                    {POINTS_OPTIONS.map((val) => {
                        const isSelected = points === val;
                        return (
                            <TouchableOpacity
                                key={val}
                                style={styles.pointButtonContainer}
                                onPress={() => setPoints(val)}
                                activeOpacity={0.7}
                            >
                                {isSelected ? (
                                    <LinearGradient
                                        colors={['#FF9966', '#FF5E62']} // Dégradé Feu
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                ) : (
                                    <View style={styles.pointBackgroundNormal} />
                                )}
                                <Text style={[styles.pointText, isSelected && styles.pointTextSelected]}>
                                    +{val}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Text style={styles.label}>C'est pour quand ?</Text>
                <View style={styles.dateRow}>
                    <TouchableOpacity
                        style={[styles.dateButton, !isTomorrow && styles.dateButtonSelected]}
                        onPress={() => setIsTomorrow(false)}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="weather-sunny" size={24} color={!isTomorrow ? "white" : "#f1c40f"} />
                        <Text style={[styles.dateText, !isTomorrow && styles.dateTextSelected]}>Aujourd'hui</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.dateButton, isTomorrow && styles.dateButtonSelected]}
                        onPress={() => setIsTomorrow(true)}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="moon-waning-crescent" size={24} color={isTomorrow ? "white" : "#9b59b6"} />
                        <Text style={[styles.dateText, isTomorrow && styles.dateTextSelected]}>Demain</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.createButtonContainer}
                    onPress={handleCreateTask}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={loading ? ['#bdc3c7', '#bdc3c7'] : ['#6a11cb', '#2575fc']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.createButtonGradient}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.createButtonText}>Lancer la Quête !</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F8EE',
    },
    scrollContent: {
        padding: 20,
        marginTop: 20,
        paddingBottom: 100,
    },
    headerTitle: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 28,
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    label: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 18,
        color: '#34495e',
        marginBottom: 15,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#f0f9ff',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#e1f5fe',
        fontFamily: 'Fredoka_400Regular',
        fontSize: 16,
        marginBottom: 25,
    },
    iconsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 25,
    },
    iconButtonContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: 'white'
    },
    iconBackgroundNormal: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f1f2f6',
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        gap: 10,
    },
    pointButtonContainer: {
        flex: 1,
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: 'white'
    },
    pointBackgroundNormal: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFF3E0',
        borderWidth: 2,
        borderColor: '#FFE0B2',
        borderRadius: 15,
    },
    pointText: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 18,
        color: '#E65100',
        zIndex: 1,
    },
    pointTextSelected: {
        color: 'white',
    },
    footer: {
        position: 'absolute',
        bottom: 35,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#F3F8EE',
    },
    createButtonContainer: {
        borderRadius: 15,
        elevation: 8,
        shadowColor: '#6a11cb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    createButtonGradient: {
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    createButtonText: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 20,
        color: 'white',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ecf0f1',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    dateButtonSelected: {
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
    },
    dateText: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 16,
        color: '#7f8c8d',
    },
    dateTextSelected: {
        color: 'white',
    }
});