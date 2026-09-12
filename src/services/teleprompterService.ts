import { findPrefilledGuide } from '../data/teleprompter';
import { api } from './api';
import { TopicDifficulty, AudienceType } from '../types';

const CACHE_PREFIX = 'speakvaani_teleprompter_cache_v2_';

export interface TeleprompterGuideResult {
  topicName: string;
  type: string;
  angleIndex: number;
  totalAngles: number;
  angleName: string;
  fullParagraph: string;
  wordCount: number;
}

/**
 * Validates whether generated paragraph has sufficient depth and lacks instruction placeholders
 */
export function validateContinuousParagraph(paragraph: string): boolean {
  if (!paragraph || paragraph.trim().length < 120) return false;

  const INSTRUCTION_PATTERNS = [
    /^(explain|clarify|break down|discuss|describe|mention|summarize|talk about|consider|think about|provide an example|give an example)/i,
    /explain how (it|the|this) works/i,
    /clarify the core/i,
    /mention constraints/i,
    /summarize why/i,
  ];

  let instructionCount = 0;
  for (const p of INSTRUCTION_PATTERNS) {
    if (p.test(paragraph)) instructionCount++;
  }

  return instructionCount === 0;
}

/**
 * Deterministic generator for 250+ word continuous knowledge fallback
 */
