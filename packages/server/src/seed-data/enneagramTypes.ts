export const enneagramTypesSeed = [
  // Type 1: The Reformer
  {
    name: 'Type 1',
    number: 1,
    nickname: 'The Reformer',
    description: 'Type Ones are principled, purposeful, self-controlled, and perfectionistic. They are driven by the desire to live the right way, improve themselves and others, and avoid moral condemnation. They strive for high standards and can be critical of themselves and others when those standards are not met.',
    coreFear: 'Of being corrupt/evil, defective, or wrong.',
    coreDesire: 'To be good, to have integrity, to be balanced.',
    keyMotivations: 'Wanting to be right, to strive higher and improve everything, to be consistent with their ideals, to justify themselves, to be beyond criticism so as not to be condemned by anyone.',
    virtue: 'Serenity',
    vice: 'Anger (Resentment)',
    affirmation: 'I am good and whole as I am. My goodness is inherent.',
    motto: 'Strive for excellence, not perfection.',
    colorHex: '#B0C4DE', // Light Steel Blue
    imageSymbolUrl: '/assets/symbols/type1_reformer.svg',
    foundationStonePrompt: 'Which values best represent your drive for integrity and improvement?',
    wingDescription: 'Type 1s typically wing to Type 9 (making them more relaxed and objective) or Type 2 (making them more helpful and people-oriented).',
    arrowsDescription: 'Type 1s go to Type 7 in growth (becoming more spontaneous and joyful) and to Type 4 in stress (becoming more moody and withdrawn).',
    stressGrowthDescription: 'Growth involves embracing imperfection and spontaneity; stress can lead to increased rigidity and self-criticism.'
  },
  // Type 2: The Helper
  {
    name: 'Type 2',
    number: 2,
    nickname: 'The Helper',
    description: 'Type Twos are empathetic, sincere, and warm-hearted. They are friendly, generous, and self-sacrificing, but can also be sentimental, flattering, and people-pleasing. They are driven by the need to be needed.',
    coreFear: 'Of being unwanted, unworthy of being loved.',
    coreDesire: 'To feel loved and appreciated.',
    keyMotivations: 'Wanting to be loved, to express their feelings for others, to be needed and appreciated, to get others to respond to them, to vindicate their claims about themselves.',
    virtue: 'Humility',
    vice: 'Pride',
    affirmation: 'I am loved for who I am, not just for what I give.',
    motto: 'Give freely, but also recognize and attend to your own needs.',
    colorHex: '#FFB6C1', // Light Pink
    imageSymbolUrl: '/assets/symbols/type2_helper.svg',
    foundationStonePrompt: 'Which values best reflect your desire to connect with and support others?',
    wingDescription: 'Type 2s typically wing to Type 1 (making them more principled and critical) or Type 3 (making them more ambitious and image-conscious).',
    arrowsDescription: 'Type 2s go to Type 4 in growth (becoming more self-aware and authentic) and to Type 8 in stress (becoming more aggressive and controlling).',
    stressGrowthDescription: 'Growth involves recognizing their own needs and finding self-worth internally; stress can lead to manipulative or martyr-like behaviors.'
  },
  // Type 3: The Achiever
  {
    name: 'Type 3',
    number: 3,
    nickname: 'The Achiever',
    description: 'Type Threes are self-assured, attractive, and charming. Ambitious, competent, and energetic, they can also be status-conscious and highly driven for advancement. They are diplomatic and poised, but can also be overly concerned with their image and what others think of them.',
    coreFear: 'Of being worthless or without inherent value.',
    coreDesire: 'To feel valuable and worthwhile.',
    keyMotivations: 'Wanting to be affirmed, to distinguish themselves from others, to have attention, to be admired, and to impress others.',
    virtue: 'Authenticity (Veracity)',
    vice: 'Deceit (Vanity)',
    affirmation: 'My value comes from within, not from my accomplishments.',
    motto: 'Pursue success that aligns with your true self.',
    colorHex: '#FFD700', // Gold
    imageSymbolUrl: '/assets/symbols/type3_achiever.svg',
    foundationStonePrompt: 'Which values best represent your drive for success and recognition?',
    wingDescription: 'Type 3s typically wing to Type 2 (making them more charming and people-oriented) or Type 4 (making them more introspective and image-focused on uniqueness).',
    arrowsDescription: 'Type 3s go to Type 6 in growth (becoming more cooperative and committed to others) and to Type 9 in stress (becoming more disengaged and apathetic).',
    stressGrowthDescription: 'Growth involves finding value in being rather than doing, and cultivating authenticity; stress can lead to workaholism and emptiness.'
  },
  // Type 4: The Individualist
  {
    name: 'Type 4',
    number: 4,
    nickname: 'The Individualist',
    description: 'Type Fours are self-aware, sensitive, reserved, and quiet. They are introspective, expressive, and creative, but can also be moody and self-conscious. Withholding themselves from others due to feeling vulnerable and defective, they can also feel disdainful and exempt from ordinary ways of living.',
    coreFear: 'Of having no identity or personal significance.',
    coreDesire: 'To find themselves and their significance, to create an identity out of their inner experience.',
    keyMotivations: 'Want to express themselves and their individuality, to create and surround themselves with beauty, to maintain certain moods and feelings, to withdraw to protect their self-image, to take care of emotional needs before attending to anything else, to attract a "rescuer."',
    virtue: 'Equanimity',
    vice: 'Envy',
    affirmation: 'I am unique and significant, and I embrace all of my emotions.',
    motto: 'Feel deeply, create authentically, and connect with true understanding.',
    colorHex: '#A020F0', // Purple
    imageSymbolUrl: '/assets/symbols/type4_individualist.svg',
    foundationStonePrompt: 'Which values best capture your search for identity and meaning?',
    wingDescription: 'Type 4s typically wing to Type 3 (making them more ambitious and dramatic in their self-expression) or Type 5 (making them more intellectual and withdrawn).',
    arrowsDescription: 'Type 4s go to Type 1 in growth (becoming more objective and principled) and to Type 2 in stress (becoming more overly-emotional and dependent).',
    stressGrowthDescription: 'Growth involves finding value in the ordinary and connecting with others through shared humanity; stress can lead to melancholy and self-absorption.'
  },
  // Type 5: The Investigator
  {
    name: 'Type 5',
    number: 5,
    nickname: 'The Investigator',
    description: 'Type Fives are alert, insightful, and curious. They are able to concentrate and focus on developing complex ideas and skills. Independent, innovative, and inventive, they can also become preoccupied with their thoughts and imaginary constructs. They become detached, yet high-strung and intense.',
    coreFear: 'Of being helpless, useless, incapable, or overwhelmed.',
    coreDesire: 'To be capable and competent.',
    keyMotivations: 'Wanting to possess knowledge, to understand the environment, to have everything figured out as a way of defending the self from threats from the environment.',
    virtue: 'Non-Attachment (Omniscience)',
    vice: 'Avarice',
    affirmation: 'I am capable and have abundant resources within me. My engagement with the world is safe.',
    motto: 'Seek knowledge, but share your wisdom and engage with the world.',
    colorHex: '#0000CD', // Medium Blue
    imageSymbolUrl: '/assets/symbols/type5_investigator.svg',
    foundationStonePrompt: 'Which values best reflect your pursuit of knowledge and understanding?',
    wingDescription: 'Type 5s typically wing to Type 4 (making them more artistic and emotional) or Type 6 (making them more practical and security-oriented).',
    arrowsDescription: 'Type 5s go to Type 8 in growth (becoming more confident and action-oriented) and to Type 7 in stress (becoming more scattered and hyperactive).',
    stressGrowthDescription: 'Growth involves engaging with the world and their emotions, and trusting their ability to cope; stress can lead to isolation and hoarding of resources.'
  },
  // Type 6: The Loyalist
  {
    name: 'Type 6',
    number: 6,
    nickname: 'The Loyalist',
    description: 'Type Sixes are engaging, responsible, anxious, and suspicious. The committed, security-oriented type. Sixes are reliable, hard-working, responsible, and trustworthy. Excellent "troubleshooters," they foresee problems and foster cooperation, but can also become defensive, evasive, and anxious—running on stress while complaining about it.',
    coreFear: 'Of being without support and guidance; of being unable to survive on their own.',
    coreDesire: 'To have security and support.',
    keyMotivations: 'Wanting to have security, to feel supported by others, to have certitude and reassurance, to test the attitudes of others toward them, to fight against anxiety and insecurity.',
    virtue: 'Courage',
    vice: 'Fear (Anxiety)',
    affirmation: 'I trust myself and my own inner guidance. I am secure.',
    motto: 'Be prepared, but trust in your ability to handle what comes.',
    colorHex: '#FFA500', // Orange
    imageSymbolUrl: '/assets/symbols/type6_loyalist.svg',
    foundationStonePrompt: 'Which values best describe your need for security and support?',
    wingDescription: 'Type 6s typically wing to Type 5 (making them more intellectual and self-reliant) or Type 7 (making them more outgoing and pleasure-seeking).',
    arrowsDescription: 'Type 6s go to Type 9 in growth (becoming more relaxed and trusting) and to Type 3 in stress (becoming more competitive and image-focused to seek validation).',
    stressGrowthDescription: 'Growth involves developing faith in themselves and others, and finding inner peace; stress can lead to increased anxiety, suspicion, or over-commitment.'
  },
  // Type 7: The Enthusiast
  {
    name: 'Type 7',
    number: 7,
    nickname: 'The Enthusiast',
    description: 'Type Sevens are extroverted, optimistic, versatile, and spontaneous. Playful, high-spirited, and practical, they can also misapply their many talents, becoming over-extended, scattered, and undisciplined. They constantly seek new and exciting experiences, but can struggle with staying present and dealing with pain.',
    coreFear: 'Of being deprived and in pain; of being trapped in suffering.',
    coreDesire: 'To be satisfied and content; to have their needs fulfilled.',
    keyMotivations: 'Want to maintain their freedom and happiness, to avoid missing out on worthwhile experiences, to keep themselves excited and occupied, to avoid and discharge pain.',
    virtue: 'Sobriety (Joyful Limitation)',
    vice: 'Gluttony',
    affirmation: 'I find true joy and satisfaction in the present moment.',
    motto: 'Embrace joy fully, but find it in depth, not just breadth.',
    colorHex: '#FFFF00', // Yellow
    imageSymbolUrl: '/assets/symbols/type7_enthusiast.svg',
    foundationStonePrompt: 'Which values best reflect your pursuit of joy and new experiences?',
    wingDescription: 'Type 7s typically wing to Type 6 (making them more responsible and anxious) or Type 8 (making them more assertive and powerful).',
    arrowsDescription: 'Type 7s go to Type 5 in growth (becoming more focused and profound) and to Type 1 in stress (becoming more critical and perfectionistic).',
    stressGrowthDescription: 'Growth involves embracing sobriety and finding joy in the present moment, even with its limitations; stress can lead to scattered energy and escapism.'
  },
  // Type 8: The Challenger
  {
    name: 'Type 8',
    number: 8,
    nickname: 'The Challenger',
    description: 'Type Eights are self-confident, strong, and assertive. Protective, resourceful, straight-talking, and decisive, but can also be ego-centric and domineering. Eights feel they must control their environment, especially people, sometimes becoming confrontational and intimidating.',
    coreFear: 'Of being harmed or controlled by others; of violation.',
    coreDesire: 'To protect themselves (to be in control of their own life and destiny).',
    keyMotivations: 'Wanting to be self-reliant, to prove their strength and resist weakness, to be important in their world, to dominate the environment, and to stay in control of their situation.',
    virtue: 'Innocence (Power with, not Power over)',
    vice: 'Lust (Excess)',
    affirmation: 'I can be vulnerable and trust others. My true strength includes compassion.',
    motto: 'Use your strength to empower, not overpower.',
    colorHex: '#8B0000', // Dark Red
    imageSymbolUrl: '/assets/symbols/type8_challenger.svg',
    foundationStonePrompt: 'Which values best describe your need for control and self-reliance?',
    wingDescription: 'Type 8s typically wing to Type 7 (making them more expansive and pleasure-seeking) or Type 9 (making them more receptive and peace-loving).',
    arrowsDescription: 'Type 8s go to Type 2 in growth (becoming more caring and compassionate) and to Type 5 in stress (becoming more secretive and fearful).',
    stressGrowthDescription: 'Growth involves embracing vulnerability and using their strength to protect and uplift others; stress can lead to excessive control and aggression.'
  },
  // Type 9: The Peacemaker
  {
    name: 'Type 9',
    number: 9,
    nickname: 'The Peacemaker',
    description: 'Type Nines are accepting, trusting, and stable. They are usually creative, optimistic, and supportive, but can also be too willing to go along with others to keep the peace. They want everything to go smoothly and be without conflict, but they can also tend to be complacent, simplifying problems and minimizing anything upsetting.',
    coreFear: 'Of loss and separation; of fragmentation or annihilation.',
    coreDesire: 'To have inner stability and peace of mind.',
    keyMotivations: 'Wanting to create harmony in their environment, to avoid conflicts and tension, to preserve things as they are, to resist whatever would upset or disturb them.',
    virtue: 'Action (Right Action)',
    vice: 'Sloth (Self-Forgetfulness)',
    affirmation: 'My presence matters, and my voice is important.',
    motto: 'Seek peace within, then engage with the world from that place.',
    colorHex: '#90EE90', // Light Green
    imageSymbolUrl: '/assets/symbols/type9_peacemaker.svg',
    foundationStonePrompt: 'Which values best reflect your desire for harmony and peace?',
    wingDescription: 'Type 9s typically wing to Type 8 (making them more assertive and independent) or Type 1 (making them more purposeful and orderly).',
    arrowsDescription: 'Type 9s go to Type 3 in growth (becoming more self-developing and energetic) and to Type 6 in stress (becoming more anxious and worried).',
    stressGrowthDescription: 'Growth involves engaging their own agenda and asserting their needs; stress can lead to stubbornness, disengagement, or passive-aggression.'
  },
];
