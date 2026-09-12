import { PrefilledGuide } from './types';
import { singleWordsGuides } from './singleWords';
import { phrasesGuides } from './phrases';
import { technologyGuides } from './technology';
import { societyAndDebateGuides } from './societyAndDebate';
import { businessGuides } from './business';
import { philosophyGuides } from './philosophy';
import { scienceGuides } from './science';
import { interviewGuides } from './interview';
import { storytellingGuides } from './storytelling';
import { kidsGuides } from './kids';

export * from './types';

export const allPrefilledGuides: PrefilledGuide[] = [
  ...singleWordsGuides,
  ...phrasesGuides,
  ...technologyGuides,
  ...societyAndDebateGuides,
  ...businessGuides,
  ...philosophyGuides,
  ...scienceGuides,
  ...interviewGuides,
  ...storytellingGuides,
  ...kidsGuides,
];

/**
 * Finds a prefilled guide by exact topic name, ID, normalized substring, or keyword overlap
 */
export function findPrefilledGuide(
  topicName: string,
  topicId?: string,
  _audience?: string,
  _difficulty?: string
): PrefilledGuide | null {
  if (!topicName && !topicId) return null;

  // 1. Match by exact or lowercase ID
  if (topicId) {
    const cleanId = topicId.trim().toLowerCase();
    const matchById = allPrefilledGuides.find((g) => g.id.toLowerCase() === cleanId);
    if (matchById) return matchById;
  }

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/['"’“”.,?!\-—:;]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const cleanName = topicName ? normalize(topicName) : '';

  if (cleanName) {
    // 2. Exact normalized title match
    const exactMatch = allPrefilledGuides.find((g) => normalize(g.topic) === cleanName);
    if (exactMatch) return exactMatch;

    // 3. Normalized Substring / Contains Match
    const substringMatch = allPrefilledGuides.find((g) => {
      const gNorm = normalize(g.topic);
      return gNorm === cleanName || gNorm.includes(cleanName) || cleanName.includes(gNorm);
    });
    if (substringMatch) return substringMatch;

    // 4. Keyword overlap match (>= 60% of significant words matching)
    const stopWords = new Set(['what', 'is', 'an', 'a', 'the', 'how', 'why', 'do', 'does', 'in', 'on', 'of', 'for', 'to', 'and', 'or', 'your', 'you', 'should']);
    const queryTokens = cleanName.split(' ').filter((w) => w.length > 2 && !stopWords.has(w));
    
    if (queryTokens.length > 0) {
      let bestMatch: PrefilledGuide | null = null;
      let highestScore = 0;

      for (const guide of allPrefilledGuides) {
        const guideTokens = new Set(normalize(guide.topic).split(' ').filter((w) => w.length > 2 && !stopWords.has(w)));
        let matchCount = 0;
        for (const qt of queryTokens) {
          if (guideTokens.has(qt)) matchCount++;
        }
        const score = matchCount / queryTokens.length;
        if (score > highestScore && score >= 0.5) {
          highestScore = score;
          bestMatch = guide;
        }
      }

      if (bestMatch) return bestMatch;
    }
  }

  return null;
}