export function generateContinuousFallback(
  topicName: string,
  categoryName?: string,
  _difficulty: TopicDifficulty = 'MEDIUM',
  angleIndex: number = 0
): TeleprompterGuideResult {
  // Check if hand-crafted 300-350 word curated guide exists first
  const prefilled = findPrefilledGuide(topicName);
  if (prefilled && prefilled.fullParagraph) {
    const wordCount = prefilled.fullParagraph.trim().split(/\s+/).length;
    return {
      topicName: prefilled.topic,
      type: (prefilled.topicType || 'general').toLowerCase(),
      angleIndex: 0,
      totalAngles: 1,
      angleName: 'Curated Knowledge Guide',
      fullParagraph: prefilled.fullParagraph,
      wordCount,
    };
  }

  const norm = topicName.trim().toLowerCase();
  const words = norm.split(/\s+/).filter(Boolean);
  const isSingleWord = words.length === 1;
  const isPhrase = words.length >= 2 && words.length <= 4 && !norm.includes('?') && !norm.endsWith('.');
  const isQuestion = norm.startsWith('should') || norm.startsWith('is ') || norm.startsWith('why') || norm.includes('vs') || norm.includes('?');

  const angles = [
    'Perspective: Core Mechanisms & Principles',
    'Perspective: Trade-offs & Human Factors',
    'Perspective: Industry Evolution & Future Outlook',
  ];

  const chosenAngle = angles[angleIndex % 3];

  let text = '';
  if (isSingleWord) {
    text = `The concept of "${topicName}" represents one of the most foundational principles in human psychology, systems design, and personal mastery. At its essence, "${topicName}" operates not merely as an abstract virtue or static definition, but as an active mental discipline and operational catalyst that governs how individuals and high-performing organizations respond to friction, uncertainty, and high-pressure environments. When examined through a cognitive and behavioral lens, cultivating "${topicName}" requires overcoming immediate instinctual impulses in favor of long-term strategic compounding. This mental posture allows practitioners to maintain unwavering clarity while navigating unpredictable external volatility and conflicting priorities. Historical case studies across science, enterprise, and philosophy consistently demonstrate that breakthrough achievements rarely stem from sudden strokes of isolated genius; rather, they are forged through the relentless, disciplined application of "${topicName}" across continuous iterative feedback cycles. In contrast, a systemic deficit in "${topicName}" frequently leads to fragile decision-making, premature surrender in the face of setbacks, and short-sighted reactive behaviors that undermine collective trust and momentum. To apply "${topicName}" meaningfully in daily life and leadership, one must cultivate deliberate self-awareness, establish clear ethical and operational boundaries, and recognize that true mastery is built through small, consistent actions repeated over time. Furthermore, in an era characterized by information saturation and rapid technological shifts, the ability to embody "${topicName}" provides an indispensable competitive advantage. It bridges the gap between theoretical knowledge and practical execution, turning aspirational intentions into concrete, measurable impact. Ultimately, "${topicName}" serves as an enduring anchor for anyone seeking to build resilience, communicate with conviction, and lead with lasting purpose.`;
  } else if (isPhrase) {
    text = `Exploring the conceptual framework of "${topicName}" reveals critical insights into modern strategic decision-making, behavioral economics, and organizational excellence. Rather than functioning as a simplistic buzzword, "${topicName}" encapsulates a sophisticated dynamic where competing incentives, technological acceleration, and human cognitive habits intersect to create unexpected second-order consequences. In practical execution, embracing the principles behind "${topicName}" enables leaders, creators, and engineers to identify hidden leverage points, eliminate systemic inefficiencies, and construct resilient systems that thrive under conditions of rapid change. Consider how top-tier organizations and innovative pioneers apply this model: by acknowledging the non-linear realities described by "${topicName}", they avoid common cognitive traps such as short-term optimization at the expense of long-term sustainability, thereby outmaneuvering competitors who remain anchored to outdated dogmas. However, navigating "${topicName}" effectively demands intellectual humility, continuous empirical feedback, and the courage to challenge established assumptions when real-world evidence diverges from theoretical expectations. When teams fail to account for its subtleties, they risk misallocating vital capital, alienating core stakeholders, and creating unintended friction across interconnected workflows. Moreover, as global networks and digital ecosystems become increasingly interconnected, understanding the nuances of "${topicName}" provides speakers, thinkers, and decision-makers with the profound mental clarity required to articulate compelling narratives and lead transformative initiatives. By deliberately integrating these insights into daily problem-solving frameworks, professionals can anticipate emerging bottlenecks and deliver durable value. Ultimately, "${topicName}" is not merely a theoretical construct, but a powerful operational compass for mastering complexity and driving sustainable progress in an unpredictable world.`;
  } else if (isQuestion) {
    text = `Analyzing "${topicName}" requires evaluating the delicate balance between structural efficiency, systemic trade-offs, and broad human impact. From an operational perspective, proponents highlight significant gains in execution speed, standardized outcomes, and scalable delivery across modern organizations. When implemented with discipline, core workflows become predictable, reducing friction for end users and allowing teams to allocate resources toward higher-value creative initiatives. However, an objective examination reveals substantial counter-perspectives that cannot be overlooked: rapid transitions often introduce unexpected dependencies, cognitive fatigue, and cultural resistance when communication channels lack transparency. For instance, in contemporary technology and business landscapes, organizations that prioritize human-centered design alongside automated tools consistently outperform those relying on rigid, top-down mandates by over sixty percent in long-term stakeholder trust and employee retention. Furthermore, long-term sustainability demands establishing clear governance frameworks, continuous feedback loops, and empathetic leadership to address edge cases before they escalate into systemic failures. Ignoring these human and structural complexities risks generating severe organizational blind spots, eroding morale, and compromising long-term institutional agility. As industries evolve toward the next decade, leaders must balance immediate performance metrics with ethical considerations and sustainable growth practices. Rather than framing this inquiry as a rigid binary debate, the most effective approach synthesizes empirical evidence with adaptable, context-specific solutions. Ultimately, navigating "${topicName}" is about engineering thoughtful systems that respect both technical realities and foundational human values, ensuring that progress delivers meaningful, lasting benefits to all stakeholders involved.`;
  } else {
    text = `Exploring the domain of "${topicName}" provides essential insight into how modern systems design, technological innovation, and strategic execution converge to solve complex challenges. At its foundational core, this concept establishes a structured framework that simplifies multi-stage processes into repeatable, measurable, and resilient operational pipelines. When organizations and practitioners apply these principles effectively, they eliminate single points of failure, optimize throughput velocity, and create adaptable architectures capable of scaling seamlessly under high-pressure environments. Consider how leading global enterprises and forward-thinking engineering teams manage mission-critical infrastructure: by decoupling legacy bottlenecks and adopting modular, transparent standards, they achieve unparalleled reliability while dramatically shortening innovation cycles. Nonetheless, mastering "${topicName}" requires careful attention to architectural constraints, continuous security hygiene, and cross-disciplinary collaboration, ensuring that short-term shortcuts do not accumulate into debilitating technical or strategic debt over time. When practitioners overlook these systemic interdependencies, initial productivity gains can quickly erode into costly maintenance overhead and operational fragility. In our rapidly evolving digital landscape, staying ahead demands continuous experimentation, robust observability, and an unwavering commitment to engineering fundamentals. By grounding strategic decisions in empirical feedback and user-centric design, teams can turn complex challenges into enduring competitive advantages. Ultimately, understanding the core mechanisms and real-world trade-offs of "${topicName}" equips speakers, leaders, and builders with the mental clarity required to communicate persuasively, inspire confidence, and drive sustainable, high-impact progress across their respective fields.`;
  }

  const wordCount = text.trim().split(/\s+/).length;

  return {
    topicName,
    type: 'general',
    angleIndex: angleIndex % 3,
    totalAngles: 3,
    angleName: chosenAngle,
    fullParagraph: text,
    wordCount,
  };
}

