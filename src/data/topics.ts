import { Category, Topic, TopicDifficulty, AudienceType, TopicType, DailyChallengeItem, TopicFormat } from '../types';

/* ==========================================================================
   CATEGORY DEFINITIONS
   ========================================================================== */

export const generalCategoriesData: Category[] = [
  {
    id: 'cat-1',
    name: 'Technology & AI',
    description: 'Artificial intelligence, automation, cloud architecture, and modern tech ethics.',
    iconName: 'Cpu',
    topicsCount: 52,
    color: 'from-indigo-600 to-indigo-600',
    emoji: '🤖',
    audience: 'GENERAL',
  },
  {
    id: 'cat-3',
    name: 'Business & Leadership',
    description: 'Startups, executive strategy, team leadership, negotiations, and product growth.',
    iconName: 'TrendingUp',
    topicsCount: 52,
    color: 'from-slate-700 to-slate-900',
    emoji: '💼',
    audience: 'GENERAL',
  },
  {
    id: 'cat-4',
    name: 'Philosophy & Mindset',
    description: 'Mental models, critical reasoning, stoicism, decision making, and resilience.',
    iconName: 'Compass',
    topicsCount: 52,
    color: 'from-indigo-900 to-slate-900',
    emoji: '🧭',
    audience: 'GENERAL',
  },
  {
    id: 'cat-science',
    name: 'Science & Future',
    description: 'Space exploration, quantum physics, biotechnology, genetics, and climate science.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-emerald-600 to-teal-700',
    emoji: '🔬',
    audience: 'GENERAL',
  },
  {
    id: 'cat-education',
    name: 'Education & Learning',
    description: 'Higher education, skill acquisition, online learning, memory, and cognitive growth.',
    iconName: 'BookOpen',
    topicsCount: 52,
    color: 'from-amber-600 to-teal-700',
    emoji: '📚',
    audience: 'GENERAL',
  },
  {
    id: 'cat-society',
    name: 'Society & Culture',
    description: 'Digital habits, urban design, media consumption, economics, and human behavior.',
    iconName: 'Coffee',
    topicsCount: 52,
    color: 'from-sky-600 to-blue-700',
    emoji: '🌐',
    audience: 'GENERAL',
  },
  {
    id: 'cat-real-situations',
    name: 'Real Situations',
    description: 'Workplace escalations, salary negotiations, stakeholder meetings, and client pitches.',
    iconName: 'Users',
    topicsCount: 52,
    color: 'from-amber-500 to-teal-600',
    emoji: '🏢',
    audience: 'GENERAL',
  },
  {
    id: 'cat-interview',
    name: 'Interview Simulator',
    description: 'Behavioral, technical, situational, and executive leadership interview drills.',
    iconName: 'Briefcase',
    topicsCount: 52,
    color: 'from-blue-600 to-indigo-700',
    emoji: '🎯',
    audience: 'GENERAL',
  },
  {
    id: 'cat-opposite',
    name: 'Opposite Opinion',
    description: 'Defend unfamiliar or counter-intuitive arguments to build mental agility and debate flexibility.',
    iconName: 'Scale',
    topicsCount: 52,
    color: 'from-emerald-500 to-cyan-600',
    emoji: '⚖️',
    audience: 'GENERAL',
  },
  {
    id: 'cat-rapid-fire',
    name: 'Rapid Fire Drills',
    description: 'High-tempo 5s, 10s, and 15s instant articulation sequences for crisp thinking.',
    iconName: 'Zap',
    topicsCount: 52,
    color: 'from-yellow-400 to-amber-600',
    emoji: '⚡',
    audience: 'GENERAL',
  },
  {
    id: 'cat-5',
    name: 'Creative Storytelling',
    description: 'Narrative arcs, dramatic tension, character stakes, personal anecdotes, and memorable hooks.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-cyan-600 to-cyan-600',
    emoji: '✨',
    audience: 'GENERAL',
  },
];

export const kidsCategoriesData: Category[] = [
  {
    id: 'cat-k-animals',
    name: 'Animals & Nature',
    description: 'Wild jungle animals, sea creatures, flying birds, pets, and secret habitats.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-emerald-400 to-teal-500',
    emoji: '🦁',
    audience: 'KIDS_5_7',
  },
  {
    id: 'cat-k-space',
    name: 'Space & Inventions',
    description: 'Rockets, alien planets, time machines, friendly robots, and superhero gadgets.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-blue-400 to-indigo-500',
    emoji: '🚀',
    audience: 'KIDS_8_10',
  },
  {
    id: 'cat-k-school',
    name: 'School & Adventure',
    description: 'Best friends, recess games, magic classrooms, treasure hunts, and fun mysteries.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-amber-400 to-teal-500',
    emoji: '🎒',
    audience: 'KIDS_5_7',
  },
  {
    id: 'cat-k-superhero',
    name: 'Superheroes & Fantasy',
    description: 'Hidden superpowers, flying capes, enchanted kingdoms, dragons, and saving the day.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-cyan-400 to-emerald-500',
    emoji: '🦸',
    audience: 'KIDS_8_10',
  },
  {
    id: 'cat-k-debate',
    name: 'Youth Debates & Tech',
    description: 'Smartphone rules, homework debates, student leadership, social media, and future jobs.',
    iconName: 'Sparkles',
    topicsCount: 52,
    color: 'from-indigo-400 to-indigo-500',
    emoji: '📱',
    audience: 'KIDS_11_13',
  },
];

/* ==========================================================================
   HELPER TO GENERATE STRUCTURED TOPIC LISTS WITH STRICT DIFFICULTY METRICS
   ========================================================================== */

function makeTopic(
  id: string,
  name: string,
  categoryId: string,
  difficulty: TopicDifficulty,
  audience: AudienceType = 'GENERAL',
  topicType: TopicType = 'SIMPLE_TOPIC',
  extra?: { stancePrompt?: string; questions?: string[]; contextScenario?: string }
): Topic {
  return {
    id,
    name,
    categoryId,
    difficulty,
    audience,
    topicType,
    stancePrompt: extra?.stancePrompt,
    questions: extra?.questions,
    contextScenario: extra?.contextScenario,
  };
}

/* ==========================================================================
   0. CURATED SINGLE-WORD & PHRASE PROMPTS
   ========================================================================== */
export const singleWordTopics: Topic[] = [
  makeTopic('w-01', 'Resilience', 'cat-4', 'MEDIUM'),
  makeTopic('w-02', 'Serendipity', 'cat-4', 'MEDIUM'),
  makeTopic('w-03', 'Quantum', 'cat-science', 'HARD'),
  makeTopic('w-04', 'Discipline', 'cat-4', 'EASY'),
  makeTopic('w-05', 'Monopoly', 'cat-3', 'MEDIUM'),
  makeTopic('w-06', 'Automation', 'cat-1', 'EASY'),
  makeTopic('w-07', 'Entropy', 'cat-science', 'HARD'),
  makeTopic('w-08', 'Empathy', 'cat-4', 'EASY'),
  makeTopic('w-09', 'Leverage', 'cat-3', 'MEDIUM'),
  makeTopic('w-10', 'Courage', 'cat-4', 'EASY'),
  makeTopic('w-11', 'Gravity', 'cat-science', 'EASY'),
  makeTopic('w-12', 'Integrity', 'cat-4', 'EASY'),
  makeTopic('w-13', 'Momentum', 'cat-3', 'MEDIUM'),
  makeTopic('w-14', 'Obsolescence', 'cat-1', 'HARD'),
  makeTopic('w-15', 'Authenticity', 'cat-society', 'MEDIUM'),
  makeTopic('w-16', 'Curiosity', 'cat-education', 'EASY'),
  makeTopic('w-17', 'Decentralization', 'cat-1', 'HARD'),
  makeTopic('w-18', 'Simplicity', 'cat-4', 'EASY'),
  makeTopic('w-19', 'Ambition', 'cat-3', 'MEDIUM'),
  makeTopic('w-20', 'Patience', 'cat-4', 'EASY'),
];

export const phraseTopics: Topic[] = [
  makeTopic('p-01', 'The Double-Edged Sword', 'cat-4', 'MEDIUM'),
  makeTopic('p-02', 'Digital Minimalism', 'cat-1', 'MEDIUM'),
  makeTopic('p-03', 'The Butterfly Effect', 'cat-science', 'EASY'),
  makeTopic('p-04', 'Building in Public', 'cat-3', 'MEDIUM'),
  makeTopic('p-05', 'Zero-Sum Games', 'cat-3', 'HARD'),
  makeTopic('p-06', 'The Cost of Perfection', 'cat-4', 'EASY'),
  makeTopic('p-07', 'Artificial General Intelligence', 'cat-1', 'HARD'),
  makeTopic('p-08', 'The Right to Repair', 'cat-1', 'MEDIUM'),
  makeTopic('p-09', 'The Paradox of Choice', 'cat-4', 'MEDIUM'),
  makeTopic('p-10', 'Compound Interest in Skills', 'cat-education', 'EASY'),
  makeTopic('p-11', 'The Innovator’s Dilemma', 'cat-3', 'HARD'),
  makeTopic('p-12', 'Emotional Intelligence in Crisis', 'cat-3', 'MEDIUM'),
  makeTopic('p-13', 'The Uncanny Valley', 'cat-1', 'HARD'),
  makeTopic('p-14', 'Second-Order Thinking', 'cat-4', 'HARD'),
  makeTopic('p-15', 'The Attention Economy', 'cat-society', 'MEDIUM'),
];

