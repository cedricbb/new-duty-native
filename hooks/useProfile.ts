import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type Profile = {
    id: string;
    family_id: string | null;
    role: 'parent' | 'child';
    pseudo: string;
    points: number;
    day_streak: number;
};

export const useProfile = () => {
    const { session } = useAuth();
    const userId = session?.user.id;

    return useQuery({
        queryKey: ['profile', userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single(); // On ne s'attend qu'à un seul profil

            if (error) throw error;
            return data as Profile;
        },
    });
};