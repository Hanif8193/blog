import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  image: text("image"),
  published: boolean("published").default(false).notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Anonymous like — one fingerprint cookie = one "user"
export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    blogId: uuid("blog_id")
      .references(() => blogs.id, { onDelete: "cascade" })
      .notNull(),
    fingerprint: text("fingerprint").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueLike: unique().on(t.blogId, t.fingerprint),
  })
);

// ── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [blogs.categoryId],
    references: [categories.id],
  }),
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  blog: one(blogs, {
    fields: [likes.blogId],
    references: [blogs.id],
  }),
}));