/* ==========================================================================
   1. GENERAL: TECHNOLOGY & AI (52 TOPICS)
   ========================================================================== */
const techTopics: Topic[] = [
  // CURATED SECTION 3 TOPICS (Guaranteed Continuous Knowledge Teleprompter Guides)
  makeTopic('t1-01', 'What is your favorite mobile application and what makes it indispensable?', 'cat-1', 'EASY'),
  makeTopic('t1-02', 'How has remote work technology changed team collaboration over the last decade?', 'cat-1', 'EASY'),
  makeTopic('t1-03', 'Why is cybersecurity hygiene more critical today than ever before?', 'cat-1', 'EASY'),
  makeTopic('t1-04', 'How does open source software power global software infrastructure?', 'cat-1', 'EASY'),
  makeTopic('t1-21', 'What is an API and why are they fundamental to the modern internet?', 'cat-1', 'MEDIUM'),
  makeTopic('t1-22', 'How does cloud computing change the economics of running a technology startup?', 'cat-1', 'MEDIUM'),
  makeTopic('t1-23', 'How does blockchain technology enable trustless peer-to-peer digital transactions?', 'cat-1', 'MEDIUM'),
  makeTopic('t1-24', 'How do artificial neural networks learn patterns from massive training datasets?', 'cat-1', 'MEDIUM'),
  makeTopic('t1-25', 'Will humanoid robots replace blue-collar warehouse workers in this decade?', 'cat-1', 'MEDIUM'),
  makeTopic('t1-26', 'Should social media algorithms be legally audited for amplifying polarized content?', 'cat-1', 'MEDIUM'),
  makeTopic('t1-27', 'Is open-source AI safer or more dangerous than proprietary closed models?', 'cat-1', 'HARD'),
  makeTopic('t1-28', 'Will quantum computing render modern RSA and ECC cryptographic standards obsolete?', 'cat-1', 'HARD'),
  makeTopic('t1-29', 'Should autonomous AI weapons be banned globally under international treaties?', 'cat-1', 'HARD'),
  makeTopic('t1-30', 'Can artificial general intelligence develop subjective consciousness or self-awareness?', 'cat-1', 'HARD'),

  // EASY (~20)
  makeTopic('t-102', 'How does listening to podcasts change the way we absorb new information?', 'cat-1', 'EASY'),
  makeTopic('t-103', 'Should people take a mandatory weekly digital detox from their smartphones?', 'cat-1', 'EASY'),
  makeTopic('t-104', 'Why is good user interface design essential for everyday consumer software?', 'cat-1', 'EASY'),
  makeTopic('t-105', 'What is one piece of old technology that you wish was still widely used?', 'cat-1', 'EASY'),
  makeTopic('t-106', 'How has video conferencing transformed personal communication with distant family?', 'cat-1', 'EASY'),
  makeTopic('t-107', 'What makes electric vehicles appealing or challenging for daily commuters?', 'cat-1', 'EASY'),
  makeTopic('t-108', 'How do smart home devices like voice assistants improve household convenience?', 'cat-1', 'EASY'),
  makeTopic('t-109', 'Why do so many people prefer reading physical books over digital e-readers?', 'cat-1', 'EASY'),
  makeTopic('t-110', 'How has cloud storage eliminated the fear of losing personal files and photos?', 'cat-1', 'EASY'),
  makeTopic('t-111', 'What are the biggest benefits of wearable fitness trackers for everyday health?', 'cat-1', 'EASY'),
  makeTopic('t-112', 'How has online shopping changed the way we discover and purchase niche products?', 'cat-1', 'EASY'),
  makeTopic('t-113', 'Why is password security and two-factor authentication critical for everyone?', 'cat-1', 'EASY'),
  makeTopic('t-114', 'What was the first computer program or video game that made an impact on you?', 'cat-1', 'EASY'),
  makeTopic('t-115', 'How do noise-canceling headphones help individuals focus in noisy environments?', 'cat-1', 'EASY'),
  makeTopic('t-116', 'What makes open-source software like Linux so powerful for global collaboration?', 'cat-1', 'EASY'),
  makeTopic('t-117', 'Why are simple text notes often more effective than complex productivity apps?', 'cat-1', 'EASY'),
  makeTopic('t-118', 'How has digital photography changed the way we capture and remember life moments?', 'cat-1', 'EASY'),
  makeTopic('t-119', 'What makes renewable solar tech a viable energy solution for modern households?', 'cat-1', 'EASY'),
  makeTopic('t-120', 'How do algorithm recommendations influence our daily musical and video tastes?', 'cat-1', 'EASY'),

  // MEDIUM (~20)
  makeTopic('t-121', 'Should artificial intelligence be used to generate personalized curriculum for students?', 'cat-1', 'MEDIUM'),
  makeTopic('t-122', 'How will autonomous delivery drones impact local urban traffic and logistics?', 'cat-1', 'MEDIUM'),
  makeTopic('t-123', 'Should software engineers be legally required to sign an ethical oath like medical doctors?', 'cat-1', 'MEDIUM'),
  makeTopic('t-124', 'How does quantum computing threaten current encryption standards across financial institutions?', 'cat-1', 'MEDIUM'),
  makeTopic('t-125', 'Should generative AI models be required to cite every copyrighted source used in their training?', 'cat-1', 'MEDIUM'),
  makeTopic('t-126', 'Will humanoid robotics accelerate manufacturing productivity or displace manual labor too quickly?', 'cat-1', 'MEDIUM'),
  makeTopic('t-127', 'How can developers prevent algorithmic bias in automated loan and credit scoring tools?', 'cat-1', 'MEDIUM'),
  makeTopic('t-128', 'Should internet access be classified as a fundamental public utility alongside electricity and water?', 'cat-1', 'MEDIUM'),
  makeTopic('t-129', 'How is edge computing redefining latency-sensitive internet-of-things applications?', 'cat-1', 'MEDIUM'),
  makeTopic('t-130', 'Should space agencies prioritize orbital debris cleanup before launching mega-satellite constellations?', 'cat-1', 'MEDIUM'),
  makeTopic('t-131', 'How does synthetic voice technology risk increasing financial fraud and social engineering scams?', 'cat-1', 'MEDIUM'),
  makeTopic('t-132', 'Will augmented reality smart glasses replace smartphones as our primary computing interface?', 'cat-1', 'MEDIUM'),
  makeTopic('t-133', 'Should governments establish universal digital identity credentials for citizens online?', 'cat-1', 'MEDIUM'),
  makeTopic('t-134', 'How does microservice architecture improve scalability compared to traditional monolithic backends?', 'cat-1', 'MEDIUM'),
  makeTopic('t-135', 'Should autonomous self-driving cars prioritize passenger safety or pedestrian safety in unavoidable collisions?', 'cat-1', 'MEDIUM'),
  makeTopic('t-136', 'How is machine learning transforming early disease detection in diagnostic radiology?', 'cat-1', 'MEDIUM'),
  makeTopic('t-137', 'Will decentralized peer-to-peer computing platforms replace centralized hyperscaler cloud providers?', 'cat-1', 'MEDIUM'),
  makeTopic('t-138', 'Should companies allow employees to use proprietary enterprise data inside public AI chatbots?', 'cat-1', 'MEDIUM'),
  makeTopic('t-139', 'How does 3D printing in construction address housing shortages in high-density urban areas?', 'cat-1', 'MEDIUM'),
  makeTopic('t-140', 'Should social media algorithms be made fully open-source for independent public auditing?', 'cat-1', 'MEDIUM'),

  // HARD (~12)
  makeTopic('t-141', 'Should artificial general intelligence development be subjected to a global international moratorium?', 'cat-1', 'HARD'),
  makeTopic('t-142', 'How should society redistribute wealth if intellectual automation decouples productivity from labor?', 'cat-1', 'HARD'),
  makeTopic('t-143', 'Is direct neural interface hardware a step toward human evolution or an existential privacy breach?', 'cat-1', 'HARD'),
  makeTopic('t-144', 'Should deepfake media creators face criminal liability equivalent to identity theft and forgery?', 'cat-1', 'HARD'),
  makeTopic('t-145', 'How can sovereign nations establish cyber warfare treaties that are verifiable without compromising national secrets?', 'cat-1', 'HARD'),
  makeTopic('t-146', 'Should algorithms possess legal personhood if they autonomously manage corporate investment treasuries?', 'cat-1', 'HARD'),
  makeTopic('t-147', 'Does the concentration of high-end semiconductor manufacturing in single regions create dangerous geopolitical fragility?', 'cat-1', 'HARD'),
  makeTopic('t-148', 'How should synthetic biology and CRISPR gene editing be regulated to prevent unauthorized bioweapon proliferation?', 'cat-1', 'HARD'),
  makeTopic('t-149', 'Will generative AI collapse the fundamental economic model of the open internet by disincentivizing human content creation?', 'cat-1', 'HARD'),
  makeTopic('t-150', 'Should automated weapons systems be permitted to make lethal autonomous decisions without human intervention?', 'cat-1', 'HARD'),
  makeTopic('t-151', 'Is technological stagnation in physical atoms being masked by rapid innovation in software bits?', 'cat-1', 'HARD'),
  makeTopic('t-152', 'Can decentralized cryptographic consensus mechanisms truly replace central banking monetary policy?', 'cat-1', 'HARD'),
];

