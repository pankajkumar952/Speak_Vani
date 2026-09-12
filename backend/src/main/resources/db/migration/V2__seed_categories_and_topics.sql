-- Migration V2: Seed Categories & Scalable Topics

INSERT INTO categories (id, name, description) VALUES
('cat-1', 'Technology', 'Artificial intelligence, software architecture, space tech, and future digital innovations.'),
('cat-2', 'Business & Leadership', 'Entrepreneurship, strategy, marketing, startups, and executive leadership.'),
('cat-3', 'Creative Writing', 'Storytelling, narrative arcs, character design, world building, and poetic imagery.'),
('cat-4', 'Philosophy & Mindset', 'Ethics, stoicism, decision making, cognitive bias, and human consciousness.'),
('cat-5', 'Daily Life & Society', 'Communication, habits, travel, wellness, and modern social culture.')
ON CONFLICT (id) DO NOTHING;

-- Technology Topics
INSERT INTO topics (id, name, category_id) VALUES
('top-101', 'Neural Networks & Deep Learning', 'cat-1'),
('top-102', 'Quantum Computing Principles', 'cat-1'),
('top-103', 'Blockchain & Decentralized Trust', 'cat-1'),
('top-104', 'Cloud Native Microservices Architecture', 'cat-1'),
('top-105', 'Ethical AI & Algorithmic Bias', 'cat-1'),
('top-106', 'Autonomous Robotics & Vision', 'cat-1'),
('top-107', 'Cybersecurity & Zero Trust Architecture', 'cat-1')
ON CONFLICT (id) DO NOTHING;

-- Business Topics
INSERT INTO topics (id, name, category_id) VALUES
('top-201', 'Pitching a High-Growth Tech Startup', 'cat-2'),
('top-202', 'Building High-Performance Remote Teams', 'cat-2'),
('top-203', 'Product-Led Growth Strategies', 'cat-2'),
('top-204', 'Navigating Market Disruptions & Change', 'cat-2'),
('top-205', 'Negotiation Principles & Value Creation', 'cat-2')
ON CONFLICT (id) DO NOTHING;

-- Creative Writing Topics
INSERT INTO topics (id, name, category_id) VALUES
('top-301', 'Crafting Unforgettable Fictional Protagonists', 'cat-3'),
('top-302', 'Building Immersive Sci-Fi Worlds', 'cat-3'),
('top-303', 'Mastering Subtext in Dramatic Dialogue', 'cat-3'),
('top-304', 'The Power of Visual Metaphors', 'cat-3')
ON CONFLICT (id) DO NOTHING;

-- Philosophy Topics
INSERT INTO topics (id, name, category_id) VALUES
('top-401', 'Stoicism & Emotional Resilience in Chaos', 'cat-4'),
('top-402', 'The Paradox of Choice in Modern Life', 'cat-4'),
('top-403', 'Epistemology: How Do We Truly Know Truth?', 'cat-4'),
('top-404', 'First Principles Thinking vs Analogy', 'cat-4')
ON CONFLICT (id) DO NOTHING;

-- Daily Life Topics
INSERT INTO topics (id, name, category_id) VALUES
('top-501', 'Atomic Habits & Behavioural Design', 'cat-5'),
('top-502', 'Art of Active Listening & Empathy', 'cat-5'),
('top-503', 'Digital Minimalism & Attention Spans', 'cat-5'),
('top-504', 'Overcoming Imposter Syndrome', 'cat-5')
ON CONFLICT (id) DO NOTHING;
