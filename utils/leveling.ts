export const LEVEL_THRESHOLD = 100;

export function calculateLevel(points: number) {
    // Niveau 1 à 0 points.
    // Niveau 2 à 100 points.
    // Niveau 3 à 200 points.
    const level = 1 + Math.floor(points / LEVEL_THRESHOLD);

    const currentLevelBase = (level - 1) * LEVEL_THRESHOLD;
    const nextLevelThreshold = level * LEVEL_THRESHOLD;

    const pointsInCurrentLevel = points - currentLevelBase;
    const pointsNeededForNextLevel = nextLevelThreshold - points;

    const progress = pointsInCurrentLevel / LEVEL_THRESHOLD;

    return {
        level,
        currentLevelBase,
        nextLevelThreshold,
        pointsInCurrentLevel,
        pointsNeededForNextLevel,
        progress
    };
}
