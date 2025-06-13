// Seed data for Instinctual Stackings

interface TypeSpecificStackingSeed {
  typeNumber: number;
  subtypeName: string;
  description: string;
}

const generateStackingDescriptions = (
  stackName: string,
  baseDescription: string,
  typeSpecifics: Record<number, { subtypeName: string; description: string }>
): TypeSpecificStackingSeed[] => {
  const descriptions: TypeSpecificStackingSeed[] = [];
  for (let i = 1; i <= 9; i++) {
    const specifics = typeSpecifics[i] || {
      subtypeName: `Type ${i} ${stackName} Placeholder Name`,
      description: `Placeholder description for Type ${i} with ${stackName} stacking. ${baseDescription}`
    };
    descriptions.push({
      typeNumber: i,
      subtypeName: specifics.subtypeName,
      description: specifics.description,
    });
  }
  return descriptions;
};

export const instinctualStackingsSeed = [
  // Self-Preservation / Social (sp/so)
  {
    stack: 'sp/so',
    primaryInstinct: 'Self-Preservation',
    secondaryInstinct: 'Social',
    blindInstinct: 'Sexual/One-to-One',
    generalDescription: 'Focuses on material security, well-being, and community connection. May neglect intense one-to-one bonds or deep intimacy in favor of broader social engagement and personal stability. Often practical and community-minded.',
    typeSpecificDescriptions: generateStackingDescriptions('sp/so', 'Practical, community-focused, seeks stability.', {
      1: { subtypeName: 'The Guardian', description: 'Strives for perfect environments and systems for security. Socially responsible, upholding standards within groups. Can worry excessively about resources and correctness.' },
      2: { subtypeName: 'The Ambitious Helper', description: 'Seeks security through indispensable social roles. Uses helpfulness to gain allies and ensure their place in the group. May neglect intimate bonds for broader social approval.' },
      3: { subtypeName: 'The Secure Performer', description: 'Focuses on achieving material success and a secure social standing. Their image is one of competence and reliability within their community or profession.' },
      4: { subtypeName: 'The Creative Provider', description: 'Seeks to provide for themselves and find a secure niche through their unique talents. Socially, they may feel like an outsider but still desire a place to contribute their distinctiveness.' },
      5: { subtypeName: 'The Castle Keeper', description: 'Builds strong boundaries and accumulates resources (knowledge, space) for security. Socially selective, engaging with groups that respect their expertise and independence.' },
      6: { subtypeName: 'The Community Builder', description: 'Seeks security through alliances and loyal group affiliations. Works to create safe and stable communities. Highly responsible and prepared.' },
      7: { subtypeName: 'The Pragmatic Networker', description: 'Finds security and opportunity through a wide network of enjoyable social connections. Practical about maintaining resources to fund their experiences.' },
      8: { subtypeName: 'The Resourceful Protector', description: 'Ensures security by controlling resources and protecting their chosen "family" or group. Pragmatic and powerful in community matters.' },
      9: { subtypeName: 'The Comfortable Contributor', description: 'Seeks peace through stable routines and comfortable social connections. Contributes to groups in a steady, unassuming way to maintain harmony and personal well-being.' },
    }),
  },
  // Social / Self-Preservation (so/sp)
  {
    stack: 'so/sp',
    primaryInstinct: 'Social',
    secondaryInstinct: 'Self-Preservation',
    blindInstinct: 'Sexual/One-to-One',
    generalDescription: 'Focuses on group belonging, social status, and contribution, supported by a need for personal security. May find it challenging to prioritize deep, intense connections over group dynamics or personal well-being. Often seen as friendly and responsible.',
    typeSpecificDescriptions: generateStackingDescriptions('so/sp', 'Friendly, responsible, seeks belonging.', {
      1: { subtypeName: 'The Model Citizen', description: 'Strives to be a model of integrity and correct behavior within their social sphere. Their self-preservation ensures they have the stability to maintain their social role and advocate for principles.' },
      2: { subtypeName: 'The Indispensable Friend', description: 'Focuses on being central to their social groups, gaining security by being needed and well-regarded. Ensures their own well-being to continue supporting others.' },
      3: { subtypeName: 'The Polished Diplomat', description: 'Cultivates a successful and admirable image within their social and professional circles. Material security supports their social standing and achievements.' },
      4: { subtypeName: 'The Socially Conscious Artist', description: 'Seeks to make a unique and meaningful impact on society or their chosen group. Uses their self-preservation to support their artistic or social contributions.' },
      5: { subtypeName: 'The Expert Contributor', description: 'Engages with groups where their knowledge is valued. Seeks social recognition for their expertise, while maintaining personal space and resourcefulness.' },
      6: { subtypeName: 'The Loyal Ally', description: 'Dedicated to their chosen groups and causes, finding security in social bonds and shared duties. Ensures their own stability to better serve the group.' },
      7: { subtypeName: 'The Social Planner', description: 'Organizes enjoyable group activities and maintains a wide social circle for fun and support. Ensures they have the resources for these social engagements.' },
      8: { subtypeName: 'The Community Leader', description: 'Uses their strength to lead and protect their community or group. Their self-preservation ensures they have the power and resources to maintain their leadership.' },
      9: { subtypeName: 'The Harmonious Mediator', description: 'Works to maintain peace and connection within their social groups. Their personal comfort is often tied to the well-being and harmony of the group.' },
    }),
  },
  // Self-Preservation / Sexual (sp/sx)
  {
    stack: 'sp/sx',
    primaryInstinct: 'Self-Preservation',
    secondaryInstinct: 'Sexual/One-to-One',
    blindInstinct: 'Social',
    generalDescription: 'Prioritizes personal security, comfort, and well-being, with a secondary focus on intense, close relationships. May be less concerned with broader social connections or group belonging. Often private and deeply committed to a few.',
    typeSpecificDescriptions: generateStackingDescriptions('sp/sx', 'Private, intense with a few, seeks comfort.', {
      1: { subtypeName: 'The Controlled Intensity', description: 'Focuses on perfecting their immediate environment and close relationships. Intense desire for deep, "correct" connections, but can be very private or critical in these bonds.' },
      2: { subtypeName: 'The Secret Seducer', description: 'Prioritizes security and comfort, but uses intense charm and connection to secure key relationships that provide these. May be less broadly social.' },
      3: { subtypeName: 'The Charismatic Provider', description: 'Strives for material success to attract and maintain intense, desirable partnerships. Focus is on providing an ideal lifestyle for themselves and a chosen few.' },
      4: { subtypeName: 'The Intimate Individualist', description: 'Seeks deep, authentic connection with a select few who understand their unique inner world. Their self-preservation is about creating a safe space for this intensity.' },
      5: { subtypeName: 'The Secret World Builder', description: 'Creates a secure, private world for themselves and a few trusted intimates. Shares their complex inner life only in very deep, reliable connections.' },
      6: { subtypeName: 'The Protective Partner', description: 'Finds security in a strong, trustworthy one-to-one bond. Intensely loyal and protective of this relationship, less concerned with wider group approval.' },
      7: { subtypeName: 'The Selective Enthusiast', description: 'Seeks intense, exciting experiences with a chosen partner or close friend. Their self-preservation ensures they have the resources for these shared adventures.' },
      8: { subtypeName: 'The Possessive Protector', description: 'Focuses on controlling their environment and resources to protect intense, loyal bonds. Deeply committed and possessive of their inner circle.' },
      9: { subtypeName: 'The Merged Comfort Seeker', description: 'Finds ultimate comfort and security by merging deeply with a significant other. Their world revolves around this primary bond and shared domestic peace.' },
    }),
  },
  // Sexual / Self-Preservation (sx/sp)
  {
    stack: 'sx/sp',
    primaryInstinct: 'Sexual/One-to-One',
    secondaryInstinct: 'Self-Preservation',
    blindInstinct: 'Social',
    generalDescription: 'Driven by intense connection, passion, and chemistry in close relationships, supported by a need for personal comfort and security to enjoy these bonds. Broader social engagement is often secondary. Can be very magnetic and focused.',
    typeSpecificDescriptions: generateStackingDescriptions('sx/sp', 'Magnetic, passionate, seeks deep bonds with security.', {
      1: { subtypeName: 'The Zealous Reformer', description: 'Intense focus on perfecting a chosen partner or cause. Their self-preservation ensures they have the stability to pursue this intensity with focused energy.' },
      2: { subtypeName: 'The Seductive Giver', description: 'Uses intense charm and focused attention to win over and merge with significant others. Their self-preservation aims to create a comfortable nest for the relationship.' },
      3: { subtypeName: 'The Dazzling Star', description: 'Seeks to be intensely desirable and successful to attract and keep high-value partners. Their material well-being enhances their attractiveness and relationship security.' },
      4: { subtypeName: 'The Intense Romantic', description: 'Craves deep, passionate, and unique connections. Their self-preservation is about creating a stable container for the storms of their relational intensity.' },
      5: { subtypeName: 'The Secretive Analyst', description: 'Forms very few, but extremely deep and intense intellectual or emotional bonds. Their self-preservation protects the sanctity and privacy of these connections.' },
      6: { subtypeName: 'The Committed Skeptic', description: 'Seeks intense loyalty and trust in a partner, testing them to ensure security. Their self-preservation is about ensuring this key relationship is a safe haven.' },
      7: { subtypeName: 'The Fascination Seeker', description: 'Chases intense experiences and connections with fascinating individuals. Their self-preservation ensures they have the means to pursue these stimulating bonds.' },
      8: { subtypeName: 'The Unyielding Commander', description: 'Forms powerful, all-consuming bonds, seeking total loyalty and control within the relationship. Their self-preservation ensures the relationship\'s (and their) survival and dominance.' },
      9: { subtypeName: 'The Fused Partner', description: 'Seeks complete and comfortable merging with a partner. Their self-preservation is about maintaining the blissful union and shared resources.' },
    }),
  },
  // Social / Sexual (so/sx)
  {
    stack: 'so/sx',
    primaryInstinct: 'Social',
    secondaryInstinct: 'Sexual/One-to-One',
    blindInstinct: 'Self-Preservation',
    generalDescription: 'Focuses on group connection, social contribution, and influencing their environment, with a secondary drive for intense, meaningful one-to-one bonds. May neglect personal well-being or practical needs in favor of social and relational intensity. Often charismatic and engaging.',
    typeSpecificDescriptions: generateStackingDescriptions('so/sx', 'Charismatic, engaging, seeks group influence and intense bonds.', {
      1: { subtypeName: 'The Social Crusader', description: 'Passionate about reforming society or their group, seeking intense connections with like-minded allies. May neglect personal needs for the cause.' },
      2: { subtypeName: 'The Popular Confidante', description: 'Builds wide social networks and cultivates a few deep, influential friendships. Their focus is on being loved by many and adored by a select few.' },
      3: { subtypeName: 'The Social Icon', description: 'Strives to be a prominent and admired figure within their social sphere, forming intense connections with influential people. Image and impact are key.' },
      4: { subtypeName: 'The Expressive Catalyst', description: 'Uses their unique talents to impact their social group, seeking intense, authentic connections with those who appreciate their depth. Can be a social critic.' },
      5: { subtypeName: 'The Knowledgeable Influencer', description: 'Shares their expertise with select groups or individuals, seeking intense intellectual connections and recognition for their unique insights. May neglect practical self-care.' },
      6: { subtypeName: 'The Dedicated Ally', description: 'Forms strong bonds within their chosen group or cause, seeking intense loyalty and connection with key figures. Their commitment can overshadow personal needs.' },
      7: { subtypeName: 'The Charismatic Visionary', description: 'Inspires groups with exciting ideas and possibilities, forming intense bonds with those who share their enthusiasm. Can be prone to overstimulation and burnout.' },
      8: { subtypeName: 'The Group Mobilizer', description: 'Leads and energizes groups, forming powerful alliances and intense loyalties. Their focus is on collective impact and shared intensity.' },
      9: { subtypeName: 'The Inclusive Harmonizer', description: 'Creates broad social harmony and fosters deep connections within the group. Seeks to make everyone feel included and valued, sometimes at personal cost.' },
    }),
  },
  // Sexual / Social (sx/so)
  {
    stack: 'sx/so',
    primaryInstinct: 'Sexual/One-to-One',
    secondaryInstinct: 'Social',
    blindInstinct: 'Self-Preservation',
    generalDescription: 'Driven by a need for intense, passionate connections and experiences, with a secondary focus on sharing this intensity with a broader social circle or making an impact. Practical self-care and material security may be neglected. Often magnetic and impactful.',
    typeSpecificDescriptions: generateStackingDescriptions('sx/so', 'Magnetic, impactful, seeks passionate connections within a social context.', {
      1: { subtypeName: 'The Ardent Standard-Bearer', description: 'Intensely passionate about their ideals, seeking to attract and convert others to their cause or vision within a social context. Can be a fiery advocate.' },
      2: { subtypeName: 'The Irresistible Charmer', description: 'Uses intense personal magnetism to connect with and influence a wide range of people. Seeks to be the most desired and impactful person in their social sphere.' },
      3: { subtypeName: 'The Superstar', description: 'Strives to be intensely attractive and successful, captivating a wide audience or social group. Their performance and image are geared for maximum impact and adoration.' },
      4: { subtypeName: 'The Dramatic Provocateur', description: 'Uses their intense emotions and unique perspective to provoke and engage their social environment. Seeks deep, meaningful connections that have a broader impact.' },
      5: { subtypeName: 'The Revolutionary Thinker', description: 'Develops intense, groundbreaking ideas and seeks to share them with influential groups or individuals, creating a significant impact. May be provocative.' },
      6: { subtypeName: 'The Passionate Loyalist', description: 'Forms intense bonds of loyalty and commitment, often within a social cause or group. Their passion fuels their dedication to others and their ideals.' },
      7: { subtypeName: 'The Pied Piper', description: 'Seeks intense joy and stimulation, drawing a social following into their exciting experiences and visions. Charismatic and inspiring, but can lack grounding.' },
      8: { subtypeName: 'The Charismatic Leader', description: 'Uses their powerful intensity to attract followers and lead impactful social movements or groups. Passionate, protective, and commanding.' },
      9: { subtypeName: 'The Universal Connector', description: 'Seeks to merge intensely with individuals as a way to feel connected to the larger whole or their social group. Radiates a gentle, captivating energy.' },
    }),
  },
];
