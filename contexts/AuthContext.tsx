import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true, isAdmin: false, signOut: async () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Vérifier si une session existe déjà (stockée dans le téléphone)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 2. Écouter les changements (Connexion, Déconnexion)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erreur de déconnexion:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ session, loading, isAdmin: false, signOut: handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};