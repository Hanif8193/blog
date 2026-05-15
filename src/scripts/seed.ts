import "dotenv/config";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../lib/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(client, { schema });

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

async function upsertCategory(name: string, slug: string) {
  const existing = await db.query.categories.findFirst({
    where: eq(schema.categories.slug, slug),
  });
  if (existing) return existing;
  const [row] = await db
    .insert(schema.categories)
    .values({ name, slug })
    .returning();
  return row;
}

async function blogExists(slug: string) {
  return db.query.blogs.findFirst({ where: eq(schema.blogs.slug, slug) });
}

// ---------------------------------------------------------------------------
// seed
// ---------------------------------------------------------------------------

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // -------------------------------------------------------------------------
    // Admin user (always re-created so password is fresh)
    // -------------------------------------------------------------------------
    await db.delete(schema.users).where(eq(schema.users.email, "admin@blog.com"));

    const [user] = await db
      .insert(schema.users)
      .values({
        name: "Admin",
        email: "admin@blog.com",
        password: await bcrypt.hash("123456", 10),
        role: "admin",
      })
      .returning();

    // -------------------------------------------------------------------------
    // Categories
    // -------------------------------------------------------------------------
    const tech     = await upsertCategory("Technology", "technology");
    const travel   = await upsertCategory("Travel",     "travel");
    const food     = await upsertCategory("Food",       "food");
    const design   = await upsertCategory("Design",     "design");

    // -------------------------------------------------------------------------
    // Blogs
    // -------------------------------------------------------------------------
    const posts = [
      // ── Technology ──────────────────────────────────────────────────────────
      {
        title:      "The Future of AI: How Large Language Models Are Reshaping Software Development",
        slug:       "future-of-ai-llms-reshaping-software-development",
        excerpt:    "From autocomplete to autonomous agents — explore how LLMs are fundamentally changing the way engineers write, debug, and ship code.",
        image:      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80",
        categoryId: tech.id,
        content: `Artificial intelligence has moved from academic curiosity to production infrastructure faster than almost anyone predicted. In just a few years, large language models went from generating novelty poetry to writing production-grade code, explaining complex bugs, and orchestrating multi-step tasks across APIs.

For software engineers, the shift is palpable. Tools like GitHub Copilot, Cursor, and Claude Code now sit inside the editor, offering suggestions before fingers lift from the keyboard. But the change runs deeper than autocomplete. Teams are redesigning entire development workflows: spinning up AI agents to handle boilerplate, running automated code reviews, and letting models draft unit tests from function signatures.

What makes LLMs transformative — rather than just convenient — is their ability to reason over context. They do not simply complete a line; they read the surrounding file, understand intent, and adapt suggestions accordingly. This contextual awareness makes them genuinely useful for greenfield features and gnarly legacy refactors alike.

The risk, of course, is complacency. Developers who treat model output as authoritative without review introduce subtle logic errors and security gaps that are harder to spot precisely because the surrounding code looks professional. The engineers getting the most out of AI tools are those who treat the model as a fast junior pair-programmer: highly capable, but requiring mentorship and verification.

Looking ahead, the trajectory points toward autonomous coding agents that can file pull requests, run tests, interpret CI failures, and iterate — all with a single high-level prompt. Whether that raises or lowers the ceiling for human engineers depends entirely on how the profession responds. The tools are neutral; the craft is not.`,
        published:  true,
      },
      {
        title:      "TypeScript 5.5 Deep Dive: Inferred Type Predicates and What They Mean for You",
        slug:       "typescript-55-inferred-type-predicates",
        excerpt:    "TypeScript 5.5 quietly shipped one of the most requested features in years. Here is what inferred type predicates are, why they matter, and where to use them.",
        image:      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
        categoryId: tech.id,
        content: `Every major TypeScript release ships a handful of features that make type-safe code feel a little less ceremonial. TypeScript 5.5 is no exception, and the headline addition — inferred type predicates — is one that will quietly clean up hundreds of real-world patterns across existing codebases.

A type predicate is a return-type annotation of the form \`value is SomeType\`. It tells the compiler that, if a function returns \`true\`, the argument can be narrowed to the specified type. Before 5.5, writing a predicate required an explicit annotation even when the implementation made the narrowing obvious. The compiler would not figure it out on its own.

With inferred type predicates, TypeScript analyses the function body. If the logic is consistent — for example, returning a boolean that depends entirely on checking whether a value is not null and satisfies some shape — the compiler infers the predicate automatically. This eliminates a whole class of boilerplate \`is\` functions that existed purely to satisfy the type system.

The practical impact shows up most clearly in \`Array.filter\` chains. Previously, filtering out \`null | undefined\` values from an array required a hand-written predicate helper to convince TypeScript the resulting type was \`T[]\` rather than \`(T | null)[]\`. With 5.5, the compiler understands a simple arrow-function filter without the helper.

Beyond ergonomics, the change signals a broader compiler philosophy: TypeScript should understand what you already wrote, not demand that you annotate what is already evident. That is a philosophy worth celebrating.`,
        published:  true,
      },

      // ── Travel ──────────────────────────────────────────────────────────────
      {
        title:      "37 Hours in Kyoto: A Minimalist Itinerary for the Distracted Traveller",
        slug:       "37-hours-in-kyoto-minimalist-itinerary",
        excerpt:    "Skip the bucket-list chaos. This compact guide hits the temples, the market, and the right izakaya — and still leaves room to get genuinely lost.",
        image:      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80",
        categoryId: travel.id,
        content: `Kyoto does not reward aggression. The travellers who arrive with laminated schedules and a goal of ticking seventeen shrines before lunch return home exhausted and somehow having seen nothing. The city belongs to those willing to slow down, follow a side street because it looks interesting, and eat dinner at the counter of a place with four seats and no English menu.

Arrive in the early evening on day one. Drop your bags, walk to Pontocho Alley, and eat yakitori standing at a narrow counter. Order the chicken skin. Drink cold Sapporo. The crowds will thin by nine and the lantern-lit alley becomes briefly, genuinely beautiful.

Morning of day two: Fushimi Inari before eight o'clock. The photographs online always lie — they show empty vermilion gates, but the reality between ten and four is a slow shuffle of tour groups. Before eight it is mostly locals doing their morning walk and serious hikers heading for the summit trail. Go at least halfway up. The city appears in gaps between the trees and it is worth every stair.

Afternoon: Nishiki Market for lunch and provocation. Eat skewered octopus, fresh tofu scooped from a barrel, pickled plum so sour it makes your ears ring. Buy nothing you cannot eat before boarding the train home.

Evening: Gion. Walk slowly. Do not chase geiko. Sit at a tea house, order matcha and wagashi, and let the neighbourhood perform itself at its own pace. That is the itinerary. Everything else is extra.`,
        published:  true,
      },

      // ── Food ────────────────────────────────────────────────────────────────
      {
        title:      "The Science of the Perfect Sourdough Crust: Fermentation, Steam, and Timing",
        slug:       "science-perfect-sourdough-crust",
        excerpt:    "Behind every shatteringly crisp sourdough crust is a chain of precise chemical reactions. Understanding them turns bread baking from guesswork into craft.",
        image:      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1600&q=80",
        categoryId: food.id,
        content: `The first time a loaf comes out of the oven with a crust that shatters audibly when you tap it, something shifts. You stop thinking of bread as a recipe and start thinking of it as a system — one governed by fermentation chemistry, heat transfer, and the behaviour of steam.

Sourdough's signature crust forms through two overlapping processes. The first is caramelisation and the Maillard reaction: as the surface temperature climbs past 150°C, sugars and amino acids react to create the hundreds of flavour compounds responsible for that roasted, complex aroma. The second is structural: gelatinised starches near the surface dehydrate and harden into the glassy shell that cracks when you cut it.

Steam is the critical variable most home bakers underestimate. In a professional deck oven, injected steam keeps the surface of the dough extensible during the first ten to fifteen minutes of baking, allowing maximum oven spring before the crust sets. Without that moisture, the surface firms too quickly, trapping gas and producing dense bread with a pale, leathery exterior. The Dutch oven method replicates this: the trapped steam from the dough itself creates the humid environment.

Fermentation time matters more than most recipes admit. An under-fermented dough produces a crust with no blisters and a bland interior. An over-fermented dough collapses, spreading rather than rising, and bakes into something flat and gummy. The window between the two is learned by observation — not by the clock.

Temperature, hydration, flour protein content, and starter activity all interact. Mastery comes from changing one variable at a time and noticing what changes in the result. The science does not replace intuition; it gives the intuition somewhere to land.`,
        published:  true,
      },
      {
        title:      "Street Food Capital: The 10 Dishes You Must Eat in Bangkok",
        slug:       "street-food-dishes-you-must-eat-in-bangkok",
        excerpt:    "Bangkok's sidewalks are one of the world's great culinary experiences. Here are the ten dishes that define the city — and exactly where to find them.",
        image:      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1600&q=80",
        categoryId: food.id,
        content: `Bangkok feeds you whether you intend to eat or not. The smell of galangal in hot oil, fish sauce hitting a wok, charcoal smoke from a rotating chicken — the city's street food is inescapable, and that is entirely the point.

Start with pad kra pao, the dish that Bangkokians eat for breakfast, lunch, and late-night recovery. Holy basil, ground pork, chilies, fish sauce, and a fried egg on top. Order it pet mak — extra spicy — and you will sweat through your shirt and immediately consider ordering a second plate.

Pad Thai as most foreigners know it is a mild, tourist-friendly version of the original. Find it at a cart that has been cooking since before you were born, with dried shrimp, preserved radish, and enough tamarind to make it properly sour. The difference is not subtle.

Khao man gai — poached chicken over rice cooked in chicken fat, served with a dark fermented soy dipping sauce — is the city's great lunchtime equilibrium. Soft, rich, and just complex enough to be interesting without demanding your full attention.

Tom yum goong from a street stall bears no relation to the watered-down version served in hotel restaurants. It should be searingly hot, aggressively sour from lime and lemongrass, and deeply fragrant with kaffir lime leaves. The prawns should be fresh. The broth should make you sit up straighter.

Mango sticky rice in season — April and May, when Nam Dok Mai mangoes are at their sweetest — is not dessert so much as an argument that simple things done perfectly require no elaboration. Everything else: roti, boat noodles, grilled corn with salted coconut cream, som tum with fermented crab. Eat until you cannot, then eat a little more.`,
        published:  true,
      },

      // ── Design ──────────────────────────────────────────────────────────────
      {
        title:      "White Space Is Not Empty Space: The Design Principle That Separates Amateur from Pro",
        slug:       "white-space-design-principle-amateur-vs-pro",
        excerpt:    "Every cluttered interface was once designed by someone who thought white space was wasted space. Here is why they were wrong — and how to see it differently.",
        image:      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80",
        categoryId: design.id,
        content: `New designers fill space. Experienced designers protect it.

The impulse to fill every pixel with content, colour, or decoration is understandable — emptiness feels like neglect, like something was forgotten. But white space is not the absence of design. It is an active design decision that determines how everything else is perceived. Compress it and the page feels anxious, heavy, crowded with things competing for attention. Protect it and the page breathes. Elements gain weight precisely because they are not fighting neighbours.

Typography demonstrates this most clearly. A headline given generous line-height and surrounding space feels authoritative. The same headline squeezed between elements feels like a label — something to be scanned and discarded rather than read. Nothing in the text changed. Only the space changed.

The principle extends to interactive design. Buttons need internal padding — not because the tap target requires it, but because a button without breathing room looks uncertain of itself. Cards with cramped content feel like they are hiding something. Navigation items pressed against each other create a visual anxiety that users register as friction even if they cannot articulate why.

Apple understood this before the language existed. The original Mac's interface felt revolutionary partly because it refused to put interface elements everywhere they could go. Every empty area was a deliberate choice to focus attention on what mattered.

The practical test: take any design you have built and increase all padding and margins by thirty percent. If it suddenly looks better, you were over-filling. If it looks worse, you were already treating space well. Most designs improve. The correction is almost never too much space — it is almost always too little.`,
        published:  true,
      },
    ];

    for (const post of posts) {
      if (await blogExists(post.slug)) {
        console.log(`  ⏭  skipping existing: ${post.slug}`);
        continue;
      }
      await db.insert(schema.blogs).values({ ...post, authorId: user.id });
      console.log(`  ✅  inserted: ${post.slug}`);
    }

    console.log("\n✅ Seed completed successfully!");
    console.log("📧 Email:    admin@blog.com");
    console.log("🔑 Password: 123456");
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