/* ==========================================================================
   2. GENERAL: BUSINESS & LEADERSHIP (52 TOPICS)
   ========================================================================== */
const businessTopics: Topic[] = [
  // CURATED SECTION 4 TOPICS (Guaranteed Continuous Knowledge Teleprompter Guides)
  makeTopic('b1-21', 'Why do luxury brands thrive on perceived exclusivity rather than utility?', 'cat-3', 'MEDIUM'),
  makeTopic('b1-22', 'How did the SaaS subscription business model disrupt traditional enterprise software sales?', 'cat-3', 'EASY'),
  makeTopic('b1-23', 'What makes high-performance company culture difficult to replicate?', 'cat-3', 'MEDIUM'),
  makeTopic('b1-24', 'How do network effects create defensible moats for marketplace platforms?', 'cat-3', 'MEDIUM'),
  makeTopic('b1-25', 'Should venture-backed startups prioritize rapid user growth over immediate profitability?', 'cat-3', 'HARD'),
  makeTopic('b1-26', 'Is remote-first leadership more effective than mandatory in-office executive presence?', 'cat-3', 'MEDIUM'),
  makeTopic('b1-27', 'How should founders handle co-founder conflict before it destroys the company?', 'cat-3', 'HARD'),
  makeTopic('b1-28', 'Are monopoly breakups necessary to protect innovation in modern tech markets?', 'cat-3', 'HARD'),
  makeTopic('b1-29', 'How do central bank interest rate cycles dictate global venture capital funding?', 'cat-3', 'HARD'),

  // EASY (~20)
  makeTopic('b-101', 'What makes a small local business stand out against large national retail chains?', 'cat-3', 'EASY'),
  makeTopic('b-102', 'Why is listening the most underrated skill for effective team managers?', 'cat-3', 'EASY'),
  makeTopic('b-103', 'How can a team maintain strong motivation during challenging project deadlines?', 'cat-3', 'EASY'),
  makeTopic('b-104', 'What makes a product onboarding experience delightful for new first-time users?', 'cat-3', 'EASY'),
  makeTopic('b-105', 'Why is transparent internal communication essential when a company experiences rapid change?', 'cat-3', 'EASY'),
  makeTopic('b-106', 'How does a positive office culture influence employee retention and morale?', 'cat-3', 'EASY'),
  makeTopic('b-107', 'What is the most effective way to run a short, focused 15-minute team standup meeting?', 'cat-3', 'EASY'),
  makeTopic('b-108', 'Why do successful brands focus heavily on customer service instead of just marketing?', 'cat-3', 'EASY'),
  makeTopic('b-109', 'How should a manager handle constructive feedback from a junior team member?', 'cat-3', 'EASY'),
  makeTopic('b-110', 'What makes a product launch video compelling enough to generate organic word-of-mouth?', 'cat-3', 'EASY'),
  makeTopic('b-111', 'Why is financial budgeting the first skill an early-stage entrepreneur must master?', 'cat-3', 'EASY'),
  makeTopic('b-112', 'How does setting clear quarterly goals keep cross-functional teams aligned?', 'cat-3', 'EASY'),
  makeTopic('b-113', 'What are the main advantages of remote work for small boutique consulting agencies?', 'cat-3', 'EASY'),
  makeTopic('b-114', 'How can a founder identify the core value proposition of an early product prototype?', 'cat-3', 'EASY'),
  makeTopic('b-115', 'Why is celebrating small milestone wins important for long-term project endurance?', 'cat-3', 'EASY'),
  makeTopic('b-116', 'What makes a mentorship relationship valuable for both the mentor and the mentee?', 'cat-3', 'EASY'),
  makeTopic('b-117', 'How do customer loyalty programs encourage recurring engagement and retention?', 'cat-3', 'EASY'),
  makeTopic('b-118', 'Why is saying "no" to secondary feature requests vital for keeping software simple?', 'cat-3', 'EASY'),
  makeTopic('b-119', 'What is the most memorable brand slogan or campaign you have ever encountered?', 'cat-3', 'EASY'),
  makeTopic('b-120', 'How does delegation empower junior team members to build leadership confidence?', 'cat-3', 'EASY'),

  // MEDIUM (~20)
  makeTopic('b-121', 'Should high-growth technology startups prioritize immediate profitability over aggressive market expansion?', 'cat-3', 'MEDIUM'),
  makeTopic('b-122', 'How can an executive lead an organization through a high-stakes corporate pivot without losing trust?', 'cat-3', 'MEDIUM'),
  makeTopic('b-123', 'Should companies implement a strict four-day work week without reducing employee compensation?', 'cat-3', 'MEDIUM'),
  makeTopic('b-124', 'How can managers eliminate the toxic culture of performative busyness and presenteeism?', 'cat-3', 'MEDIUM'),
  makeTopic('b-125', 'Should executive compensation packages be tied directly to employee satisfaction and retention metrics?', 'cat-3', 'MEDIUM'),
  makeTopic('b-126', 'How does a direct-to-consumer brand build lasting competitive moats against copycat competitors?', 'cat-3', 'MEDIUM'),
  makeTopic('b-127', 'Should venture capital firms require portfolio startups to implement transparent sustainability reporting?', 'cat-3', 'MEDIUM'),
  makeTopic('b-128', 'How can leaders foster psychological safety so employees speak up about critical system risks?', 'cat-3', 'MEDIUM'),
  makeTopic('b-129', 'Is offering unlimited paid time off a genuine employee benefit or a deceptive cost-saving tactic?', 'cat-3', 'MEDIUM'),
  makeTopic('b-130', 'How should a startup CEO handle a public public-relations crisis caused by a service outage?', 'cat-3', 'MEDIUM'),
  makeTopic('b-131', 'Should companies ban internal email in favor of asynchronous documentation and structured ticketing?', 'cat-3', 'MEDIUM'),
  makeTopic('b-132', 'How does pricing strategy communicate premium brand authority and positioning in B2B software?', 'cat-3', 'MEDIUM'),
  makeTopic('b-133', 'Should founders accept early acquisition offers or risk independent growth to build enduring institutions?', 'cat-3', 'MEDIUM'),
  makeTopic('b-134', 'How can organizations successfully integrate remote global talent across disparate time zones?', 'cat-3', 'MEDIUM'),
  makeTopic('b-135', 'Should companies publish complete transparent salary bands for every internal role publicly?', 'cat-3', 'MEDIUM'),
  makeTopic('b-136', 'How does technical debt in legacy enterprise systems stifle product development velocity?', 'cat-3', 'MEDIUM'),
  makeTopic('b-137', 'Should businesses conduct structured post-mortem reviews on successful product launches as well as failures?', 'cat-3', 'MEDIUM'),
  makeTopic('b-138', 'How can an established legacy company disrupt its own flagship revenue generator before startups do?', 'cat-3', 'MEDIUM'),
  makeTopic('b-139', 'Should customer success managers have quota-bearing upsell responsibilities alongside support roles?', 'cat-3', 'MEDIUM'),
  makeTopic('b-140', 'How does product-led growth differ from traditional sales-led go-to-market motions in enterprise SaaS?', 'cat-3', 'MEDIUM'),

  // HARD (~12)
  makeTopic('b-141', 'Is stakeholder capitalism fundamentally compatible with fiduciary duties to maximize shareholder returns?', 'cat-3', 'HARD'),
  makeTopic('b-142', 'How should corporate boards govern dual-class share structures that insulate founders from activist accountability?', 'cat-3', 'HARD'),
  makeTopic('b-143', 'Should antitrust regulators break up dominant technology platforms that operate both the marketplace and competing products?', 'cat-3', 'HARD'),
  makeTopic('b-144', 'Can decentralized autonomous organizations (DAOs) ever replace traditional C-suite hierarchical management structures?', 'cat-3', 'HARD'),
  makeTopic('b-145', 'How should multinational corporations navigate compliance when operating in conflicting regulatory jurisdictions?', 'cat-3', 'HARD'),
  makeTopic('b-146', 'Is the modern subscription business model creating unsustainable consumer fatigue across digital products?', 'cat-3', 'HARD'),
  makeTopic('b-147', 'Should artificial intelligence agents be granted legal fiduciary representation on corporate audit committees?', 'cat-3', 'HARD'),
  makeTopic('b-148', 'How does the financialization of private equity impact the operational resilience of essential public services?', 'cat-3', 'HARD'),
  makeTopic('b-149', 'Will sovereign supply chain reshoring permanently reverse the economic efficiency gains of globalized trade?', 'cat-3', 'HARD'),
  makeTopic('b-150', 'Should corporations be legally required to account for environmental externalities directly on standard balance sheets?', 'cat-3', 'HARD'),
  makeTopic('b-151', 'How can executive leadership retain institutional culture during a hostile mega-merger integration?', 'cat-3', 'HARD'),
  makeTopic('b-152', 'Is rapid corporate scaling through aggressive debt financing obsolete in an era of sustained higher interest rates?', 'cat-3', 'HARD'),
];

