import { Tabs } from 'expo-router';
import {FontAwesome, FontAwesome5} from '@expo/vector-icons'; // Des icônes sympas
import { useFonts, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {

    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#95a5a6',

                // Style de la barre du bas
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 5,
                },

                // Style du texte des onglets
                tabBarLabelStyle: {
                    fontFamily: 'Fredoka_600SemiBold',
                    fontSize: 12,
                    marginBottom: Platform.OS === 'android' ? 5 : 0,
                },
            }}
        >
            {/* Onglet 1 : Dashboard */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={24} color={color} />
                    ),
                }}
            />

            {/* Onglet 2 : Tâches */}
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Tâches',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="broom" size={26} color={color} />
                    ),
                }}
            />

            {/* Onglet 3 : Famille */}
            <Tabs.Screen
                name="family"
                options={{
                    title: 'Ma Meute',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="egg" size={26} color={color} />
                    ),
                }}
            />

            {/* Onglet 4 : Récompsenses */}
            <Tabs.Screen
                name="rewards"
                options={{
                    title: 'Récompsenses',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="trophy" size={26} color={color} />
                    ),
                }}
            />

            {/* Onglet 5 : Compte */}
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="user-alt" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}