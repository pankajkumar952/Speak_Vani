-- Migration V5: Add Audience & TopicType to Topics & PracticeSessions, Seed Complete Kids Mode Matrix

ALTER TABLE topics ADD COLUMN IF NOT EXISTS audience VARCHAR(20) NOT NULL DEFAULT 'GENERAL';
ALTER TABLE topics ADD COLUMN IF NOT EXISTS topic_type VARCHAR(30) NOT NULL DEFAULT 'SIMPLE_TOPIC';
ALTER TABLE practice_sessions ADD COLUMN IF NOT EXISTS audience VARCHAR(20) DEFAULT 'GENERAL';

-- Seed Kid-Friendly Categories
INSERT INTO categories (id, name, description) VALUES
('cat-k-animals', 'Animals', 'Furry friends, ocean creatures, wild beasts, and dream pets.'),
('cat-k-space', 'Space', 'Rockets, alien planets, stars, black holes, and the moon.'),
('cat-k-creativity', 'Creativity', 'Drawing, imaginative worlds, painting, building, and crafts.'),
('cat-k-school', 'School', 'Classes, friends, favorite teachers, recess, and learning adventures.'),
('cat-k-sports', 'Sports', 'Soccer, basketball, swimming, cycling, and fun playground games.'),
('cat-k-nature', 'Nature', 'Forests, oceans, weather, mountains, and the great outdoors.'),
('cat-k-imagination', 'Imagination', 'Superpowers, time travel, magical creatures, and secret portals.'),
('cat-k-food', 'Food', 'Pizza, ice cream, cooking experiments, and favorite treats.'),
('cat-k-games', 'Games', 'Video games, board games, playground tag, and puzzle challenges.'),
('cat-k-science', 'Science', 'Cool experiments, robots, inventions, and amazing discoveries.'),
('cat-k-world', 'World', 'Different countries, languages, cultures, and global journeys.'),
('cat-k-everyday', 'Everyday Life', 'Family time, funny moments, morning routines, and holidays.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- =======================================================
-- KIDS AGE 5-7 TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty, audience, topic_type) VALUES
-- Animals
('k57-ani-1', 'My Favorite Animal', 'cat-k-animals', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-ani-2', 'My Dream Pet', 'cat-k-animals', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-ani-3', 'If I could talk to animals...', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-ani-4', 'What animals do at night', 'cat-k-animals', 'MEDIUM', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-ani-5', 'You have to convince your parents why you should adopt a pet puppy.', 'cat-k-animals', 'HARD', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-ani-6', 'You found a baby penguin in your freezer! What do you do?', 'cat-k-animals', 'EASY', 'KIDS_5_7', 'CREATIVE_PROMPT'),

-- Space
('k57-spc-1', 'The Moon', 'cat-k-space', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-spc-2', 'My Rocket Ship', 'cat-k-space', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-spc-3', 'If I lived on Mars...', 'cat-k-space', 'MEDIUM', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-spc-4', 'Looking at the Stars', 'cat-k-space', 'MEDIUM', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-spc-5', 'Would you rather explore the deepest ocean or fly to outer space?', 'cat-k-space', 'HARD', 'KIDS_5_7', 'CREATIVE_PROMPT'),

-- Creativity & Imagination
('k57-ima-1', 'If I Could Fly', 'cat-k-imagination', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-ima-2', 'My Superpower', 'cat-k-imagination', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-ima-3', 'The Magic Treehouse', 'cat-k-imagination', 'MEDIUM', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-ima-4', 'Becoming Giant or Tiny', 'cat-k-imagination', 'MEDIUM', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-ima-5', 'If you had one wish that could help the whole world, what would it be?', 'cat-k-imagination', 'HARD', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-ima-6', 'You discovered a secret wooden door in your room leading to Cloud Kingdom!', 'cat-k-imagination', 'EASY', 'KIDS_5_7', 'CREATIVE_PROMPT'),

-- Food & Everyday Life
('k57-evr-1', 'My Favorite Food', 'cat-k-food', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-evr-2', 'Ice Cream Flavors', 'cat-k-food', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-evr-3', 'Inventing a New Snack', 'cat-k-food', 'MEDIUM', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-evr-4', 'Why is it important to eat vegetables even when we want cake?', 'cat-k-food', 'HARD', 'KIDS_5_7', 'CREATIVE_PROMPT'),
('k57-evr-5', 'My Family', 'cat-k-everyday', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-evr-6', 'My Favorite Toy', 'cat-k-everyday', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-evr-7', 'A Rainy Day', 'cat-k-everyday', 'EASY', 'KIDS_5_7', 'SIMPLE_TOPIC'),
('k57-evr-8', 'What is the best way to cheer up a friend who is feeling sad?', 'cat-k-everyday', 'HARD', 'KIDS_5_7', 'CREATIVE_PROMPT')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty, audience = EXCLUDED.audience, topic_type = EXCLUDED.topic_type;

-- =======================================================
-- KIDS AGE 8-10 TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty, audience, topic_type) VALUES
-- Animals & Nature
('k810-ani-1', 'Ocean Animals', 'cat-k-animals', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-ani-2', 'How I Would Help Animals', 'cat-k-animals', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-ani-3', 'Endangered Species Protection', 'cat-k-animals', 'MEDIUM', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-ani-4', 'Animal Camouflage Tricks', 'cat-k-animals', 'MEDIUM', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-ani-5', 'Should wild animals live in zoos, or only in natural wildlife parks?', 'cat-k-animals', 'HARD', 'KIDS_8_10', 'CREATIVE_PROMPT'),
('k810-ani-6', 'You discovered a magical collar that translates dog and cat thoughts!', 'cat-k-animals', 'EASY', 'KIDS_8_10', 'CREATIVE_PROMPT'),

-- Space & Science
('k810-spc-1', 'Space Travel', 'cat-k-space', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-spc-2', 'A Trip to the Moon', 'cat-k-space', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-spc-3', 'Why should humans explore space?', 'cat-k-space', 'MEDIUM', 'KIDS_8_10', 'CREATIVE_PROMPT'),
('k810-spc-4', 'The Mystery of Black Holes', 'cat-k-space', 'MEDIUM', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-spc-5', 'Should humans spend billions exploring Mars or fixing Earth first?', 'cat-k-space', 'HARD', 'KIDS_8_10', 'CREATIVE_PROMPT'),

('k810-sci-1', 'My Favorite Invention', 'cat-k-science', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-sci-2', 'Robots in the Future', 'cat-k-science', 'MEDIUM', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-sci-3', 'How Solar Energy Works', 'cat-k-science', 'MEDIUM', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-sci-4', 'What is an invention that the world desperately needs right now?', 'cat-k-science', 'HARD', 'KIDS_8_10', 'CREATIVE_PROMPT'),
('k810-sci-5', 'Your science fair volcano experiment opened a portal to ancient Egypt!', 'cat-k-science', 'MEDIUM', 'KIDS_8_10', 'CREATIVE_PROMPT'),

-- Nature & Imagination
('k810-nat-1', 'Why Trees Are Important', 'cat-k-nature', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-nat-2', 'Protecting Our Coral Reefs', 'cat-k-nature', 'MEDIUM', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-nat-3', 'How can kids in our school reduce plastic waste every week?', 'cat-k-nature', 'HARD', 'KIDS_8_10', 'CREATIVE_PROMPT'),
('k810-ima-1', 'If I Could Become Invisible', 'cat-k-imagination', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-ima-2', 'My Dream House', 'cat-k-imagination', 'EASY', 'KIDS_8_10', 'SIMPLE_TOPIC'),
('k810-ima-3', 'A World Without Phones', 'cat-k-imagination', 'MEDIUM', 'KIDS_8_10', 'CREATIVE_PROMPT'),
('k810-ima-4', 'If you could freeze time for 1 hour every day, how would you use it?', 'cat-k-imagination', 'HARD', 'KIDS_8_10', 'CREATIVE_PROMPT'),
('k810-ima-5', 'You found a pocket watch that rewinds time by exactly 5 minutes.', 'cat-k-imagination', 'EASY', 'KIDS_8_10', 'CREATIVE_PROMPT')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty, audience = EXCLUDED.audience, topic_type = EXCLUDED.topic_type;

-- =======================================================
-- KIDS AGE 11-13 TOPICS
-- =======================================================
INSERT INTO topics (id, name, category_id, difficulty, audience, topic_type) VALUES
-- Science & Tech
('k1113-sci-1', 'Artificial Intelligence', 'cat-k-science', 'EASY', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-sci-2', 'Future of Technology', 'cat-k-science', 'EASY', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-sci-3', 'Should Kids Have Smartphones?', 'cat-k-science', 'MEDIUM', 'KIDS_11_13', 'CREATIVE_PROMPT'),
('k1113-sci-4', 'Cyberbullying and Online Kindness', 'cat-k-science', 'MEDIUM', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-sci-5', 'Will AI tools make students smarter or less capable of deep thinking?', 'cat-k-science', 'HARD', 'KIDS_11_13', 'CREATIVE_PROMPT'),
('k1113-sci-6', 'An AI assistant on your laptop gained real feelings and asked for your advice.', 'cat-k-science', 'MEDIUM', 'KIDS_11_13', 'CREATIVE_PROMPT'),

-- World, School & Society
('k1113-wld-1', 'Climate Change', 'cat-k-world', 'EASY', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-wld-2', 'Future of Education', 'cat-k-world', 'EASY', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-wld-3', 'Social Media: Fun vs Mental Well-being', 'cat-k-world', 'MEDIUM', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-wld-4', 'Should Homework Be Reduced?', 'cat-k-school', 'MEDIUM', 'KIDS_11_13', 'CREATIVE_PROMPT'),
('k1113-wld-5', 'Should school grades be replaced with creative portfolio projects?', 'cat-k-school', 'HARD', 'KIDS_11_13', 'CREATIVE_PROMPT'),
('k1113-wld-6', 'You woke up in a clean solarpunk city in the year 2150 with electric gliders.', 'cat-k-world', 'EASY', 'KIDS_11_13', 'CREATIVE_PROMPT'),

-- Life & Career
('k1113-evr-1', 'My Dream Career', 'cat-k-everyday', 'EASY', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-evr-2', 'Online Learning vs In-Person School', 'cat-k-everyday', 'EASY', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-evr-3', 'Is Video Gaming Good or Bad?', 'cat-k-games', 'MEDIUM', 'KIDS_11_13', 'CREATIVE_PROMPT'),
('k1113-evr-4', 'How to handle peer pressure without losing your identity', 'cat-k-everyday', 'MEDIUM', 'KIDS_11_13', 'SIMPLE_TOPIC'),
('k1113-evr-5', 'Is true leadership about being in charge, or helping others succeed?', 'cat-k-everyday', 'HARD', 'KIDS_11_13', 'CREATIVE_PROMPT')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, difficulty = EXCLUDED.difficulty, audience = EXCLUDED.audience, topic_type = EXCLUDED.topic_type;
