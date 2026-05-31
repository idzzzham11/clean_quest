// 10 educational missions definition
var MissionData = [
    {
        id: 'mission_1',
        name: 'Fresh Start',
        description: 'Collect 3 clean uniforms across any levels',
        icon: '👔',
        objective: { type: 'uniform', count: 3 },
        reward: { type: 'badge', key: 'badge_soap', name: 'Soap Badge' },
        hint: 'Clean uniforms are scattered across office and salon levels!'
    },
    {
        id: 'mission_2',
        name: 'Germ Stomper',
        description: 'Stomp 10 germs by jumping on them',
        icon: '🦠',
        objective: { type: 'germ_stomp', count: 10 },
        reward: { type: 'stars', amount: 5, name: 'Hygiene Stars ×5' },
        hint: 'Jump on germs from above to defeat them safely!'
    },
    {
        id: 'mission_3',
        name: 'Quiz Champion',
        description: 'Answer 5 quiz questions correctly in a row',
        icon: '🎯',
        objective: { type: 'quiz_streak', count: 5 },
        reward: { type: 'certificate', name: 'Level 1 Certificate' },
        hint: 'Read each question carefully and choose the best answer!'
    },
    {
        id: 'mission_4',
        name: 'Soap Collector',
        description: 'Collect soap items in every level',
        icon: '🧼',
        objective: { type: 'soap', count: 5 },
        reward: { type: 'badge', key: 'badge_deodorant', name: 'Deodorant Badge' },
        hint: 'Look for soap bars on platforms in each level!'
    },
    {
        id: 'mission_5',
        name: 'Hazard Dodger',
        description: 'Complete a level without touching any hazard',
        icon: '🛡️',
        objective: { type: 'level_no_hazard', count: 1 },
        reward: { type: 'powerup', name: 'Speed Boost Powerup' },
        hint: 'Jump over oil spills and avoid dirty clouds completely!'
    },
    {
        id: 'mission_6',
        name: 'Hair Hero',
        description: 'Collect both a hairnet AND a comb in the same level',
        icon: '💇',
        objective: { type: 'hair_combo', count: 1 },
        reward: { type: 'unlock', key: 'player_salon', name: 'Salon Uniform' },
        hint: 'Find the hairnet and comb before reaching the level exit!'
    },
    {
        id: 'mission_7',
        name: 'Kitchen Safe',
        description: 'Complete the Restaurant Kitchen level without losing health',
        icon: '👨‍🍳',
        objective: { type: 'level_no_damage', levelId: 3, count: 1 },
        reward: { type: 'unlock', key: 'player_kitchen', name: 'Chef Hat Accessory' },
        hint: 'Carefully dodge all hazards in the kitchen level!'
    },
    {
        id: 'mission_8',
        name: 'Scent Master',
        description: 'Defeat 3 Smell Cloud enemies by stomping them',
        icon: '💨',
        objective: { type: 'smell_cloud', count: 3 },
        reward: { type: 'powerup', name: 'Deodorant Shield Powerup' },
        hint: 'Time your jump carefully to land on smell clouds!'
    },
    {
        id: 'mission_9',
        name: 'Nail Care Pro',
        description: 'Collect all 5 nail clippers hidden across levels',
        icon: '💅',
        objective: { type: 'nail_clipper', count: 5 },
        reward: { type: 'unlock', key: 'gloves_golden', name: 'Golden Gloves Unlock' },
        hint: 'Nail clippers are hidden in hard-to-reach places!'
    },
    {
        id: 'mission_10',
        name: 'Workplace Champion',
        description: 'Complete all 5 levels with 2 or more stars each',
        icon: '🏆',
        objective: { type: 'all_levels_stars', minStars: 2, count: 5 },
        reward: { type: 'certificate', name: 'Gold Workplace Champion Certificate' },
        hint: 'Collect coins, answer quizzes correctly, and avoid hazards!'
    }
];
