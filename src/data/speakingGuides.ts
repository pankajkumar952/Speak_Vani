import { TopicDifficulty } from '../types';

export interface SpeakingGuideSection {
  title: string;
  subtitle?: string;
  content: string;
}

export interface SpeakingGuideAngle {
  angleName: string;
  sections: SpeakingGuideSection[];
}

export interface SpeakingGuide {
  topicName: string;
  type: 'debate' | 'technical' | 'story' | 'interview' | 'opinion' | 'general';
  angleIndex: number;
  totalAngles: number;
  angleName: string;
  sections: SpeakingGuideSection[];
}

/**
 * In-memory / session tracker for topic variation angles so revisiting a topic advances to a new angle
 */
const topicVariationHistory: Record<string, number> = {};

/**
 * Multi-Angle Knowledge Matrix for core topics
 */
const multiAngleKnowledgeBase: Record<string, SpeakingGuideAngle[]> = {
  // 1. What is an API?
  'What is an API?': [
    {
      angleName: 'Angle 1: Architecture & Technical Handshake',
      sections: [
        {
          title: '01 — DEFINITION',
          content: 'An API (Application Programming Interface) is a standardized contract that allows independent software systems to communicate.',
        },
        {
          title: '02 — HOW IT WORKS',
          content: 'A client sends an HTTP request with headers and parameters. The server validates authentication, processes logic, and returns a JSON payload.',
        },
        {
          title: '03 — REAL-WORLD EXAMPLE',
          content: 'A mobile banking app uses biometric authentication APIs to verify fingerprints against secure hardware enclaves without storing raw images.',
        },
        {
          title: '04 — TECHNICAL TRADE-OFF',
          content: 'Decoupled API endpoints enable independent microservice deployment, but introduce network latency and distributed failure modes.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'APIs are the digital plumbing of modern software, turning complex backend services into reusable building blocks.',
        },
      ],
    },
    {
      angleName: 'Angle 2: The API Economy & Business Modularity',
      sections: [
        {
          title: '01 — BUSINESS CONTEXT',
          content: 'Modern tech giants do not build every feature from scratch; they orchestrate best-in-class specialized API services.',
        },
        {
          title: '02 — THE MULTIPLIER EFFECT',
          content: 'Uber scaled globally by combining Google Maps (navigation), Twilio (SMS dispatch), and Stripe (payment processing) via APIs.',
        },
        {
          title: '03 — ECONOMIC ADVANTAGE',
          content: 'Startups can launch functional fintech or e-commerce products in weeks rather than spending years building banking integrations.',
        },
        {
          title: '04 — PLATFORM RISK',
          content: 'Heavy reliance on third-party APIs exposes businesses to unexpected price hikes, rate limits, or sudden platform policy shutdowns.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'The API economy shifts competitive advantage from proprietary code toward rapid composition and user experience.',
        },
      ],
    },
    {
      angleName: 'Angle 3: API Security, OAuth & Governance',
      sections: [
        {
          title: '01 — SECURITY IMPERATIVE',
          content: 'Because APIs expose internal databases to the public internet, securing endpoints with robust token authorization is paramount.',
        },
        {
          title: '02 — CORE MECHANISM: OAUTH 2.0',
          content: 'OAuth tokens allow third-party apps to access specific user resources (like calendar invites) without ever seeing user passwords.',
        },
        {
          title: '03 — ATTACK VECTORS & DEFENSE',
          content: 'Rate limiting and API gateways protect servers against DDoS attacks, automated credential stuffing, and data scraping.',
        },
        {
          title: '04 — VERSIONING & BREAKING CHANGES',
          content: 'Engineers maintain semantic versioning (/v1/, /v2/) so updates do not crash existing mobile clients in the wild.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'An API is only as good as its governance: strict rate-limiting, clear documentation, and zero-trust authentication are non-negotiable.',
        },
      ],
    },
  ],

  // 2. Should AI replace teachers?
  'Should AI replace teachers?': [
    {
      angleName: 'Angle 1: Classroom Efficiency vs Human Mentorship',
      sections: [
        {
          title: '01 — CONTEXT',
          content: 'AI systems can grade homework instantly, explain complex formulas step-by-step, and generate endless drill problems 24/7.',
        },
        {
          title: '02 — THE EFFICIENCY GAIN',
          content: 'Automating administrative paperwork frees educators to spend their limited time on direct one-on-one mentorship and emotional support.',
        },
        {
          title: '03 — THE HUMAN IRREPLACEABILITY',
          content: 'Great teachers notice when a student is depressed, inspire intellectual curiosity, resolve peer conflicts, and build character.',
        },
        {
          title: '04 — REAL CLASSROOM HYBRID',
          content: 'An adaptive AI app drills algebra fundamentals after school, leaving classroom time for student debates and collaborative science builds.',
        },
        {
          title: '05 — CONCLUSION',
          content: 'AI should replace teacher burnout and administrative bureaucracy, not the inspirational mentors who shape human lives.',
        },
      ],
    },
    {
      angleName: 'Angle 2: Global Educational Equity & Access',
      sections: [
        {
          title: '01 — GLOBAL REALITY',
          content: 'Hundreds of millions of children in developing or remote rural areas lack access to accredited teachers or modern textbooks.',
        },
        {
          title: '02 — EQUALIZING ADVANTAGE',
          content: 'A lightweight smartphone AI tutor can deliver personalized, world-class language and math instruction in native dialects anywhere.',
        },
        {
          title: '03 — INFRASTRUCTURE BARRIERS',
          content: 'Unequal access to reliable electricity, high-speed broadband, and hardware devices risks widening the global digital divide.',
        },
        {
          title: '04 — COMMUNITY PERSPECTIVE',
          content: 'Even in underserved regions, local community elders and facilitators remain essential to keep students disciplined and engaged.',
        },
        {
          title: '05 — CONCLUSION',
          content: 'Where human teachers are unavailable, AI is a life-changing lifeline, but universal access to technology remains the real challenge.',
        },
      ],
    },
    {
      angleName: 'Angle 3: Cognitive Development & Socialization',
      sections: [
        {
          title: '01 — DEVELOPMENTAL CONTEXT',
          content: 'School is not just about memorizing data; it is where young humans learn negotiation, empathy, teamwork, and social norms.',
        },
        {
          title: '02 — SCREEN FATIGUE & ISOLATION',
          content: 'Replacing physical classroom interactions with solo screen algorithms risks exacerbating adolescent loneliness and speech anxiety.',
        },
        {
          title: '03 — ALGORITHMIC RIGIDITY',
          content: 'AI scoring algorithms often penalize creative, unorthodox answers that a perceptive human teacher would recognize as genius.',
        },
        {
          title: '04 — PEDAGOGICAL BALANCED MODEL',
          content: 'Use AI to optimize the pace of data acquisition, but double down on physical sports, arts, and group debate in school.',
        },
        {
          title: '05 — CONCLUSION',
          content: 'Learning is an inherently social human endeavor: algorithms can teach facts, but human communities cultivate wisdom.',
        },
      ],
    },
  ],

  // 3. What old technology do you wish was still widely used?
  'What old technology do you wish was still widely used?': [
    {
      angleName: 'Angle 1: Standalone MP3 Players & True Media Ownership',
      sections: [
        {
          title: '01 — HISTORICAL CONTEXT',
          content: 'In the early 2000s, dedicated portable players like the classic iPod stored thousands of songs locally without internet dependence.',
        },
        {
          title: '02 — TRUE OWNERSHIP VS RENTING',
          content: 'Users owned their DRM-free audio files permanently, unlike modern streaming services where catalog songs disappear overnight.',
        },
        {
          title: '03 — DISTRACTION-FREE EXPERIENCE',
          content: 'Listening to an album on a dedicated device carried zero push notifications, targeted ads, algorithmic feeds, or battery anxiety.',
        },
        {
          title: '04 — MODERN FRICTION',
          content: 'Smartphones unified everything into one device, but turned every leisure activity into a battle against algorithmic engagement traps.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Bringing back single-purpose listening devices restores the rare luxury of pure, uninterrupted focus and true content ownership.',
        },
      ],
    },
    {
      angleName: 'Angle 2: Tactile Physical Knobs & Right-to-Repair',
      sections: [
        {
          title: '01 — ERGONOMIC DESIGN',
          content: 'Older appliances and car dashboards used physical rotary dials and mechanical switches that could be operated entirely by touch.',
        },
        {
          title: '02 — SAFETY & MUSCLE MEMORY',
          content: 'Drivers could adjust air conditioning without taking their eyes off the road, unlike modern glare-heavy digital touchscreen menus.',
        },
        {
          title: '03 — MODULAR REPAIRABILITY',
          content: 'Older electronics had socketed capacitors and schematic diagrams glued inside the chassis, allowing anyone with a soldering iron to fix them.',
        },
        {
          title: '04 — PLANNED OBSOLESCENCE',
          content: 'Modern glued-together devices with soldered batteries often become e-waste the moment a single software update is discontinued.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Physical feedback and mechanical repairability are superior ergonomics that should never have been sacrificed for touchscreens.',
        },
      ],
    },
    {
      angleName: 'Angle 3: Analog Photography & The Value of Scarcity',
      sections: [
        {
          title: '01 — CREATIVE DISCIPLINE',
          content: 'A roll of 35mm film offered only 24 or 36 exposures, forcing photographers to carefully compose lighting and framing before clicking.',
        },
        {
          title: '02 — THE DELAYED GRATIFICATION',
          content: 'Waiting days for chemical darkroom processing created anticipation and made tangible printed albums cherished family keepsakes.',
        },
        {
          title: '03 — DIGITAL HOARDING OVERLOAD',
          content: 'Today we capture 10,000 smartphone photos we never look at again, devaluing individual memories through effortless abundance.',
        },
        {
          title: '04 — SENSORY TACTILITY',
          content: 'Holding physical prints in your hands engages sensory memory far deeper than swiping across a glass smartphone screen.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Deliberate friction and physical constraints often elevate human appreciation and turn casual snaps into enduring art.',
        },
      ],
    },
  ],

  // 4. Blockchain to a beginner
  'Explain blockchain to a beginner.': [
    {
      angleName: 'Angle 1: Cryptographic Ledger & Decentralized Consensus',
      sections: [
        {
          title: '01 — CORE CONCEPT',
          content: 'A blockchain is a shared, tamper-proof spreadsheet replicated across thousands of computers simultaneously.',
        },
        {
          title: '02 — HASH CHAINING',
          content: 'Each block contains transaction records and a cryptographic fingerprint of the previous block, making historical alteration impossible.',
        },
        {
          title: '03 — NO MIDDLEMAN',
          content: 'Network nodes use consensus rules (Proof of Work or Stake) to agree on the valid ledger state without trusting any central bank.',
        },
        {
          title: '04 — TRADE-OFF',
          content: 'Distributing data everywhere provides unstoppable resilience, but creates scalability bottlenecks and higher transaction fees.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Blockchain is essentially decentralized bookkeeping governed by mathematics rather than human institutions.',
        },
      ],
    },
    {
      angleName: 'Angle 2: Smart Contracts & Supply Chain Provenance',
      sections: [
        {
          title: '01 — BEYOND CURRENCY',
          content: 'Blockchains can execute smart contracts: self-enforcing code that triggers automatic actions when verified conditions are met.',
        },
        {
          title: '02 — REAL-WORLD EXAMPLE: GLOBAL LOGISTICS',
          content: 'Shipping containers log temperature sensor readings on-chain; insurance payouts trigger automatically if perishable goods spoil.',
        },
        {
          title: '03 — COUNTERFEIT PREVENTION',
          content: 'Luxury brands and pharmaceutical companies assign immutable digital passports to medicines to verify authentic factory origins.',
        },
        {
          title: '04 — ORACLE VULNERABILITY',
          content: 'Smart contracts are only as reliable as the real-world sensor data (oracles) fed into them from the physical world.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Smart contracts automate trust in commerce, eliminating multi-week settlement delays and paper audit trails.',
        },
      ],
    },
  ],

  // 5. Door to yesterday
  'You discover a door that leads to yesterday.': [
    {
      angleName: 'Angle 1: The Curse of Endless Second Chances',
      sections: [
        {
          title: '01 — SETTING & PREMISE',
          content: 'A heavy brass bulkhead hidden behind an apartment water heater that steps out into yesterday morning’s exact sunlight.',
        },
        {
          title: '02 — THE INITIAL THRILL',
          content: 'Fixing clumsy verbal mistakes, reversing bad investments, and acing forgotten exam questions with perfect 24-hour hindsight.',
        },
        {
          title: '03 — THE PARALYZING DILEMMA',
          content: 'Obsessively looping the same day to make it flawless causes personal relationships to feel artificial and hollow.',
        },
        {
          title: '04 — THE CLIMAX',
          content: 'Realizing that spontaneous human vulnerability and mistakes are the very soil where genuine love and trust grow.',
        },
        {
          title: '05 — RESOLUTION',
          content: 'Throwing the brass key down a storm drain and walking boldly into tomorrow with all its messy uncertainty.',
        },
      ],
    },
    {
      angleName: 'Angle 2: The Historical Rescue Dilemma',
      sections: [
        {
          title: '01 — SETTING & PREMISE',
          content: 'An antique clock shop where opening the rear broom closet rewinds regional time by exactly 24 hours.',
        },
        {
          title: '02 — THE HEROIC RESCUE',
          content: 'Using yesterday’s foreknowledge to warn a stranger before a tragic traffic collision occurs at the central intersection.',
        },
        {
          title: '03 — THE BUTTERFLY EFFECT',
          content: 'Preventing the crash causes a chain reaction: an ambulance is rerouted, inadvertently delaying a critical organ transplant elsewhere.',
        },
        {
          title: '04 — THE EPIPHANY',
          content: 'Understanding that human minds cannot calculate the infinite second-order consequences of altering woven causality.',
        },
        {
          title: '05 — RESOLUTION',
          content: 'Accepting the responsibility of living in the present moment with humility rather than playing God with time.',
        },
      ],
    },
  ],
};

