import { findPrefilledGuide } from './teleprompter';
import { getSpeakingGuideForTopic } from './speakingGuides';

export interface PredefinedSpeechScript {
  title: string;
  topicName: string;
  wordCount: number;
  paragraphs: string[];
  keyTalkingPoints: string[];
}

/**
 * Splits a long text paragraph into clean, natural speaking chunks (2-3 sentences each)
 */
function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  const paragraphs: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    current += sentences[i];
    if ((i + 1) % 3 === 0 || i === sentences.length - 1) {
      if (current.trim()) {
        paragraphs.push(current.trim());
      }
      current = '';
    }
  }

  return paragraphs.length > 0 ? paragraphs : [text];
}

/**
 * Retrieves the authentic, hand-crafted speech script for a topic.
 * Prioritizes prefilled teleprompter guides and multi-angle speaking guides.
 */
export function getPredefinedSpeechScript(
  topicName: string,
  topicId?: string
): PredefinedSpeechScript {
  // 1. Try finding in authentic 250+ curated teleprompter guides
  const guide = findPrefilledGuide(topicName, topicId);
  if (guide && guide.fullParagraph) {
    const paragraphs = splitIntoParagraphs(guide.fullParagraph);
    const wordCount = guide.fullParagraph.split(/\s+/).filter(Boolean).length;

    const keyPoints: string[] = guide.sections && guide.sections.length > 0
      ? guide.sections.map((s) => `${s.title}: ${s.content.slice(0, 100)}...`)
      : [
          `Key concept and operational context of ${topicName}.`,
          `Practical real-world application and workflow integration.`,
          `Essential considerations, trade-offs, and strategic takeaways.`,
        ];

    return {
      title: `${topicName}`,
      topicName,
      wordCount,
      paragraphs,
      keyTalkingPoints: keyPoints,
    };
  }

  // 2. Try multi-angle curated speaking guides
  const speakingGuide = getSpeakingGuideForTopic(topicName);
  if (speakingGuide && speakingGuide.sections && speakingGuide.sections.length > 0) {
    const paragraphs = speakingGuide.sections.map((s) => `${s.title} — ${s.content}`);
    const fullText = speakingGuide.sections.map((s) => s.content).join(' ');
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    return {
      title: `${topicName} (${speakingGuide.angleName})`,
      topicName,
      wordCount,
      paragraphs,
      keyTalkingPoints: speakingGuide.sections.map((s) => `${s.title}: ${s.content}`),
    };
  }

  // 3. Fallback to natural topic summary
  const defaultParagraphs = [
    `${topicName} is an important subject that touches upon key principles, real-life applications, and future developments.`,
    `When discussing this topic, focus on explaining the foundational ideas, how it works in practice, and why it matters to your audience.`,
    `Conclude by summarizing the main insight, key benefits, and your perspective on how it will evolve over time.`,
  ];

  return {
    title: `${topicName}`,
    topicName,
    wordCount: defaultParagraphs.join(' ').split(/\s+/).filter(Boolean).length,
    paragraphs: defaultParagraphs,
    keyTalkingPoints: [
      `1. Introduce ${topicName} with a clear core perspective.`,
      `2. Discuss practical real-world implications.`,
      `3. Deliver a concise, actionable conclusion.`,
    ],
  };
}

/**
 * Returns the authentic speech script (backward compatible alias)
 */
export function getDynamicSpeechScript(
  topicName: string,
  customParagraphs?: string[]
): PredefinedSpeechScript {
  if (customParagraphs && customParagraphs.length > 0) {
    return {
      title: `Speaking Guide: ${topicName}`,
      topicName,
      wordCount: customParagraphs.join(' ').split(/\s+/).filter(Boolean).length,
      paragraphs: customParagraphs,
      keyTalkingPoints: [
        `Key concept and context of ${topicName}.`,
        `Core insights and real-world application.`,
        `Closing summary and strategic takeaway.`,
      ],
    };
  }
  return getPredefinedSpeechScript(topicName);
}

/**
 * Returns authentic topic information text
 */
export function getTopicInformation(topicName: string, topicId?: string): string {
  const script = getPredefinedSpeechScript(topicName, topicId);
  return script.paragraphs.join('\n\n');
}