/**
 * Full 4-Stage Hybrid Pipeline:
 * 1. Prefilled Library (0ms instant return with 250+ word curated passage)
 * 2. LocalStorage Cache (Cached verified generations)
 * 3. Local Ollama Generation with Strict Validation (Max 2 retries)
 * 4. Safe Deterministic Fallback (250+ word continuous passage)
 */
export async function getHybridTeleprompterGuide(
  topicName: string,
  topicId?: string,
  categoryName?: string,
  difficulty: TopicDifficulty = 'MEDIUM',
  audience: AudienceType = 'GENERAL',
  angleIndex: number = 0
): Promise<TeleprompterGuideResult> {
  // ================= STAGE 1: CHECK PREFILLED LIBRARY =================
  const prefilled = findPrefilledGuide(topicName, topicId, audience, difficulty);
  if (prefilled && prefilled.fullParagraph) {
    const wordCount = prefilled.fullParagraph.trim().split(/\s+/).length;
    return {
      topicName: prefilled.topic,
      type: (prefilled.topicType || 'general').toLowerCase(),
      angleIndex: 0,
      totalAngles: 1,
      angleName: 'Curated Knowledge Guide',
      fullParagraph: prefilled.fullParagraph,
      wordCount,
    };
  }

  // ================= STAGE 2: CHECK LOCAL STORAGE CACHE =================
  const cacheKey = `${CACHE_PREFIX}${topicName.trim().toLowerCase()}_${difficulty}_${audience}_angle${angleIndex % 3}`;
  try {
    const rawCache = localStorage.getItem(cacheKey);
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      if (parsed && parsed.fullParagraph && validateContinuousParagraph(parsed.fullParagraph)) {
        return parsed as TeleprompterGuideResult;
      }
    }
  } catch {
    // Cache read error ignored
  }

  // ================= STAGE 3: LOCAL OLLAMA GENERATION WITH RETRIES =================
  let retries = 2;
  while (retries > 0) {
    try {
      const aiResult = await api.getSpeakingGuide(topicName, categoryName, difficulty, angleIndex);
      if (aiResult && aiResult.fullParagraph && validateContinuousParagraph(aiResult.fullParagraph)) {
        const wordCount = aiResult.fullParagraph.trim().split(/\s+/).length;
        const validatedGuide: TeleprompterGuideResult = {
          topicName,
          type: 'general',
          angleIndex: aiResult.angleIndex || 0,
          totalAngles: aiResult.totalAngles || 3,
          angleName: aiResult.angleName || `Perspective ${(angleIndex % 3) + 1}`,
          fullParagraph: aiResult.fullParagraph,
          wordCount,
        };

        // Cache verified guide
        try {
          localStorage.setItem(cacheKey, JSON.stringify(validatedGuide));
        } catch {
          // LocalStorage write error ignored
        }

        return validatedGuide;
      }
    } catch {
      // Retry on network/Ollama error
    }
    retries--;
  }

  // ================= STAGE 4: SAFE DETERMINISTIC FALLBACK =================
  return generateContinuousFallback(topicName, categoryName, difficulty, angleIndex);
}
