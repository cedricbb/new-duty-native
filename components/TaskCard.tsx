import { Chore } from '@/hooks/useChores';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {StyleSheet, TouchableOpacity, View, Text} from "react-native";

const TASK_COLORS: Record<string, { primary: string, light: string }> = {
    broom: { primary: '#2ecc71', light: '#eafaf1' },
    bed: { primary: '#3498db', light: '#ebf5fb' },
    trash: { primary: '#e74c3c', light: '#fdedec' },
    dishes: { primary: '#00bcd4', light: '#e0f7fa' },
    toy: { primary: '#9b59b6', light: '#f4ecf7' },
    plant: { primary: '#1abc9c', light: '#e8f8f5' },
    dog: { primary: '#e67e22', light: '#fdf2e9' },
    book: { primary: '#34495e', light: '#ebedef' },
    default: { primary: '#95a5a6', light: '#f4f6f7' }
};

const getIconComponent = (iconName: string, color: string, size: number) => {
    switch (iconName) {
        case 'broom': return <MaterialCommunityIcons name="broom" size={size} color={color} />;
        case 'bed': return <MaterialCommunityIcons name="bed" size={size} color={color} />;
        case 'trash': return <MaterialCommunityIcons name="trash-can" size={size} color={color} />;
        case 'dishes': return <MaterialCommunityIcons name="silverware-clean" size={size} color={color} />;
        case 'toy': return <MaterialCommunityIcons name="toy-brick" size={size} color={color} />;
        case 'plant': return <MaterialCommunityIcons name="flower" size={size} color={color} />;
        case 'dog': return <MaterialCommunityIcons name="dog" size={size} color={color} />;
        case 'book': return <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />;
        default: return <MaterialCommunityIcons name="star" size={size} color={color} />;
    }
};

export const TaskCard = ({ task, onToggle }: { task: Chore, onToggle: () => void }) => {

    const isDone = task.status === 'done' || task.status === 'approved';
    const colors = TASK_COLORS[task.icon] || TASK_COLORS.default;
    const activePrimaryColor = isDone ? '#bdc3c7' : colors.primary;
    const activeLightBg = isDone ? '#f8f9fa' : colors.light;
    const iconColor = isDone ? '#7f8c8d' : 'white';

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: activeLightBg,
                    borderLeftColor: activePrimaryColor,
                    elevation: isDone ? 0 : 4,
                    shadowOpacity: isDone ? 0 : 0.1,
                }
            ]}
            onPress={onToggle}
            activeOpacity={0.9}
        >
            <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: activePrimaryColor }]}>
                    {getIconComponent(task.icon, iconColor, 24)}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.taskTitle, isDone && styles.textDone]}>
                        {task.title}
                    </Text>
                    <View style={styles.badgeContainer}>
                        <LinearGradient
                            colors={['#FF9966', '#FF5E62']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.pointsBadge}
                        >
                            <Text style={styles.pointsText}>+{task.points_value} Pts</Text>
                        </LinearGradient>
                    </View>
                </View>

                <View style={styles.statusContainerRight}>
                    {isDone ? (
                        <View style={styles.doneBadge}>
                            <Ionicons name="checkmark" size={16} color="white" style={{marginRight: 4}} />
                            <Text style={styles.doneText}>Fait</Text>
                        </View>
                    ) : (
                        <View style={[styles.checkbox, { borderColor: activePrimaryColor }]}>
                        </View>
                    )}
                </View>

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginBottom: 15,
        padding: 12,
        borderLeftWidth: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    taskTitle: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 17,
        color: '#2c3e50',
        marginBottom: 6,
    },
    textDone: {
        color: '#95a5a6',
        textDecorationLine: 'line-through',
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pointsText: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 13,
        color: 'white',
    },
    statusContainerRight: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 3,
    },
    doneBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2ecc71',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    doneText: {
        fontFamily: 'Fredoka_600SemiBold',
        color: 'white',
        fontSize: 12,
    },
});