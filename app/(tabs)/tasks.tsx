import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { useChores, Chore } from '@/hooks/useChores';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {TaskCard} from '@/components/TaskCard';
import {useMemo, useState} from "react";

export default function TasksScreen() {
    const { data: profile } = useProfile();
    const { data: chores, isLoading, refetch, toggleTask } = useChores(profile?.family_id);

    const handleToggle = (task: Chore) => {
        toggleTask({ id: task.id, currentStatus: task.status });
    };
    const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
    const filteredChores = useMemo(() => {
        if (!chores) return [];

        let result = chores;
        if (filter === 'pending') {
            result = chores.filter(c => c.status === 'pending');
        } else if (filter === 'done') {
            result = chores.filter(c => c.status === 'done' || c.status === 'approved');
        }

        // OPTIONNEL : Tu pourrais aussi filtrer par date ici (ex: seulement aujourd'hui)
        // const today = new Date().toISOString().split('T')[0];
        // result = result.filter(c => c.due_date.startsWith(today));

        return result;
    }, [chores, filter]);

    const FilterChip = ({ label, value, isActive }: { label: string, value: string, isActive: boolean }) => (
        <TouchableOpacity
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => setFilter(value as any)}
        >
            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Toutes les quêtes 📝</Text>
            </View>
            <View style={styles.filterRow}>
                <FilterChip label="Toutes" value="all" isActive={filter === 'all'} />
                <FilterChip label="À faire" value="pending" isActive={filter === 'pending'} />
                <FilterChip label="Terminées" value="done" isActive={filter === 'done'} />
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={chores}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#4CAF50" />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="sparkles" size={80} color="#bdc3c7" />
                            <Text style={styles.emptyText}>C'est tout propre !</Text>
                            <Text style={styles.emptySubText}>Aucune mission pour l'instant.</Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => router.push('/create-task')}
                            >
                                <Text style={styles.createButtonText}>Ajouter une mission</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TaskCard task={item} onToggle={() => handleToggle(item)} />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfdff',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 25,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 28,
        color: '#2c3e50',
        textAlign: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 22,
        color: '#7f8c8d',
        marginTop: 20,
    },
    emptySubText: {
        fontFamily: 'Fredoka_400Regular',
        fontSize: 16,
        color: '#bdc3c7',
        marginBottom: 30,
    },
    createButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
    },
    createButtonText: {
        fontFamily: 'Fredoka_700Bold',
        color: 'white',
        fontSize: 18,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f2f5',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: '#e8f5fe', // Fond bleu très clair
        borderColor: '#3498db',     // Bordure bleue
    },
    filterText: {
        fontFamily: 'Fredoka_600SemiBold',
        color: '#7f8c8d',
        fontSize: 14,
    },
    filterTextActive: {
        color: '#3498db', // Texte bleu
    },
});