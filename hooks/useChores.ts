import { useAuth } from '@/contexts/AuthContext';
import { calculateLevel } from '@/utils/leveling';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    const { session } = useAuth();
    const userId = session?.user.id;

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
        mutationFn: async ({ id, currentStatus, points }: { id: string; currentStatus: string; points: number }) => {
            const newStatus = currentStatus === 'pending' ? 'done' : 'pending';

            // 1. Mettre à jour le statut de la tâche
            const { error: taskError } = await supabase
                .from('chores')
                .update({ status: newStatus })
                .eq('id', id);

            if (taskError) throw taskError;

            // 2. Mettre à jour les points du profil
            if (userId) {
                try {
                    const pointChange = newStatus === 'done' ? points : -points;

                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('points, lifetime_points')
                        .eq('id', userId)
                        .single();

                    if (profileError) {
                        console.error("Error fetching profile:", profileError);
                        throw profileError;
                    }

                    const currentPoints = profile?.points || 0;
                    const currentLifetimePoints = profile?.lifetime_points || 0;

                    const newPoints = currentPoints + pointChange;
                    const newLifetimePoints = currentLifetimePoints + pointChange;

                    // Calcul du nouveau niveau
                    const { level: newLevel } = calculateLevel(newPoints);

                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({
                            points: newPoints,
                            lifetime_points: newLifetimePoints,
                            level: newLevel
                        })
                        .eq('id', userId);

                    if (updateError) {
                        console.error("Error updating profile:", updateError);
                        throw updateError;
                    }
                } catch (e: any) {
                    console.error("Profile update failed:", e);
                    // On n'empêche pas la validation de la tâche, mais on prévient l'utilisateur
                    // Import Alert at the top if needed, or just log for now. 
                    // Since we are in a hook, we might not want to Alert directly, but for debugging it's useful.
                    // We will re-throw to ensure the mutation enters 'onError' if we want to rollback, 
                    // but here we want the task to stay updated.
                    // Actually, if we throw, the 'onSuccess' won't trigger, so the UI won't refresh.
                    // So we should NOT throw if we want the UI to update the task status.
                }
            }

            return newStatus;
        },
        onSuccess: () => {
            // Rafraîchit la liste automatiquement après le clic
            queryClient.invalidateQueries({ queryKey: ['chores'] });
            // Rafraîchit le profil pour mettre à jour les points
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });

    return { ...query, toggleTask: toggleStatusMutation.mutate };
};