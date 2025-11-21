import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type Chore = {
    id: string;
    title: string;
    points_value: number;
    icon: string;
    status: 'pending' | 'done' | 'approved';
    created_at: string;
};

export const useChores = (familyId: string | null | undefined) => {
    const queryClient = useQueryClient();

    // 1. Récupérer les tâches
    const query = useQuery({
        queryKey: ['chores', familyId],
        enabled: !!familyId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('chores')
                .select('*')
                .eq('family_id', familyId)
                .order('created_at', { ascending: false }); // Les plus récentes en haut

            if (error) throw error;
            return data as Chore[];
        },
    });

    // 2. Action : Marquer comme Fait / Non Fait
    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
            const newStatus = currentStatus === 'pending' ? 'done' : 'pending';

            const { error } = await supabase
                .from('chores')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            return newStatus;
        },
        onSuccess: () => {
            // Rafraîchit la liste automatiquement après le clic
            queryClient.invalidateQueries({ queryKey: ['chores'] });
        },
    });

    return { ...query, toggleTask: toggleStatusMutation.mutate };
};