import { View, Text, StyleSheet } from 'react-native';

export default function TasksScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste des Tâches 🧹</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' },
    title: { fontFamily: 'Fredoka_700Bold', fontSize: 24, color: '#2c3e50' }
});