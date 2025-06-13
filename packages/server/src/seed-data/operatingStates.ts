// Seed data for Operating States (Color Palettes)

const generateDescriptionsForState = (stateName: string, baseDescription: string, typeSpecifics: Record<number, string>) => {
  const descriptions = [];
  for (let i = 1; i <= 9; i++) {
    descriptions.push({
      typeNumber: i,
      description: typeSpecifics[i] || `Placeholder: How ${stateName} manifests for Type ${i}. ${baseDescription}`,
    });
  }
  return descriptions;
};

export const operatingStatesSeed = [
  {
    name: 'Peak Performance', // Corresponds to "Very Good"
    description: 'Operating at your best, feeling aligned, effective, and authentic. Accessing your core strengths with ease and wisdom.',
    paletteName: 'Vibrant Clarity',
    colors: ['#22c55e', '#4ade80', '#166534'], // Greens
    typeSpecificDescriptions: generateDescriptionsForState('Peak Performance', 'Accessing full potential and highest qualities.', {
      1: 'Balanced discernment, accepting imperfection while inspiring improvement. Principled and serene.',
      2: 'Unconditional love and empathy flow freely. Giving without expectation, deeply connected and humble.',
      3: 'Authentic self-expression and self-acceptance. Inspiring others through genuine achievements and inner validation.',
      4: 'Deeply connected to creative inspiration and emotional truth. Expressing unique gifts with equanimity and profound insight.',
      5: 'Visionary understanding and innovative breakthroughs. Engaging with the world confidently, sharing wisdom generously.',
      6: 'Courageous and trusting in self and others. Grounded, present, and able to act decisively without excessive worry.',
      7: 'Sober and profound joy in the present moment. Appreciating depth and limitation, finding wonder in simplicity.',
      8: 'Magnanimous and compassionate use of strength. Protecting and empowering others with innocence and mercy.',
      9: 'Dynamic engagement with self and the world. Asserting own value and direction with vibrant, peaceful energy.',
    }),
  },
  {
    name: 'Generally Balanced', // Corresponds to "Good"
    description: 'Functioning well, with good access to healthy patterns and constructive energy. Able to navigate daily life effectively.',
    paletteName: 'Harmonious Greens',
    colors: ['#10b981', '#34d399', '#065f46'], // Teals
    typeSpecificDescriptions: generateDescriptionsForState('Generally Balanced', 'Positive functioning with room for growth.', {
      1: 'Reliable, principled, and organized. Focused on doing the right thing with firm but flexible standards.',
      2: 'Warm, genuinely helpful, and appreciative of others. Building strong connections and offering support.',
      3: 'Efficient, adaptable, and goal-oriented. Confidently pursuing objectives and inspiring others.',
      4: 'Creative, introspective, and sensitive. Expressing individuality constructively and seeking meaningful connections.',
      5: 'Perceptive, knowledgeable, and independent. Developing expertise and offering insightful perspectives.',
      6: 'Responsible, committed, and prepared. Building alliances and managing potential risks effectively.',
      7: 'Optimistic, versatile, and spontaneous. Exploring new possibilities while maintaining some focus.',
      8: 'Confident, resourceful, and protective. Taking charge of situations and advocating for important causes.',
      9: 'Agreeable, calm, and supportive. Maintaining harmony and mediating conflicts effectively.',
    }),
  },
  {
    name: 'Everyday Routines', // Corresponds to "Average"
    description: 'Navigating daily life with a mix of strengths and habitual patterns. May experience some internal conflict or minor stress.',
    paletteName: 'Steady Ambers',
    colors: ['#f59e0b', '#fcd34d', '#b45309'], // Ambers
    typeSpecificDescriptions: generateDescriptionsForState('Everyday Routines', 'Typical functioning with some restrictions.', {
      1: 'Often focused on correctness and order. Inner critic is active. Can be judgmental if standards aren\'t met.',
      2: 'Seeking validation through helping. May overextend or feel unappreciated if efforts aren\'t acknowledged.',
      3: 'Image-conscious and driven by external validation. Can be competitive and overly focused on performance.',
      4: 'Prone to melancholy and self-absorption. Idealizing what\'s missing and feeling different from others.',
      5: 'Detached and analytical. May withdraw into thoughts and neglect practical needs or relationships.',
      6: 'Anxious and vigilant. Seeking reassurance and scanning for potential problems, can be indecisive.',
      7: 'Seeking stimulation and avoiding discomfort. Can be scattered and have difficulty with follow-through.',
      8: 'Controlling and assertive. May be confrontational to maintain dominance and avoid vulnerability.',
      9: 'Complacent and conflict-avoidant. May merge with others\' agendas and neglect personal priorities.',
    }),
  },
  {
    name: 'Under Pressure', // Corresponds to "Below Average"
    description: 'Experiencing significant stress and resorting to more defensive patterns. Energy may feel depleted or restricted, and core fears become more prominent.',
    paletteName: 'Warning Oranges',
    colors: ['#f97316', '#fb923c', '#c2410c'], // Oranges
    typeSpecificDescriptions: generateDescriptionsForState('Under Pressure', 'Stress responses and defensive patterns are active.', {
      1: 'Becoming rigid, judgmental, and overly critical. Intense frustration with errors and imperfections.',
      2: 'Manipulative or martyr-like behaviors to get needs met. Feeling indispensable but also resentful.',
      3: 'Deceptive or boastful to maintain image under pressure. Fear of failure leads to cutting corners.',
      4: 'Withdrawn, overly dramatic, and self-pitying. Strong feelings of shame and alienation.',
      5: 'Isolated, hoarding resources (time, energy, knowledge). Antagonistic towards perceived intrusions.',
      6: 'Overly dependent or counterphobically rebellious. Suspicious and accusatory, or taking reckless actions.',
      7: 'Impulsive, restless, and demanding. Escapist behaviors to avoid pain, can be sharp or critical.',
      8: 'Domineering, aggressive, and vengeful. Denying vulnerability and lashing out to maintain control.',
      9: 'Stubbornly disengaged and neglectful. Passive-aggressive resistance and unresponsiveness.',
    }),
  },
  {
    name: 'In Crisis', // Corresponds to "Destructive"
    description: 'Overwhelmed by stress, leading to harmful patterns and disconnection from core self. Behavior can become extreme and negatively impact self and others.',
    paletteName: 'Alert Reds',
    colors: ['#ef4444', '#f87171', '#b91c1c'], // Reds
    typeSpecificDescriptions: generateDescriptionsForState('In Crisis', 'Disconnected from core self, potentially harmful patterns.', {
      1: 'Punitive and cruel, towards self or others. Obsessive righteousness and condemnation.',
      2: 'Aggressively imposing "help" or becoming a victim to guilt-trip others. Severe emotional distress.',
      3: 'Exploitative and destructive if their image is shattered. Malicious envy or vindictiveness.',
      4: 'Clinical depression or self-destructive behaviors. Deep sense of hopelessness and despair.',
      5: 'Psychotic break from reality. Extreme isolation, bizarre phobias, or violent outbursts.',
      6: 'Self-destructive paranoia or extreme dependency. Lashing out at perceived persecutors.',
      7: 'Manic or addictive behaviors to escape pain. Impulsive self-endangerment, panic attacks.',
      8: 'Ruthless and dictatorial behavior. Eliminating threats without remorse, potential for violence.',
      9: 'Severe dissociation and depersonalization. Catatonic unresponsiveness or complete neglect of self.',
    }),
  },
];