/* ==========================================================================
   3. GENERAL: PHILOSOPHY & MINDSET (52 TOPICS)
   ========================================================================== */
const philosophyTopics: Topic[] = [
  // CURATED SECTION 5 TOPICS (Guaranteed Continuous Knowledge Teleprompter Guides)
  makeTopic('p1-21', 'Why is consistency more powerful than sporadic bursts of intense motivation?', 'cat-4', 'EASY'),
  makeTopic('p1-22', 'How does Stoic philosophy help leaders remain calm during high-stakes crises?', 'cat-4', 'MEDIUM'),
  makeTopic('p1-23', 'What is the difference between intrinsic self-worth and external validation?', 'cat-4', 'EASY'),
  makeTopic('p1-24', 'How does overcoming discomfort build long-term psychological resilience?', 'cat-4', 'MEDIUM'),
  makeTopic('p1-25', 'Is true altruism possible, or are all human actions fundamentally self-interested?', 'cat-4', 'HARD'),
  makeTopic('p1-26', 'Does free will exist, or are all decisions deterministic products of biology and environment?', 'cat-4', 'HARD'),
  makeTopic('p1-27', 'What is the paradox of choice, and why does more freedom often make us less happy?', 'cat-4', 'MEDIUM'),

  // EASY (~20)
  makeTopic('p-101', 'What is one daily habit that brings clarity and calm to your morning routine?', 'cat-4', 'EASY'),
  makeTopic('p-102', 'Why is learning to say "no" one of the most powerful self-care decisions you can make?', 'cat-4', 'EASY'),
  makeTopic('p-103', 'How does keeping a personal journal help untangle complex emotions and daily stress?', 'cat-4', 'EASY'),
  makeTopic('p-104', 'What does living a simple and uncluttered life mean to you in the digital age?', 'cat-4', 'EASY'),
  makeTopic('p-105', 'Why is making mistakes an essential prerequisite for mastering any new skill?', 'cat-4', 'EASY'),
  makeTopic('p-106', 'How does practicing daily gratitude shift our perspective during difficult times?', 'cat-4', 'EASY'),
  makeTopic('p-107', 'What is the difference between being busy and being truly productive?', 'cat-4', 'EASY'),
  makeTopic('p-108', 'Why do so many people struggle to enjoy the present moment without thinking about the future?', 'cat-4', 'EASY'),
  makeTopic('p-109', 'How does spending time in nature restore mental energy and creativity?', 'cat-4', 'EASY'),
  makeTopic('p-110', 'What is the best piece of advice a family member or teacher ever shared with you?', 'cat-4', 'EASY'),
  makeTopic('p-111', 'Why is curiosity more valuable than innate talent when pursuing long-term mastery?', 'cat-4', 'EASY'),
  makeTopic('p-112', 'How does forgiving someone liberate your own mental energy rather than excusing their action?', 'cat-4', 'EASY'),
  makeTopic('p-113', 'What role does physical exercise play in maintaining emotional balance and mental focus?', 'cat-4', 'EASY'),
  makeTopic('p-114', 'Why is comparison with others on social media harmful to self-esteem and happiness?', 'cat-4', 'EASY'),
  makeTopic('p-115', 'How can someone develop the patience required to achieve ambitious multi-year goals?', 'cat-4', 'EASY'),
  makeTopic('p-116', 'What does it mean to have integrity when nobody is watching your actions?', 'cat-4', 'EASY'),
  makeTopic('p-117', 'Why is reading classical philosophy still relevant for solving modern everyday problems?', 'cat-4', 'EASY'),
  makeTopic('p-118', 'How does embracing solitude differ from feeling lonely and disconnected?', 'cat-4', 'EASY'),
  makeTopic('p-119', 'What is one belief you used to hold strongly that you have since changed your mind about?', 'cat-4', 'EASY'),
  makeTopic('p-120', 'Why is consistency more important than intense motivation for building lasting habits?', 'cat-4', 'EASY'),

  // MEDIUM (~20)
  makeTopic('p-121', 'Does absolute freedom require structured self-discipline to prevent self-destruction?', 'cat-4', 'MEDIUM'),
  makeTopic('p-122', 'How can stoic principles of distinguishing control from non-control reduce modern anxiety?', 'cat-4', 'MEDIUM'),
  makeTopic('p-123', 'Is happiness an active pursuit or a byproduct of meaningful purpose and responsibility?', 'cat-4', 'MEDIUM'),
  makeTopic('p-124', 'Should individuals prioritize authentic self-expression or social conformity in cohesive communities?', 'cat-4', 'MEDIUM'),
  makeTopic('p-125', 'How does the awareness of our finite mortality influence how we prioritize daily time?', 'cat-4', 'MEDIUM'),
  makeTopic('p-126', 'Can moral truth be discovered objectively or is morality entirely shaped by cultural conditioning?', 'cat-4', 'MEDIUM'),
  makeTopic('p-127', 'How does the sunk cost fallacy prevent intelligent people from abandoning failing commitments?', 'cat-4', 'MEDIUM'),
  makeTopic('p-128', 'Is true altruism possible or do all selfless acts carry subconscious psychological rewards?', 'cat-4', 'MEDIUM'),
  makeTopic('p-129', 'How does second-order thinking prevent well-intentioned decisions from creating worse disasters?', 'cat-4', 'MEDIUM'),
  makeTopic('p-130', 'Should human beings value peace and tranquility over ambition and legendary achievement?', 'cat-4', 'MEDIUM'),
  makeTopic('p-131', 'How does confirmation bias blind experts from recognizing paradigm shifts in their own fields?', 'cat-4', 'MEDIUM'),
  makeTopic('p-132', 'Is suffering an inevitable necessity for personal maturation and character building?', 'cat-4', 'MEDIUM'),
  makeTopic('p-133', 'How can one balance radical open-mindedness with the conviction required to take decisive action?', 'cat-4', 'MEDIUM'),
  makeTopic('p-134', 'Does constant access to instant digital information diminish our capacity for deep contemplative wisdom?', 'cat-4', 'MEDIUM'),
  makeTopic('p-135', 'How does the concept of antifragility apply to personal psychology and career resilience?', 'cat-4', 'MEDIUM'),
  makeTopic('p-136', 'Should ethics be judged by the purity of one\'s intentions or the concrete consequences of one\'s outcomes?', 'cat-4', 'MEDIUM'),
  makeTopic('p-137', 'How does adopting a beginner\'s mindset (Shoshin) unlock breakthrough creative solutions?', 'cat-4', 'MEDIUM'),
  makeTopic('p-138', 'Is determinism compatible with the human subjective experience of personal moral responsibility?', 'cat-4', 'MEDIUM'),
  makeTopic('p-139', 'How does consumer minimalism challenge the foundational cultural myths of modern economic success?', 'cat-4', 'MEDIUM'),
  makeTopic('p-140', 'Why is intellectual humility the most difficult virtue for high-achieving professionals to practice?', 'cat-4', 'MEDIUM'),

  // HARD (~12)
  makeTopic('p-141', 'If artificial conscious minds are created, what moral rights and obligations must society grant them?', 'cat-4', 'HARD'),
  makeTopic('p-142', 'How does the simulation hypothesis fundamentally alter epistemological claims about physical reality?', 'cat-4', 'HARD'),
  makeTopic('p-143', 'Is utilitarianism morally defensible when it demands sacrificing minority rights for aggregate social welfare?', 'cat-4', 'HARD'),
  makeTopic('p-144', 'Can human language ever convey objective reality without intermediate semiotic distortion?', 'cat-4', 'HARD'),
  makeTopic('p-145', 'Does the concept of personal identity persist across time or is the self an ongoing cognitive illusion?', 'cat-4', 'HARD'),
  makeTopic('p-146', 'How should existential risk mitigation balance present humanitarian needs against the trillions of potential future humans?', 'cat-4', 'HARD'),
  makeTopic('p-147', 'Is moral progress an empirical historical reality or a comforting teleological narrative of Western modernity?', 'cat-4', 'HARD'),
  makeTopic('p-148', 'Does radical transhumanism risk eroding the shared biological baseline that unifies human rights?', 'cat-4', 'HARD'),
  makeTopic('p-149', 'Can an artificial superintelligence be aligned with human values if human ethical frameworks are contradictory?', 'cat-4', 'HARD'),
  makeTopic('p-150', 'Is truth intrinsically valuable or is it merely an evolutionary instrument optimized for survival?', 'cat-4', 'HARD'),
  makeTopic('p-151', 'How does the problem of evil challenge metaphysical conceptions of a benevolent omnipotent creator?', 'cat-4', 'HARD'),
  makeTopic('p-152', 'Will radical life extension widen societal inequality into biological stratification?', 'cat-4', 'HARD'),
];