/**
 * Dynamic Multi-Angle Concept Generator for any unmapped topic
 */
function generateMultiAnglePerspectives(
  topicName: string,
  _categoryId?: string
): SpeakingGuideAngle[] {
  const norm = topicName.toLowerCase();
  const isQuestion = norm.startsWith('should') || norm.startsWith('is ') || norm.startsWith('why') || norm.includes('vs');

  if (isQuestion) {
    return [
      {
        angleName: 'Angle 1: Economic & Operational Trade-Offs',
        sections: [
          {
            title: '01 — CONTEXT',
            content: `Debates around "${topicName}" often pivot on balancing immediate financial efficiency against long-term operational resilience.`,
          },
          {
            title: '02 — CORE ADVANTAGE',
            content: 'Proponents point to measurable reductions in labor costs, higher throughput speed, and scalable market distribution.',
          },
          {
            title: '03 — HIDDEN COSTS',
            content: 'Critics highlight maintenance overhead, retraining friction, vendor lock-in, and unpredictable edge-case failures.',
          },
          {
            title: '04 — INDUSTRY EXAMPLE',
            content: 'Companies that automated 80% of routine workflows while retaining senior domain experts achieved 3x higher customer retention.',
          },
          {
            title: '05 — STRATEGIC TAKEAWAY',
            content: 'Sustainable transformation requires calculated investment in human capital alongside technological upgrades.',
          },
        ],
      },
      {
        angleName: 'Angle 2: Human Psychology & Cultural Impact',
        sections: [
          {
            title: '01 — HUMAN FACTOR',
            content: `Beyond balance sheets, "${topicName}" fundamentally alters human habits, interpersonal trust, and workplace morale.`,
          },
          {
            title: '02 — PSYCHOLOGICAL BENEFIT',
            content: 'Reduces mundane repetitive cognitive load, granting individuals greater autonomy to pursue creative and strategic initiatives.',
          },
          {
            title: '03 — RESISTANCE & ANXIETY',
            content: 'Rapid disruption without empathetic leadership creates organizational paralysis and fear of obsolescence.',
          },
          {
            title: '04 — RELATABLE SCENARIO',
            content: 'Teams that participate in co-designing new processes show 70% higher adoption than those subjected to top-down mandates.',
          },
          {
            title: '05 — TAKEAWAY',
            content: 'Technological tools succeed or fail based on human psychology, empathy, and cultural alignment.',
          },
        ],
      },
      {
        angleName: 'Angle 3: Ethics, Governance & Future Horizon',
        sections: [
          {
            title: '01 — ETHICAL IMPERATIVE',
            content: `The long-term trajectory of "${topicName}" requires examining accountability, data privacy, and systemic fairness.`,
          },
          {
            title: '02 — REGULATORY CHALLENGE',
            content: 'Government policy often lags behind rapid innovation, creating dangerous regulatory gray zones and monopolistic consolidation.',
          },
          {
            title: '03 — RESPONSIBLE FRAMEWORK',
            content: 'Establishing open audits, verifiable safety standards, and transparent feedback loops protects public welfare.',
          },
          {
            title: '04 — GLOBAL PRECEDENT',
            content: 'International standards for aviation and cybersecurity prove that rigorous safety protocols accelerate sustainable industry growth.',
          },
          {
            title: '05 — TAKEAWAY',
            content: 'Proactive governance and ethical design turn volatile disruptions into enduring societal benefits.',
          },
        ],
      },
    ];
  }

  // General Topic Multi-Angles
  return [
    {
      angleName: 'Angle 1: Fundamentals & Mechanism',
      sections: [
        {
          title: '01 — FOUNDATION',
          content: `At its core, "${topicName}" represents a breakthrough method for solving friction and scaling capability.`,
        },
        {
          title: '02 — HOW IT OPERATES',
          content: 'It decomposes complex multi-stage tasks into modular, predictable, and measurable execution pipelines.',
        },
        {
          title: '03 — PRACTICAL APPLICATION',
          content: 'Modern engineering teams use this methodology to streamline deployment cycles and eliminate single points of failure.',
        },
        {
          title: '04 — KEY CONSTRAINT',
          content: 'Requires disciplined architectural rigor; ad-hoc shortcuts quickly result in technical debt and fragile dependencies.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Mastering the core mechanics of this topic unlocks compound efficiency gains over time.',
        },
      ],
    },
    {
      angleName: 'Angle 2: Strategic Evolution & Market Impact',
      sections: [
        {
          title: '01 — INDUSTRY SHIFT',
          content: `Over the past decade, "${topicName}" has evolved from a niche experiment into an essential competitive standard.`,
        },
        {
          title: '02 — MARKET ADVANTAGE',
          content: 'Early adopters achieve superior velocity, lower operational costs, and higher responsiveness to customer demand.',
        },
        {
          title: '03 — REAL-WORLD CASE STUDY',
          content: 'Global logistics and cloud infrastructure providers demonstrate how continuous iteration creates insurmountable moats.',
        },
        {
          title: '04 — ADOPTION PITFALLS',
          content: 'Blindly copying industry hype without evaluating specific business needs leads to wasted capital and misaligned priorities.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Adopt technology to solve real user problems, not to satisfy checklist vanity metrics.',
        },
      ],
    },
    {
      angleName: 'Angle 3: Future Outlook & Emerging Trends',
      sections: [
        {
          title: '01 — THE NEXT DECADE',
          content: `Emerging developments in "${topicName}" are converging with automation, edge computing, and real-time intelligence.`,
        },
        {
          title: '02 — CATALYST FOR CHANGE',
          content: 'Lower hardware costs and open-source ecosystems are democratizing access to capabilities once reserved for Fortune 500 giants.',
        },
        {
          title: '03 — UNRESOLVED FRONTIER',
          content: 'Interoperability across legacy protocols and security hardening remain the most pressing engineering frontiers.',
        },
        {
          title: '04 — VISIONARY EXAMPLE',
          content: 'Autonomous smart grids and predictive maintenance algorithms illustrate what is possible when these systems mature.',
        },
        {
          title: '05 — TAKEAWAY',
          content: 'Staying adaptable and continuously updating your mental models is the only hedge against rapid obsolescence.',
        },
      ],
    },
  ];
}

