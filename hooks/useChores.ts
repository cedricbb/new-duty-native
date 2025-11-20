import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useChores = (familyId: string) => {
    return useQuery({
        queryKey: ['chores', familyId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('chores')
                .select('*')
                .eq('family_id', familyId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });
};