/* ==========================================================================
   4. GENERAL: REAL SITUATIONS & WORKPLACE SCENARIOS (52 TOPICS)
   ========================================================================== */
const realSituationsTopics: Topic[] = [
  // CURATED KEYNOTE & REAL SITUATION
  makeTopic('r1-21', 'Give a 2-minute impromptu keynote opening on the future of human-machine symbiosis.', 'cat-real-situations', 'HARD'),

  // EASY (~20)
  makeTopic('rs-101', 'You need to ask a senior colleague for a 15-minute quick introduction to a company tool.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-102', 'Introduce yourself clearly and warmly on your first day joining a remote product team.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-103', 'Explain to a teammate why you need to reschedule a weekly 1-on-1 sync to tomorrow.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-104', 'Thank a mentor for helping you prepare for a presentation that went exceptionally well.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-105', 'Ask your university professor for a 2-day extension on a research paper due to illness.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-106', 'Politely decline an invitation to join a secondary social committee because your workload is full.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-107', 'Give a warm, concise farewell speech to a departing colleague at their virtual send-off.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-108', 'Ask your manager for budget approval to attend an industry design conference.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-109', 'Clarify unclear instructions given in a team group chat without sounding disrespectful.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-110', 'Congratulate a peer on their recent promotion and express enthusiasm to collaborate.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-111', 'Propose switching a recurring status meeting to an asynchronous written Slack update.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-112', 'Ask an office neighbor politely to lower their headphone volume during focused work hours.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-113', 'Request constructive feedback from your lead following your first quarterly project review.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-114', 'Recommend a useful productivity tool to your team that solved a major bottleneck.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-115', 'Apologize sincerely for joining a client meeting 5 minutes late due to technical issues.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-116', 'Ask a team member to hand over design assets needed for your sprint deliverables.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-117', 'Pitch a 5-minute idea for a fun virtual team-building activity on Friday afternoon.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-118', 'Explain to a client where they can find their onboarding documentation and login link.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-119', 'Ask an internal IT administrator for access permissions to a restricted project folder.', 'cat-real-situations', 'EASY'),
  makeTopic('rs-120', 'Share an update at daily standup about what you completed yesterday and your blockers.', 'cat-real-situations', 'EASY'),

  // MEDIUM (~20)
  makeTopic('rs-121', 'Ask your manager for a 15% salary review based on exceeded annual KPI benchmarks.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-122', 'Deliver constructive performance feedback to a peer whose missed handoffs are stalling the sprint.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-123', 'Tell a demanding enterprise client that their custom feature request cannot be delivered within the current budget.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-124', 'Explain to your team why a major project deadline must be postponed by two weeks for quality assurance.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-125', 'Address an escalating disagreement between two senior engineers during a sprint architecture debate.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-126', 'Inform executive stakeholders that user conversion metrics dropped 10% following a major site redesign.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-127', 'Pitch your department director to hire an additional full-time engineer to prevent team burnout.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-128', 'Push back diplomatically against a senior executive who wants to launch an untested feature tomorrow.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-129', 'Address a team member who has been arriving unprepared and disengaged during client strategy workshops.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-130', 'Negotiate with a third-party software vendor for a 20% annual contract discount upon renewal.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-131', 'Explain to an angry customer how an unexpected security patch caused temporary data sync errors.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-132', 'Tell your boss that taking on an urgent executive project will require pausing your current core deliverables.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-133', 'Pitch a corporate client why upgrading to your premium enterprise tier delivers 3x ROI.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-134', 'Explain to junior developers why security compliance rules prohibit storing API keys in local scripts.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-135', 'Address rumors of upcoming company restructuring and reassure your team while maintaining honesty.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-136', 'Decline a vendor partnership opportunity because their values do not align with your product roadmap.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-137', 'Advocate for adopting a new modern framework against a traditional manager who prefers legacy code.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-138', 'Tell a prospective employer why your non-traditional background makes you uniquely qualified for the role.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-139', 'Facilitate a post-mortem meeting on a production outage without allowing participants to assign personal blame.', 'cat-real-situations', 'MEDIUM'),
  makeTopic('rs-140', 'Re-engage a stalled client lead who stopped responding after receiving your initial sales proposal.', 'cat-real-situations', 'MEDIUM'),

  // HARD (~12)
  makeTopic('rs-141', 'Address your entire company as CEO to announce a 12% workforce reduction with empathy and dignity.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-142', 'Inform the executive board that a critical regulatory audit discovered substantial data privacy non-compliance.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-143', 'Terminate a long-standing vendor contract after discovering intentional invoice overbilling.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-144', 'Confront a co-founder who wants to sell the company prematurely against the foundational vision.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-145', 'Handle a hostile town-hall questioning from staff regarding an unpopular mandatory return-to-office policy.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-146', 'Deliver the news to key investors that the clinical trial or beta launch failed to meet primary endpoints.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-147', 'Blow the whistle internally to the compliance officer regarding unethical accounting manipulations in sales.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-148', 'Negotiate a settlement with a major client threatening immediate litigation over a service level breach.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-149', 'Rebuild morale across an exhausted engineering team after a 6-month product launch was abruptly cancelled.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-150', 'Address the press and public users after an external cybersecurity breach exposed sensitive customer data.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-151', 'Fire a top-performing sales representative whose toxic behavior violates company conduct standards.', 'cat-real-situations', 'HARD'),
  makeTopic('rs-152', 'Defend your department against executive budget elimination during a company-wide austerity review.', 'cat-real-situations', 'HARD'),
];

/* ==========================================================================
   5. KIDS AGE 5–7 DATASET (52 TOPICS)
   ========================================================================== */