/**
 * Retrieves the speaking guide for a topic with automatic angle rotation on revisit
 */
export function getSpeakingGuideForTopic(
  topicName: string,
  categoryId?: string,
  _difficulty: TopicDifficulty = 'MEDIUM',
  forcedAngleIndex?: number
): SpeakingGuide {
  const topicKey = topicName.trim().toLowerCase();
  
  // Look up curated multi-angle set or generate dynamic multi-angle set
  let availableAngles = multiAngleKnowledgeBase[topicName];
  if (!availableAngles) {
    for (const [key, angles] of Object.entries(multiAngleKnowledgeBase)) {
      if (key.toLowerCase() === topicKey || topicKey.includes(key.toLowerCase().replace(/[.?]/g, ''))) {
        availableAngles = angles;
        break;
      }
    }
  }

  if (!availableAngles || availableAngles.length === 0) {
    availableAngles = generateMultiAnglePerspectives(topicName, categoryId);
  }

  const total = availableAngles.length;

  // Determine angle index
  let selectedIdx: number;
  if (typeof forcedAngleIndex === 'number') {
    selectedIdx = ((forcedAngleIndex % total) + total) % total;
    topicVariationHistory[topicKey] = selectedIdx;
  } else {
    // Check previous history and advance
    const prev = topicVariationHistory[topicKey];
    if (typeof prev === 'number') {
      selectedIdx = (prev + 1) % total;
    } else {
      selectedIdx = 0;
    }
    topicVariationHistory[topicKey] = selectedIdx;
  }

  const activeAngle = availableAngles[selectedIdx];

  const lower = topicName.toLowerCase();
  const type = lower.includes('story') || lower.includes('yesterday') || lower.includes('portal')
    ? 'story'
    : lower.startsWith('should') || lower.startsWith('is ') || lower.includes(' vs ')
    ? 'debate'
    : lower.startsWith('what is') || lower.includes('api') || lower.includes('blockchain')
    ? 'technical'
    : lower.includes('tell me about') || lower.includes('interview')
    ? 'interview'
    : lower.includes('wish') || lower.includes('old tech')
    ? 'opinion'
    : 'general';

  return {
    topicName,
    type,
    angleIndex: selectedIdx,
    totalAngles: total,
    angleName: activeAngle.angleName,
    sections: activeAngle.sections,
  };
}
