-- Migration V4: Add Difficulty to Topics & PracticeSessions, Seed Complete Matrix

ALTER TABLE topics ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY';
ALTER TABLE practice_sessions ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'EASY';
ALTER TABLE practice_sessions ADD COLUMN IF NOT EXISTS time_limit_seconds INTEGER DEFAULT 120;

-- Ensure all standard categories exist
INSERT INTO categories (id, name, description) VALUES
('cat-1', 'Technology', 'Artificial intelligence, software architecture, cloud, cyber, and digital innovation.'),
('cat-2', 'Fitness', 'Workouts, physical conditioning, sports nutrition, recovery, and active wellness.'),
('cat-3', 'Business & Leadership', 'Startups, venture capital, executive strategy, product growth, and negotiations.'),
('cat-4', 'Philosophy & Mindset', 'Stoicism, cognitive models, ethics, decision making, and human consciousness.'),
('cat-5', 'Creative Writing', 'Narrative design, storytelling, character arcs, subtext, and world building.'),
('cat-6', 'Daily Life & Society', 'Communication habits, mindfulness, digital culture, relationships, and modern living.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- =======================================================
-- 1. TECHNOLOGY TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty) VALUES
-- EASY
('tech-e-1', 'Java', 'cat-1', 'EASY'),
('tech-e-2', 'Python', 'cat-1', 'EASY'),
('tech-e-3', 'React', 'cat-1', 'EASY'),
('tech-e-4', 'Docker', 'cat-1', 'EASY'),
('tech-e-5', 'PostgreSQL', 'cat-1', 'EASY'),
('tech-e-6', 'REST APIs', 'cat-1', 'EASY'),
-- MEDIUM
('tech-m-1', 'Neural Networks & Deep Learning', 'cat-1', 'MEDIUM'),
('tech-m-2', 'Kubernetes & Container Orchestration', 'cat-1', 'MEDIUM'),
('tech-m-3', 'Cloud Native Microservices Architecture', 'cat-1', 'MEDIUM'),
('tech-m-4', 'Cybersecurity & Zero Trust Architecture', 'cat-1', 'MEDIUM'),
('tech-m-5', 'Quantum Computing Principles', 'cat-1', 'MEDIUM'),
('tech-m-6', 'Generative AI & LLM Systems', 'cat-1', 'MEDIUM'),
-- HARD (Discussion Prompts & Complex Architectural Challenges)
('tech-h-1', 'Will AI replace software engineers or amplify engineering throughput?', 'cat-1', 'HARD'),
('tech-h-2', 'Privacy vs Convenience: Can true digital confidentiality exist in the cloud era?', 'cat-1', 'HARD'),
('tech-h-3', 'Monolithic Architecture vs Microservices: When does distributed complexity become technical debt?', 'cat-1', 'HARD'),
('tech-h-4', 'The Ethics of Autonomous AI Systems in High-Stakes Decision Making', 'cat-1', 'HARD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty;

-- =======================================================
-- 2. FITNESS TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty) VALUES
-- EASY
('fit-e-1', 'Back Workout', 'cat-2', 'EASY'),
('fit-e-2', 'Push Ups Technique', 'cat-2', 'EASY'),
('fit-e-3', 'Cardio Fundamentals', 'cat-2', 'EASY'),
('fit-e-4', 'Hydration & Daily Water Intake', 'cat-2', 'EASY'),
('fit-e-5', 'Daily Step Count & Walking Habits', 'cat-2', 'EASY'),
('fit-e-6', 'Protein & Muscle Recovery', 'cat-2', 'EASY'),
-- MEDIUM
('fit-m-1', 'Zone 2 Cardiovascular Training Mechanics', 'cat-2', 'MEDIUM'),
('fit-m-2', 'Progressive Overload & Periodization Models', 'cat-2', 'MEDIUM'),
('fit-m-3', 'HIIT vs Steady State Cardio for Longevity', 'cat-2', 'MEDIUM'),
('fit-m-4', 'Sleep Architecture and Hormonal Muscle Synthesis', 'cat-2', 'MEDIUM'),
('fit-m-5', 'Intermittent Fasting & Autophagy Dynamics', 'cat-2', 'MEDIUM'),
-- HARD (Discussion Prompts & Critical Physiology Questions)
('fit-h-1', 'Is extreme cardiovascular endurance training detrimental to long-term joint health?', 'cat-2', 'HARD'),
('fit-h-2', 'The Psychology of Fitness Plateaus: Overcoming mental vs physiological barriers', 'cat-2', 'HARD'),
('fit-h-3', 'Biohacking and Longevity Science: Fad supplements vs evidence-based habits', 'cat-2', 'HARD'),
('fit-h-4', 'Should athletic performance metrics prioritize aesthetics or functional mobility?', 'cat-2', 'HARD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty;

-- =======================================================
-- 3. BUSINESS & LEADERSHIP TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty) VALUES
-- EASY
('biz-e-1', 'Elevator Pitch', 'cat-3', 'EASY'),
('biz-e-2', 'Customer Feedback', 'cat-3', 'EASY'),
('biz-e-3', 'Startup MVP', 'cat-3', 'EASY'),
('biz-e-4', 'Brand Identity', 'cat-3', 'EASY'),
('biz-e-5', 'Team Brainstorming', 'cat-3', 'EASY'),
-- MEDIUM
('biz-m-1', 'Product-Led Growth vs Sales-Led Go-To-Market', 'cat-3', 'MEDIUM'),
('biz-m-2', 'Venture Capital Term Sheets & Valuation Multiples', 'cat-3', 'MEDIUM'),
('biz-m-3', 'Unit Economics & Customer Acquisition Cost (CAC)', 'cat-3', 'MEDIUM'),
('biz-m-4', 'High-Performance Remote Work Culture & Trust', 'cat-3', 'MEDIUM'),
('biz-m-5', 'Negotiation Principles and Non-Zero-Sum Value Creation', 'cat-3', 'MEDIUM'),
-- HARD
('biz-h-1', 'Is remote work structurally superior to in-office collaboration for innovation?', 'cat-3', 'HARD'),
('biz-h-2', 'Monopoly vs Competition: Why zero-to-one startups must capture niche moats', 'cat-3', 'HARD'),
('biz-h-3', 'Corporate Governance in Crisis: Navigating stakeholder ethics vs short-term shareholder returns', 'cat-3', 'HARD'),
('biz-h-4', 'Bootstrap Profitability vs Venture Hyper-Growth: Which builds enduring enterprises?', 'cat-3', 'HARD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty;

-- =======================================================
-- 4. PHILOSOPHY & MINDSET TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty) VALUES
-- EASY
('phil-e-1', 'Gratitude', 'cat-4', 'EASY'),
('phil-e-2', 'Morning Routine', 'cat-4', 'EASY'),
('phil-e-3', 'Mindfulness', 'cat-4', 'EASY'),
('phil-e-4', 'Journaling Habits', 'cat-4', 'EASY'),
('phil-e-5', 'Personal Values', 'cat-4', 'EASY'),
-- MEDIUM
('phil-m-1', 'Stoicism: The Dichotomy of Control in Modern Chaos', 'cat-4', 'MEDIUM'),
('phil-m-2', 'First Principles Thinking vs Reasoning by Analogy', 'cat-4', 'MEDIUM'),
('phil-m-3', 'The Paradox of Choice and Decision Fatigue', 'cat-4', 'MEDIUM'),
('phil-m-4', 'Cognitive Biases: Confirmation Bias & Availability Heuristic', 'cat-4', 'MEDIUM'),
('phil-m-5', 'Existentialism: Constructing Purpose in an Indifferent Universe', 'cat-4', 'MEDIUM'),
-- HARD
('phil-h-1', 'Can true stoic equanimity exist within modern high-velocity consumer capitalism?', 'cat-4', 'HARD'),
('phil-h-2', 'Free Will vs Determinism: How neuroscience challenges human moral accountability', 'cat-4', 'HARD'),
('phil-h-3', 'The Trolley Problem in Autonomous Vehicles: Who codes the utilitarian sacrifice?', 'cat-4', 'HARD'),
('phil-h-4', 'Is suffering an essential prerequisite for deep creative and intellectual achievement?', 'cat-4', 'HARD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty;

-- =======================================================
-- 5. CREATIVE WRITING TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty) VALUES
-- EASY
('wri-e-1', 'Favorite Character', 'cat-5', 'EASY'),
('wri-e-2', 'Story Hook', 'cat-5', 'EASY'),
('wri-e-3', 'Setting the Scene', 'cat-5', 'EASY'),
('wri-e-4', 'Poetic Imagery', 'cat-5', 'EASY'),
('wri-e-5', 'Hero Journey', 'cat-5', 'EASY'),
-- MEDIUM
('wri-m-1', 'Crafting Unforgettable Fictional Protagonists with Fatal Flaws', 'cat-5', 'MEDIUM'),
('wri-m-2', 'Building Immersive Sci-Fi and Fantasy Worlds', 'cat-5', 'MEDIUM'),
('wri-m-3', 'Mastering Subtext and Tension in Dramatic Dialogue', 'cat-5', 'MEDIUM'),
('wri-m-4', 'Show Don''t Tell: Sensory Grounding & Pacing Mechanics', 'cat-5', 'MEDIUM'),
('wri-m-5', 'Nonlinear Storytelling and Thematic Foreshadowing', 'cat-5', 'MEDIUM'),
-- HARD
('wri-h-1', 'Can artificial intelligence ever produce genuine emotional subtext in literature?', 'cat-5', 'HARD'),
('wri-h-2', 'The Anti-Hero Dilemma: Crafting reprehensible characters audiences root for', 'cat-5', 'HARD'),
('wri-h-3', 'Tragedy vs Catharsis: Why bittersweet storytelling resonates deeper than happy endings', 'cat-5', 'HARD'),
('wri-h-4', 'Deconstructing the Monomyth: Why classical narrative arcs fail modern complex themes', 'cat-5', 'HARD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty;

-- =======================================================
-- 6. DAILY LIFE & SOCIETY TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty) VALUES
-- EASY
('life-e-1', 'Travel Packing Hacks', 'cat-6', 'EASY'),
('life-e-2', 'Cooking at Home', 'cat-6', 'EASY'),
('life-e-3', 'Coffee Culture', 'cat-6', 'EASY'),
('life-e-4', 'Weekend Hobbies', 'cat-6', 'EASY'),
('life-e-5', 'Public Speaking Practice', 'cat-6', 'EASY'),
-- MEDIUM
('life-m-1', 'Atomic Habits & Behavioral Cue Engineering', 'cat-6', 'MEDIUM'),
('life-m-2', 'Digital Minimalism & Reclaiming Deep Attention Spans', 'cat-6', 'MEDIUM'),
('life-m-3', 'The Art of Active Listening in High-Conflict Conversations', 'cat-6', 'MEDIUM'),
('life-m-4', 'Overcoming Imposter Syndrome in High-Growth Environments', 'cat-6', 'MEDIUM'),
('life-m-5', 'Financial Independence (FIRE) Dynamics and Lifestyle Design', 'cat-6', 'MEDIUM'),
-- HARD
('life-h-1', 'Should algorithmic social media feeds be strictly regulated for mental health?', 'cat-6', 'HARD'),
('life-h-2', 'The Loneliness Epidemic: How hyper-connectivity fractured physical community bonds', 'cat-6', 'HARD'),
('life-h-3', 'The Future of Education: Are traditional university degrees obsolete for gen-z?', 'cat-6', 'HARD'),
('life-h-4', 'Hustle Culture vs Slow Living: Redefining ambition in an automated world', 'cat-6', 'HARD')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty;