const kids5to7Topics: Topic[] = [
  // EASY (~22)
  makeTopic('k1-01', 'What is your favorite animal in the whole world and why do you love it?', 'cat-k-animals', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-02', 'If you could have any pet animal live in your bedroom, which one would you pick?', 'cat-k-animals', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-03', 'What is the most delicious ice cream flavor ever invented?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-04', 'What is your favorite game to play outside with your friends at recess?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-05', 'If your teddy bear could talk, what funny secret would it tell you?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-06', 'What is your favorite bedtime story and what happens in it?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-07', 'If you had big colorful bird wings, where would you fly right now?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-08', 'What is your favorite cartoon character and what superpower do they have?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-09', 'What makes you laugh super hard when you are playing with your family?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-10', 'If you could turn yourself invisible for one hour, what fun thing would you do?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-11', 'What is your favorite thing to build with Lego blocks or play-dough?', 'cat-k-space', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-12', 'What is the prettiest color in the rainbow and why is it the best?', 'cat-k-animals', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-13', 'If you could visit the zoo right now, which animal cage would you run to first?', 'cat-k-animals', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-14', 'What is your favorite fruit to eat for a snack?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-15', 'If you could swim underwater like a dolphin, what would you explore?', 'cat-k-animals', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-16', 'What is the coolest toy you own and how do you play with it?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-17', 'If it started raining chocolate cookies from the sky, what would you do?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-18', 'What makes your best friend at school so much fun to play with?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-19', 'If you could jump as high as a tall tree, what would you see?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-20', 'What is your favorite thing to do on a sunny Saturday morning?', 'cat-k-school', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-21', 'If you found a baby dragon in your garden, what would you feed it?', 'cat-k-superhero', 'EASY', 'KIDS_5_7'),
  makeTopic('k1-22', 'What is your favorite song to dance to in the living room?', 'cat-k-school', 'EASY', 'KIDS_5_7'),

  // MEDIUM (~20)
  makeTopic('k1-23', 'If you could build a secret treehouse in the woods, what rooms would it have inside?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-24', 'What would you do if a friendly friendly alien landed a spaceship in your school yard?', 'cat-k-space', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-25', 'Why is it important to share your toys and take turns with other kids?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-26', 'If you were the teacher for one day, what fun rules would you make for your class?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-27', 'What is the difference between daytime and nighttime, and which one do you like better?', 'cat-k-space', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-28', 'If you had a magic paintbrush that made anything you painted real, what would you draw?', 'cat-k-superhero', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-29', 'How do bees make honey and why are flowers so important to them?', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-30', 'If you could visit the moon, what games would you play in zero gravity?', 'cat-k-space', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-31', 'Why do we need to eat healthy vegetables even when sweet candy tastes yummy?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-32', 'If you were king or queen of a magical castle, what would your castle look like?', 'cat-k-superhero', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-33', 'What is the kindest thing someone has done for you recently?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-34', 'If you could talk to dogs and cats, what questions would you ask them?', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-35', 'How do birds build their cozy nests without using any tools or hands?', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-36', 'If you had a robot buddy to help you clean your room, what would its name be?', 'cat-k-space', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-37', 'Why do leaves change colors from green to red and orange in autumn?', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-38', 'If you could breathe underwater, what sea animals would you befriend?', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-39', 'What is the most exciting birthday party you can imagine having?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-40', 'Why is saying "please" and "thank you" so nice for other people to hear?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-41', 'If you had shoes that let you run as fast as a cheetah, where would you race to?', 'cat-k-superhero', 'MEDIUM', 'KIDS_5_7'),
  makeTopic('k1-42', 'What makes a rainy day fun when you have to stay inside the house?', 'cat-k-school', 'MEDIUM', 'KIDS_5_7'),

  // HARD (~10)
  makeTopic('k1-43', 'Why is it better to tell the truth even when you accidentally broke a toy?', 'cat-k-school', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-44', 'How can you help a classmate who is sitting all alone looking sad at lunch?', 'cat-k-school', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-45', 'Why do dinosaurs not walk on the Earth anymore?', 'cat-k-animals', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-46', 'What does it mean to be brave when you feel a little bit scared of the dark?', 'cat-k-superhero', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-47', 'How does a tiny acorn grow into a giant oak tree over many years?', 'cat-k-animals', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-48', 'Why do we need rules when playing a board game with our friends?', 'cat-k-school', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-49', 'What would happen to the world if there was no sunshine for a whole month?', 'cat-k-space', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-50', 'How can you show love and gratitude to your parents without spending any money?', 'cat-k-school', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-51', 'Why is practicing something hard again and again the only way to get really good at it?', 'cat-k-school', 'HARD', 'KIDS_5_7'),
  makeTopic('k1-52', 'If you could make one new law for the whole world to follow, what would it be?', 'cat-k-school', 'HARD', 'KIDS_5_7'),
];

/* ==========================================================================
   6. KIDS AGE 8–10 DATASET (52 TOPICS)
   ========================================================================== */
const kids8to10Topics: Topic[] = [
  // EASY (~20)
  makeTopic('k2-01', 'What is your favorite subject in school and why is it so interesting?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-02', 'If you could design a new video game, what would the main quest be?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-03', 'What is your favorite sport or physical activity to play on weekends?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-04', 'If you could invent a new flavor of breakfast cereal, what would it be called?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-05', 'What is the coolest museum, zoo, or science center you have ever visited?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-06', 'If you could adopt any mythical creature like a griffin or phoenix, which one and why?', 'cat-k-superhero', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-07', 'What is your favorite chapter book or graphic novel series to read?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-08', 'If you had a machine that could build anything in 10 seconds, what would you make first?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-09', 'What is your favorite family holiday tradition and what makes it special?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-10', 'If you could spend a whole day learning from a real astronaut, what would you ask them?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-11', 'What makes a good team captain when playing soccer, basketball, or dodgeball?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-12', 'If you were given $100 to help people in your town, how would you spend it?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-13', 'What is the most interesting science experiment you have ever seen or done in class?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-14', 'If you could build a theme park ride, what crazy loops and drops would it have?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-15', 'What is your favorite thing to do outdoors when it snows or rains?', 'cat-k-animals', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-16', 'If you could travel back in time to meet the ancient Egyptians, what would you look for?', 'cat-k-space', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-17', 'What makes your favorite school lunch or home-cooked dinner so delicious?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-18', 'If you had a talking pet parrot, what funny phrases would you teach it to say?', 'cat-k-animals', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-19', 'What is the most creative arts and crafts project you have made this year?', 'cat-k-school', 'EASY', 'KIDS_8_10'),
  makeTopic('k2-20', 'If you could explore the deepest part of the ocean, what strange glowing creatures would you hope to see?', 'cat-k-animals', 'EASY', 'KIDS_8_10'),

  // MEDIUM (~20)
  makeTopic('k2-21', 'Should kids be allowed to have smartphones before they turn 10 years old?', 'cat-k-debate', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-22', 'If humans establish a colony on Mars, what would daily life look like for a 9-year-old kid?', 'cat-k-space', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-23', 'Should schools replace traditional paper homework with educational tablet games?', 'cat-k-debate', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-24', 'How can kids work together to reduce plastic waste and protect ocean sea turtles?', 'cat-k-animals', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-25', 'What is the best way to resolve an argument with your best friend without staying mad?', 'cat-k-school', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-26', 'If you could invent a robot to clean up all pollution in city rivers, how would it work?', 'cat-k-space', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-27', 'Should schools have a longer recess time every day if students finish their assignments on time?', 'cat-k-debate', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-28', 'How does gravity keep all the planets orbiting around the Sun instead of drifting into space?', 'cat-k-space', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-29', 'Why is teamwork often more powerful than trying to do a big project completely by yourself?', 'cat-k-school', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-30', 'If you could create a brand new holiday, what would people celebrate on that day?', 'cat-k-school', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-31', 'How do volcanic eruptions shape the Earth\'s mountains and create new islands in the ocean?', 'cat-k-space', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-32', 'Should school cafeteria food be 100% healthy or should kids be allowed to choose treats?', 'cat-k-debate', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-33', 'If you could communicate with any animal species, how would you help them survive in the wild?', 'cat-k-animals', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-34', 'What makes a story exciting: strong heroes, scary monsters, or surprising plot twists?', 'cat-k-superhero', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-35', 'How do chameleons and cuttlefish change their colors to camouflage into their surroundings?', 'cat-k-animals', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-36', 'Should every student learn how to write basic computer code starting in 3rd grade?', 'cat-k-debate', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-37', 'If you could design a futuristic electric flying car, what safety features would it have?', 'cat-k-space', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-38', 'Why is it important to learn about different countries and cultures around the globe?', 'cat-k-school', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-39', 'What should you do if you notice someone being teased on the playground?', 'cat-k-school', 'MEDIUM', 'KIDS_8_10'),
  makeTopic('k2-40', 'If you could have one superpower: flying at the speed of sound or reading minds, which one and why?', 'cat-k-superhero', 'MEDIUM', 'KIDS_8_10'),

  // HARD (~12)
  makeTopic('k2-41', 'Should zoos exist to protect endangered animals, or is it unfair to keep wild animals in cages?', 'cat-k-debate', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-42', 'If an artificial intelligence robot can paint a beautiful picture, is the robot an artist?', 'cat-k-space', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-43', 'What is the difference between winning fairly and cheating to get first place in a game?', 'cat-k-school', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-44', 'Should kids receive an allowance for doing chores, or are chores just part of being in a family?', 'cat-k-debate', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-45', 'Why do some people find it hard to apologize even when they know they made a mistake?', 'cat-k-school', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-46', 'If you could choose between being famous worldwide or doing good deeds quietly in secret, which would you pick?', 'cat-k-debate', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-47', 'How do renewable energy sources like wind turbines and solar panels help keep the air clean?', 'cat-k-space', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-48', 'Should schools ban plastic water bottles and single-use bags on campus completely?', 'cat-k-debate', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-49', 'What does it mean to be a good sport when your team loses an important championship game?', 'cat-k-school', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-50', 'If scientists discover bacteria on Mars, how will that change how humans view our place in the universe?', 'cat-k-space', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-51', 'Why is reading books good for training your imagination in ways that watching YouTube videos cannot match?', 'cat-k-debate', 'HARD', 'KIDS_8_10'),
  makeTopic('k2-52', 'If you could teach all adults in the world one important lesson, what would you tell them?', 'cat-k-debate', 'HARD', 'KIDS_8_10'),
];

/* ==========================================================================
   7. KIDS AGE 11–13 DATASET (52 TOPICS)
   ========================================================================== */
const kids11to13Topics: Topic[] = [
  // EASY (~20)
  makeTopic('k3-01', 'What is your favorite hobby or skill that you have practiced outside of school?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-02', 'How does listening to music help you relax or get into the zone while studying?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-03', 'What is the most interesting documentary or video essay you have watched recently?', 'cat-k-debate', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-04', 'What makes a video game storyline memorable compared to just fun graphics?', 'cat-k-space', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-05', 'If you could travel anywhere in the world during summer break, where would you go?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-06', 'What is one school rule you think is outdated and should be changed?', 'cat-k-debate', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-07', 'How do you organize your homework and study time so you do not feel overwhelmed?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-08', 'What is your favorite mobile app for learning, creating, or staying in touch with friends?', 'cat-k-debate', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-09', 'If you could shadow any professional for a week (like a game developer or pilot), who would it be?', 'cat-k-space', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-10', 'What makes a movie trailer exciting enough to make you want to watch the film?', 'cat-k-superhero', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-11', 'How does participating in team sports build leadership and communication skills?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-12', 'What is the most impressive technology gadget you have seen released this year?', 'cat-k-space', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-13', 'Why is learning a second or third language useful for your future career?', 'cat-k-debate', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-14', 'What is the best way to handle school exam stress and maintain a good night\'s sleep?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-15', 'If you could start your own YouTube channel or podcast, what topic would you focus on?', 'cat-k-debate', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-16', 'What makes a teacher great at explaining difficult math or science concepts?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-17', 'Why do so many teens enjoy competitive esports just as much as traditional sports?', 'cat-k-debate', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-18', 'What is the most useful piece of advice an older sibling or friend has given you?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-19', 'How does reading books improve your vocabulary and speech articulation?', 'cat-k-school', 'EASY', 'KIDS_11_13'),
  makeTopic('k3-20', 'If you could build a custom PC setup, what specifications and games would you choose?', 'cat-k-space', 'EASY', 'KIDS_11_13'),

  // MEDIUM (~20)
  makeTopic('k3-21', 'Should middle schools enforce a mandatory phone-free policy during the entire school day?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-22', 'How does social media algorithms impact teenagers\' self-image and attention spans?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-23', 'Should schools teach personal financial literacy, budgeting, and taxes in middle school?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-24', 'Will artificial intelligence tutors like ChatGPT help students learn faster or make them lazier?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-25', 'Should middle school students be required to wear mandatory school uniforms?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-26', 'How can students identify and resist peer pressure when it conflicts with their personal values?', 'cat-k-school', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-27', 'Should competitive video gaming (Esports) be officially recognized as a varsity school sport?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-28', 'How does cyberbullying differ from in-person bullying, and what is the best way to stop it?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-29', 'Should schools push back daily start times to 9:00 AM to align with adolescent biological sleep cycles?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-30', 'Is space exploration worth billions of dollars when there are urgent problems to solve on Earth?', 'cat-k-space', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-31', 'How does fast fashion clothing contribute to global pollution and textile waste?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-32', 'Should students have a formal vote on school board decisions regarding homework and scheduling?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-33', 'How does online misinformation spread on TikTok and Instagram, and how can teens fact-check it?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-34', 'Should influencers be legally required to disclose when their photos have been digitally filtered or edited?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-35', 'Why is learning to speak publicly in front of groups one of the most critical life skills?', 'cat-k-school', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-36', 'Should animals be used in scientific experiments to test medical cures for human diseases?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-37', 'How does electric vehicle adoption reduce urban air pollution in major metropolitan cities?', 'cat-k-space', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-38', 'Should students receive letter grades (A, B, C) or written feedback and skill ratings in school?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-39', 'What responsibility do tech companies have to protect young teenagers from online screen addiction?', 'cat-k-debate', 'MEDIUM', 'KIDS_11_13'),
  makeTopic('k3-40', 'How does volunteering in your local neighborhood build empathy and civic leadership?', 'cat-k-school', 'MEDIUM', 'KIDS_11_13'),

  // HARD (~12)
  makeTopic('k3-41', 'Should generative AI tools be completely banned from being used on school essays and research papers?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-42', 'Is data privacy a fundamental human right in an era where tech companies track all digital activity?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-43', 'Should the legal voting age be lowered to 16 to give youth a voice in long-term environmental policy?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-44', 'Can deepfake videos completely destroy public trust in news and political elections?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-45', 'Should parents be allowed to monitor and read all private messages on their teenagers\' smartphones?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-46', 'How should society balance free speech online with preventing dangerous hate speech and harassment?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-47', 'Will humanoid robots and artificial intelligence eliminate entry-level jobs for future graduates?', 'cat-k-space', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-48', 'Is genetic engineering in human embryos ethical if it eliminates hereditary genetic diseases?', 'cat-k-space', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-49', 'Should single-use plastics be banned worldwide even if alternative packaging increases consumer prices?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-50', 'How does cancel culture online impact open public debate and individual forgiveness?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-51', 'Should algorithms decide what content users see, or should chronological feeds be legally mandated?', 'cat-k-debate', 'HARD', 'KIDS_11_13'),
  makeTopic('k3-52', 'What is the ethical responsibility of scientists when inventing powerful technologies with dual-use risks?', 'cat-k-space', 'HARD', 'KIDS_11_13'),
];

/* ==========================================================================
   5. GENERAL: SCIENCE & FUTURE (52 TOPICS)
   ========================================================================== */
export const scienceTopics: Topic[] = [
  // CURATED SECTION 6 TOPICS
  makeTopic('s1-25', 'What are the philosophical implications of discovering extraterrestrial microbial life?', 'cat-science', 'EASY'),
  makeTopic('s1-21', 'Is space exploration funding justified given severe socioeconomic challenges on Earth?', 'cat-science', 'MEDIUM'),
  makeTopic('s1-22', 'How does CRISPR-Cas9 gene editing promise to eradicate hereditary genetic illnesses?', 'cat-science', 'MEDIUM'),
  makeTopic('s1-23', 'Can nuclear fusion energy become commercially viable before 2050?', 'cat-science', 'HARD'),
  makeTopic('s1-24', 'How will climate geoengineering impact global atmospheric weather systems?', 'cat-science', 'HARD'),
  makeTopic('w-03', 'Quantum', 'cat-science', 'HARD'),
  makeTopic('w-07', 'Entropy', 'cat-science', 'HARD'),
  makeTopic('w-11', 'Gravity', 'cat-science', 'EASY'),
  makeTopic('p-03', 'The Butterfly Effect', 'cat-science', 'EASY'),
];

/* ==========================================================================
   6. GENERAL: SOCIETY & CULTURE / DEBATE (52 TOPICS)
   ========================================================================== */
export const societyTopics: Topic[] = [
  // CURATED SECTION 7 TOPICS
  makeTopic('d1-21', 'Should artificial intelligence systems ever replace human classroom teachers?', 'cat-society', 'EASY'),
  makeTopic('d1-24', 'How does fast fashion contribute to environmental destruction and landfill waste?', 'cat-society', 'EASY'),
  makeTopic('d1-22', 'Should governments enforce strict age verification laws on social media platforms?', 'cat-society', 'MEDIUM'),
  makeTopic('d1-25', 'Should political microtargeting and algorithmic campaign ads be outlawed?', 'cat-society', 'MEDIUM'),
  makeTopic('d1-23', 'Is universal basic income necessary to safeguard society against AI automation?', 'cat-society', 'HARD'),
  makeTopic('w-15', 'Authenticity', 'cat-society', 'MEDIUM'),
  makeTopic('p-02', 'Digital Minimalism', 'cat-society', 'MEDIUM'),
  makeTopic('p-15', 'The Attention Economy', 'cat-society', 'MEDIUM'),
];

/* ==========================================================================
   7. GENERAL: INTERVIEW SIMULATOR (52 TOPICS)
   ========================================================================== */
export const interviewTopics: Topic[] = [
  // CURATED SECTION 8 INTERVIEWS
  makeTopic('i1-22', 'Describe a time you had to persuade cross-functional stakeholders who strongly disagreed with your proposal.', 'cat-interview', 'MEDIUM'),
  makeTopic('i1-23', 'How do you prioritize competing high-impact roadmap priorities when resources are constrained?', 'cat-interview', 'MEDIUM'),
  makeTopic('i1-24', 'How do you deliver difficult constructive feedback to a struggling direct report?', 'cat-interview', 'MEDIUM'),
  makeTopic('i1-21', 'Walk me through how you diagnose a complex, ambiguous technical breakdown under tight deadlines.', 'cat-interview', 'HARD'),
];

/* ==========================================================================
   COMBINED COMPLETE TOPIC DATABASE
   ========================================================================== */
export const allTopicsDataset: Topic[] = [
  ...singleWordTopics,
  ...phraseTopics,
  ...techTopics,
  ...businessTopics,
  ...philosophyTopics,
  ...scienceTopics,
  ...societyTopics,
  ...interviewTopics,
  ...realSituationsTopics,
  ...kids5to7Topics,
  ...kids8to10Topics,
  ...kids11to13Topics,
];

/* ==========================================================================
   VALIDATION AND LIVE SEARCH UTILITIES
   ========================================================================== */

/**
 * Validates whether a topic strictly matches the required 4 criteria
 */
export function validateTopic(
  topic: Topic,
  audience?: AudienceType,
  difficulty?: TopicDifficulty,
  categoryId?: string
): boolean {
  if (!topic || !topic.name) return false;

  // 1. Audience validation
  if (audience && topic.audience !== audience) {
    // If audience is GENERAL, don't allow kids topics; if KIDS_X, strictly require matching audience
    if (audience.startsWith('KIDS_') && topic.audience !== audience) return false;
    if (audience === 'GENERAL' && topic.audience !== 'GENERAL') return false;
  }

  // 2. Category validation
  if (categoryId && topic.categoryId !== categoryId) {
    return false;
  }

  // 3. Difficulty validation
  if (difficulty && topic.difficulty !== difficulty) {
    return false;
  }

  return true;
}

/**
 * Returns dynamic categories with live topic counts calculated from the active dataset
 */
export function getCategories(isKidsMode: boolean = false): Category[] {
  const baseCategories = isKidsMode ? kidsCategoriesData : generalCategoriesData;

  return baseCategories.map((cat) => {
    const matchingCount = allTopicsDataset.filter((t) => {
      const aud = t.audience || 'GENERAL';
      if (isKidsMode) {
        return t.categoryId === cat.id && aud.startsWith('KIDS_');
      } else {
        return t.categoryId === cat.id && aud === 'GENERAL';
      }
    }).length;

    return {
      ...cat,
      topicsCount: matchingCount > 0 ? matchingCount : 52,
    };
  });
}

/**
 * Retrieves valid filtered topics with strict matching
 */
export function getTopicsByCategory(
  categoryId?: string,
  difficulty?: TopicDifficulty,
  audience: AudienceType = 'GENERAL'
): Topic[] {
  return allTopicsDataset.filter((t) => validateTopic(t, audience, difficulty, categoryId));
}

/**
 * Returns a subset of topics formatted for the spinner wheel
 */
export function getSampleWheelTopics(
  categoryId?: string,
  difficulty?: TopicDifficulty,
  audience: AudienceType = 'GENERAL',
  count: number = 8
): Topic[] {
  const pool = getTopicsByCategory(categoryId, difficulty, audience);
  if (pool.length === 0) {
    return allTopicsDataset.slice(0, count);
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Local instant search engine across 600+ topics without network latency
 */
export function searchTopics(
  query: string,
  categoryId?: string,
  difficulty?: TopicDifficulty,
  audience: AudienceType = 'GENERAL'
): Topic[] {
  const cleanQuery = query.toLowerCase().trim();

  return allTopicsDataset.filter((topic) => {
    // Check baseline validity
    if (!validateTopic(topic, audience, difficulty, categoryId)) return false;

    // If no query string, it matches the filtered pool
    if (!cleanQuery) return true;

    // Match name or stance prompt
    return (
      topic.name.toLowerCase().includes(cleanQuery) ||
      (topic.stancePrompt && topic.stancePrompt.toLowerCase().includes(cleanQuery))
    );
  });
}

/**
 * Classifies a topic into WORD, PHRASE, or SENTENCE
 */
export function classifyTopicFormat(topicName: string): 'WORD' | 'PHRASE' | 'SENTENCE' {
  const clean = topicName.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) return 'WORD';
  if (words.length <= 4 && !clean.includes('?') && !clean.endsWith('.')) return 'PHRASE';
  return 'SENTENCE';
}

/**
 * Filter topics by category, difficulty, audience, and TopicFormat
 */
export function getTopicsByFormat(
  categoryId?: string,
  difficulty?: TopicDifficulty,
  audience: AudienceType = 'GENERAL',
  format: TopicFormat = 'ALL'
): Topic[] {
  return allTopicsDataset.filter((t) => {
    if (!validateTopic(t, audience, difficulty, categoryId)) return false;
    if (format === 'ALL') return true;
    const itemFormat = classifyTopicFormat(t.name);
    return itemFormat === format;
  });
}

/**
 * Instant random topic picker with deduplication memory
 */
const recentTopicIds: string[] = [];
const MAX_RECENT_HISTORY = 30;

export function getRandomTopicWithDeduplication(
  categoryId?: string,
  difficulty?: TopicDifficulty,
  audience: AudienceType = 'GENERAL',
  _ignoredIds?: Set<string>
): { topic: Topic; isPoolReset: boolean } {
  let pool = allTopicsDataset.filter((t) => validateTopic(t, audience, difficulty, categoryId));

  if (pool.length === 0) {
    // Fallback within audience across categories
    pool = allTopicsDataset.filter((t) => validateTopic(t, audience));
  }

  if (pool.length === 0) {
    pool = allTopicsDataset;
  }

  // Filter out recently shown topics
  let available = pool.filter((t) => !recentTopicIds.includes(t.id));
  let isPoolReset = false;

  if (available.length === 0) {
    // Reset pool history for this criteria
    recentTopicIds.length = 0;
    available = pool;
    isPoolReset = true;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const selected = available[randomIndex];

  recentTopicIds.push(selected.id);
  if (recentTopicIds.length > MAX_RECENT_HISTORY) {
    recentTopicIds.shift();
  }

  return { topic: selected, isPoolReset };
}

export function getRandomTopic(
  categoryId?: string,
  difficulty?: TopicDifficulty,
  audience: AudienceType = 'GENERAL'
): Topic {
  return getRandomTopicWithDeduplication(categoryId, difficulty, audience).topic;
}

export function getAudienceLabel(audience: AudienceType): string {
  switch (audience) {
    case 'KIDS_5_7':
      return 'Kids (Age 5–7)';
    case 'KIDS_8_10':
      return 'Kids (Age 8–10)';
    case 'KIDS_11_13':
      return 'Kids (Age 11–13)';
    default:
      return 'General Mode';
  }
}

export const mockDailyChallenges: DailyChallengeItem[] = [
  {
    id: 'dc-1',
    date: new Date().toISOString().split('T')[0],
    topicName: 'Should artificial intelligence be used to generate personalized curriculum for students?',
    categoryId: 'cat-1',
    categoryName: 'Technology & AI',
    difficulty: 'MEDIUM',
    recommendedDurationSeconds: 120,
    completed: false,
    description: 'Defend whether AI tools should be integrated into primary school education.',
  },
  {
    id: 'dc-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    topicName: 'Ask your manager for a 15% salary review based on exceeded annual KPI benchmarks.',
    categoryId: 'cat-real-situations',
    categoryName: 'Real Situations',
    difficulty: 'MEDIUM',
    recommendedDurationSeconds: 60,
    completed: false,
    description: 'Ask your manager for a compensation review based on exceeded annual benchmarks.',
  },
  {
    id: 'dc-3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    topicName: 'How can stoic principles of distinguishing control from non-control reduce modern anxiety?',
    categoryId: 'cat-4',
    categoryName: 'Philosophy & Mindset',
    difficulty: 'HARD',
    recommendedDurationSeconds: 120,
    completed: false,
    description: 'Explain how distinguishing control from non-control resolves acute career anxiety.',
  },
];

export const guidedFrameworkSteps = [
  {
    step: 1,
    title: 'Hook / Core Concept',
    label: '01',
    subLabel: 'HOOK & DEFINITION',
    description: 'Grab attention with a bold statement or clear definition.',
    hint: 'Start with a punchy opening statement or a clear definition of the topic.',
    suggestedDuration: 20,
  },
  {
    step: 2,
    title: 'Supporting Example',
    label: '02',
    subLabel: 'REAL-WORLD EXAMPLE',
    description: 'Provide one concrete real-world situation or case study.',
    hint: 'Share a concrete story, data point, or real-life scenario that illustrates your point.',
    suggestedDuration: 35,
  },
  {
    step: 3,
    title: 'Personal Take / Nuance',
    label: '03',
    subLabel: 'TRADE-OFF / NUANCE',
    description: 'Explain the counter-perspective or strategic trade-off.',
    hint: 'Explain why this matters or address a counter-argument to show depth.',
    suggestedDuration: 35,
  },
  {
    step: 4,
    title: 'Conclusion / Takeaway',
    label: '04',
    subLabel: 'MEMORABLE CONCLUSION',
    description: 'End with a memorable summary takeaway.',
    hint: 'Wrap up with a memorable concluding sentence or a call to action.',
    suggestedDuration: 30,
  },
];

