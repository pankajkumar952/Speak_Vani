package com.speakvaani.service;

import com.speakvaani.entity.Category;
import com.speakvaani.entity.Topic;
import com.speakvaani.entity.Topic.Audience;
import com.speakvaani.entity.Topic.TopicDifficulty;
import com.speakvaani.entity.Topic.TopicType;
import com.speakvaani.repository.CategoryRepository;
import com.speakvaani.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final TopicRepository topicRepository;

    @Override
    public void run(String... args) {
        log.info("Initializing/verifying category and topic seeds (General + Kids Mode)...");

        // 1. General Categories
        Category cat1 = getOrCreateCategory("cat-1", "Technology", "Artificial intelligence, software architecture, cloud, cyber, and digital innovation.");
        Category cat2 = getOrCreateCategory("cat-2", "Fitness", "Workouts, physical conditioning, sports nutrition, recovery, and active wellness.");
        Category cat3 = getOrCreateCategory("cat-3", "Business & Leadership", "Startups, venture capital, executive strategy, product growth, and negotiations.");
        Category cat4 = getOrCreateCategory("cat-4", "Philosophy & Mindset", "Stoicism, cognitive models, ethics, decision making, and human consciousness.");
        Category cat5 = getOrCreateCategory("cat-5", "Creative Writing", "Narrative design, storytelling, character arcs, subtext, and world building.");
        Category cat6 = getOrCreateCategory("cat-6", "Daily Life & Society", "Communication habits, mindfulness, digital culture, relationships, and modern living.");

        // 2. Kids Categories
        Category catKAni = getOrCreateCategory("cat-k-animals", "Animals", "Furry friends, ocean creatures, wild beasts, and dream pets.");
        Category catKSpc = getOrCreateCategory("cat-k-space", "Space", "Rockets, alien planets, stars, black holes, and the moon.");
        Category catKCre = getOrCreateCategory("cat-k-creativity", "Creativity", "Drawing, imaginative worlds, painting, building, and crafts.");
        Category catKSch = getOrCreateCategory("cat-k-school", "School", "Classes, friends, favorite teachers, recess, and learning adventures.");
        Category catKSpo = getOrCreateCategory("cat-k-sports", "Sports", "Soccer, basketball, swimming, cycling, and fun playground games.");
        Category catKNat = getOrCreateCategory("cat-k-nature", "Nature", "Forests, oceans, weather, mountains, and the great outdoors.");
        Category catKIma = getOrCreateCategory("cat-k-imagination", "Imagination", "Superpowers, time travel, magical creatures, and secret portals.");
        Category catKFoo = getOrCreateCategory("cat-k-food", "Food", "Pizza, ice cream, cooking experiments, and favorite treats.");
        Category catKGam = getOrCreateCategory("cat-k-games", "Games", "Video games, board games, playground tag, and puzzle challenges.");
        Category catKSci = getOrCreateCategory("cat-k-science", "Science", "Cool experiments, robots, inventions, and amazing discoveries.");
        Category catKWld = getOrCreateCategory("cat-k-world", "World", "Different countries, languages, cultures, and global journeys.");
        Category catKEvr = getOrCreateCategory("cat-k-everyday", "Everyday Life", "Family time, funny moments, morning routines, and holidays.");

        // Check if full topics matrix seeded
        if (topicRepository.count() < 60) {
            log.info("Seeding comprehensive matrix of topics (General + Kids 5-7, 8-10, 11-13)...");

            List<Topic> topics = new ArrayList<>();

            // ================= GENERAL TOPICS =================
            // Technology
            topics.add(Topic.builder().id("tech-e-1").name("Java").category(cat1).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("tech-e-2").name("Python").category(cat1).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("tech-e-3").name("React").category(cat1).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("tech-e-4").name("Docker").category(cat1).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("tech-m-1").name("Neural Networks & Deep Learning").category(cat1).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("tech-m-2").name("Kubernetes & Container Orchestration").category(cat1).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("tech-h-1").name("Will AI replace software engineers or amplify engineering throughput?").category(cat1).difficulty(TopicDifficulty.HARD).audience(Audience.GENERAL).topicType(TopicType.CREATIVE_PROMPT).build());

            // Fitness
            topics.add(Topic.builder().id("fit-e-1").name("Back Workout").category(cat2).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("fit-e-2").name("Cardio Fundamentals").category(cat2).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("fit-m-1").name("Zone 2 Cardiovascular Training Mechanics").category(cat2).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("fit-m-2").name("Sleep Architecture and Hormonal Muscle Synthesis").category(cat2).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("fit-h-1").name("Is extreme cardiovascular endurance training detrimental to long-term joint health?").category(cat2).difficulty(TopicDifficulty.HARD).audience(Audience.GENERAL).topicType(TopicType.CREATIVE_PROMPT).build());

            // Business & Leadership
            topics.add(Topic.builder().id("biz-e-1").name("Elevator Pitch").category(cat3).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("biz-e-2").name("Customer Feedback").category(cat3).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("biz-m-1").name("Product-Led Growth vs Sales-Led Go-To-Market").category(cat3).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("biz-h-1").name("Monopoly vs Competition: Why zero-to-one startups must capture niche moats").category(cat3).difficulty(TopicDifficulty.HARD).audience(Audience.GENERAL).topicType(TopicType.CREATIVE_PROMPT).build());

            // Philosophy & Mindset
            topics.add(Topic.builder().id("phil-e-1").name("Gratitude").category(cat4).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("phil-m-1").name("Stoicism: The Dichotomy of Control in Modern Chaos").category(cat4).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("phil-h-1").name("Can true stoic equanimity exist within modern high-velocity consumer capitalism?").category(cat4).difficulty(TopicDifficulty.HARD).audience(Audience.GENERAL).topicType(TopicType.CREATIVE_PROMPT).build());

            // Creative Writing
            topics.add(Topic.builder().id("wri-e-1").name("Story Hook").category(cat5).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("wri-m-1").name("Crafting Unforgettable Fictional Protagonists with Fatal Flaws").category(cat5).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("wri-h-1").name("Can artificial intelligence ever produce genuine emotional subtext in literature?").category(cat5).difficulty(TopicDifficulty.HARD).audience(Audience.GENERAL).topicType(TopicType.CREATIVE_PROMPT).build());

            // Daily Life & Society
            topics.add(Topic.builder().id("life-e-1").name("Travel Packing Hacks").category(cat6).difficulty(TopicDifficulty.EASY).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("life-m-1").name("Digital Minimalism & Reclaiming Deep Attention Spans").category(cat6).difficulty(TopicDifficulty.MEDIUM).audience(Audience.GENERAL).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("life-h-1").name("The Future of Education: Are traditional university degrees obsolete for gen-z?").category(cat6).difficulty(TopicDifficulty.HARD).audience(Audience.GENERAL).topicType(TopicType.CREATIVE_PROMPT).build());

            // ================= KIDS 5-7 =================
            topics.add(Topic.builder().id("k57-ani-1").name("My Favorite Animal").category(catKAni).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-ani-2").name("My Dream Pet").category(catKAni).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-ani-3").name("If I could talk to animals...").category(catKAni).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k57-ani-4").name("What animals do at night").category(catKAni).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-ani-5").name("You have to convince your parents why you should adopt a pet puppy.").category(catKAni).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k57-ani-6").name("You found a baby penguin in your freezer! What do you do?").category(catKAni).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k57-spc-1").name("The Moon").category(catKSpc).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-spc-2").name("My Rocket Ship").category(catKSpc).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-spc-3").name("If I lived on Mars...").category(catKSpc).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k57-spc-5").name("Would you rather explore the deepest ocean or fly to outer space?").category(catKSpc).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k57-ima-1").name("If I Could Fly").category(catKIma).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-ima-2").name("My Superpower").category(catKIma).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-ima-4").name("Becoming Giant or Tiny").category(catKIma).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k57-ima-5").name("If you had one wish that could help the whole world, what would it be?").category(catKIma).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k57-ima-6").name("You discovered a secret wooden door leading to Cloud Kingdom!").category(catKIma).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k57-evr-1").name("My Favorite Food").category(catKFoo).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-evr-5").name("My Family").category(catKEvr).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-evr-6").name("My Favorite Toy").category(catKEvr).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k57-evr-7").name("A Rainy Day").category(catKEvr).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_5_7).topicType(TopicType.SIMPLE_TOPIC).build());

            // ================= KIDS 8-10 =================
            topics.add(Topic.builder().id("k810-ani-1").name("Ocean Animals").category(catKAni).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-ani-2").name("How I Would Help Animals").category(catKAni).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-ani-3").name("Endangered Species Protection").category(catKAni).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-ani-5").name("Should wild animals live in zoos, or only in natural wildlife parks?").category(catKAni).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k810-ani-6").name("You discovered a magical collar that translates dog and cat thoughts!").category(catKAni).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k810-spc-1").name("Space Travel").category(catKSpc).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-spc-2").name("A Trip to the Moon").category(catKSpc).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-spc-3").name("Why should humans explore space?").category(catKSpc).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k810-spc-5").name("Should humans spend billions exploring Mars or fixing Earth first?").category(catKSpc).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k810-sci-1").name("My Favorite Invention").category(catKSci).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-sci-2").name("Robots in the Future").category(catKSci).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-sci-4").name("What is an invention that the world desperately needs right now?").category(catKSci).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k810-sci-5").name("Your science fair volcano experiment opened a portal to ancient Egypt!").category(catKSci).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k810-nat-1").name("Why Trees Are Important").category(catKNat).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-nat-3").name("How can kids in our school reduce plastic waste every week?").category(catKNat).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k810-ima-1").name("If I Could Become Invisible").category(catKIma).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-ima-2").name("My Dream House").category(catKIma).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k810-ima-3").name("A World Without Phones").category(catKIma).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k810-ima-5").name("You found a pocket watch that rewinds time by exactly 5 minutes.").category(catKIma).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_8_10).topicType(TopicType.CREATIVE_PROMPT).build());

            // ================= KIDS 11-13 =================
            topics.add(Topic.builder().id("k1113-sci-1").name("Artificial Intelligence").category(catKSci).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-sci-2").name("Future of Technology").category(catKSci).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-sci-3").name("Should Kids Have Smartphones?").category(catKSci).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k1113-sci-5").name("Will AI tools make students smarter or less capable of deep thinking?").category(catKSci).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k1113-sci-6").name("An AI assistant on your laptop gained real feelings and asked for your advice.").category(catKSci).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k1113-wld-1").name("Climate Change").category(catKWld).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-wld-2").name("Future of Education").category(catKWld).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-wld-3").name("Social Media: Fun vs Mental Well-being").category(catKWld).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-wld-4").name("Should Homework Be Reduced?").category(catKSch).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k1113-wld-5").name("Should school grades be replaced with creative portfolio projects?").category(catKSch).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k1113-wld-6").name("You woke up in a clean solarpunk city in the year 2150 with electric gliders.").category(catKWld).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());

            topics.add(Topic.builder().id("k1113-evr-1").name("My Dream Career").category(catKEvr).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-evr-2").name("Online Learning vs In-Person School").category(catKEvr).difficulty(TopicDifficulty.EASY).audience(Audience.KIDS_11_13).topicType(TopicType.SIMPLE_TOPIC).build());
            topics.add(Topic.builder().id("k1113-evr-3").name("Is Video Gaming Good or Bad?").category(catKGam).difficulty(TopicDifficulty.MEDIUM).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());
            topics.add(Topic.builder().id("k1113-evr-5").name("Is true leadership about being in charge, or helping others succeed?").category(catKEvr).difficulty(TopicDifficulty.HARD).audience(Audience.KIDS_11_13).topicType(TopicType.CREATIVE_PROMPT).build());

            topicRepository.saveAll(topics);
            log.info("Full matrix of topics seeded successfully ({} topics).", topics.size());
        }
    }

    private Category getOrCreateCategory(String id, String name, String description) {
        return categoryRepository.findById(id).orElseGet(() ->
            categoryRepository.save(Category.builder().id(id).name(name).description(description).build())
        );
    }
}
