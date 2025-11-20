import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Imports pour les polices et le Splash Screen
import * as SplashScreen from 'expo-splash-screen'
import {
    useFonts,
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold
} from '@expo-google-fonts/fredoka'

// Empêche l'écran de démarrage de disparaître tant qu'on n'est pas prêt
SplashScreen.preventAutoHideAsync()

const InitialLayout = () => {
    const { session, loading: authLoading } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    // 2. Hook de chargement des polices
    const [fontsLoaded] = useFonts({
        Fredoka_400Regular,
        Fredoka_500Medium,
        Fredoka_600SemiBold,
        Fredoka_700Bold,
    })

    // 3. Gestion combinée du chargement (Auth + Fonts)
    useEffect(() => {
        if (fontsLoaded && !authLoading) {
            // Tout est prêt, on cache l'écran de démarrage
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded, authLoading])

    // 4. Protection des routes (Redirection)
    useEffect(() => {
        if (authLoading || !fontsLoaded) return

        const inAuthGroup = segments[0] === '(auth)'

        if (!session && !inAuthGroup) {
            router.replace('/(auth)/login')
        } else if (session && inAuthGroup) {
            router.replace('/')
        }
    }, [session, authLoading, segments, fontsLoaded])

    if (!fontsLoaded || authLoading) {
        return null
    }

    return <Slot />
};

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <InitialLayout />
            </AuthProvider>
        </QueryClientProvider>
    );
}