import { Post, Profile, Comment } from "@/types/blog";

export const MOCK_PROFILES: Record<string, Profile> = {
  "usr-admin-01": {
    id: "usr-admin-01",
    email: "admin@eprovider.site",
    display_name: "Elena Rostova",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "admin",
    bio: "Principal Platform Architect & Eprovider Core Contributor. Writing on distributed systems, databases, and UX design.",
    created_at: "2025-01-10T08:00:00Z",
  },
  "usr-mod-02": {
    id: "usr-mod-02",
    email: "moderator@eprovider.site",
    display_name: "Marcus Vance",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "moderator",
    bio: "Community lead & Technical Editor. Ensuring thoughtful discourse, spam-free reviews, and quality engineering standards.",
    created_at: "2025-01-15T10:30:00Z",
  },
  "usr-author-03": {
    id: "usr-author-03",
    email: "sophia@journal.io",
    display_name: "Sophia Chen",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "author",
    bio: "Frontend engineer & UI designer. Passionate about micro-interactions, accessibility, and modern React performance.",
    created_at: "2025-02-01T14:00:00Z",
  },
  "usr-reader-04": {
    id: "usr-reader-04",
    email: "alex@reader.net",
    display_name: "Alex Rivera",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "author",
    bio: "Software craftsman, avid reader, exploring decentralized tech and real-time collaborative applications.",
    created_at: "2025-02-12T16:00:00Z",
  },
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-001",
    author_id: "usr-admin-01",
    author: MOCK_PROFILES["usr-admin-01"],
    title: "Building Real-Time Multi-Tenant Architectures on Eprovider",
    slug: "building-real-time-multi-tenant-architectures-on-eprovider",
    excerpt:
      "A comprehensive deep-dive into partitioning schemas, using row-level security with request_user_id(), and scaling edge functions seamlessly.",
    cover_image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    category: "Architecture",
    tags: ["Eprovider", "PostgreSQL", "RLS", "Edge Functions"],
    status: "published",
    published_at: "2025-02-20T12:00:00Z",
    claps_count: 142,
    read_time_minutes: 6,
    created_at: "2025-02-18T10:00:00Z",
    updated_at: "2025-02-20T12:00:00Z",
    content: [
      {
        id: "b1",
        type: "paragraph",
        text: "Building modern high-velocity applications requires decoupling your authentication layer, database partitions, and edge computations. With Eprovider, each tenant gets isolated security contexts without incurring the overhead of managing dozens of distinct database instances.",
      },
      {
        id: "b2",
        type: "heading2",
        text: "Why Schema-Level Isolation Matters",
      },
      {
        id: "b3",
        type: "paragraph",
        text: "In multi-tenant setups, isolating tables under dedicated tenant schemas guarantees strict boundary enforcement. By combining Postgres RLS policies with tenant-minted JWT credentials, client requests directly hit PostgREST safely without bespoke middle tiers.",
      },
      {
        id: "b4",
        type: "quote",
        text: "“Security should never be an afterthought layered on top of an API. It must be baked directly into the query execution planner.”",
      },
      {
        id: "b5",
        type: "code",
        language: "sql",
        text: `-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_tenant_isolation ON posts
FOR ALL TO authenticated
USING (author_id = request_user_id())
WITH CHECK (author_id = request_user_id());`,
      },
      {
        id: "b6",
        type: "paragraph",
        text: "With this policy in place, even if a compromised client attempts to pass another author's identifier, the query engine automatically substitutes the verified subject claim from the tenant auth token.",
      },
    ],
  },
  {
    id: "post-002",
    author_id: "usr-author-03",
    author: MOCK_PROFILES["usr-author-03"],
    title: "Mastering Craft and Micro-Interactions in Web Editorial Design",
    slug: "mastering-craft-and-micro-interactions-in-web-editorial-design",
    excerpt:
      "How intentional typography rhythms, subtle scroll indicators, and tactile feedback transform reader retention on long-form articles.",
    cover_image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    category: "Design",
    tags: ["UI/UX", "Typography", "Frontend", "Animation"],
    status: "published",
    published_at: "2025-02-22T09:30:00Z",
    claps_count: 89,
    read_time_minutes: 4,
    created_at: "2025-02-21T08:00:00Z",
    updated_at: "2025-02-22T09:30:00Z",
    content: [
      {
        id: "b21",
        type: "paragraph",
        text: "Digital typography has too often been treated as mere content container rather than the active voice of the narrative. When readers dive into essays exceeding 2,000 words, visual fatigue sets in unless hierarchy is crystal clear.",
      },
      {
        id: "b22",
        type: "heading2",
        text: "The Golden Ratio of Leading and Measure",
      },
      {
        id: "b23",
        type: "paragraph",
        text: "Keep your line measure between 60 to 75 characters per line. Pair warm serif titles with legible humanist body type, and use soft slate accents to avoid harsh monochrome contrast.",
      },
      {
        id: "b24",
        type: "image",
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80",
        caption: "A focused writing setup with minimal clutter and maximum typography focus.",
      },
    ],
  },
  {
    id: "post-003",
    author_id: "usr-admin-01",
    author: MOCK_PROFILES["usr-admin-01"],
    title: "Scheduled Publishing & Background Queue Patterns",
    slug: "scheduled-publishing-and-background-queue-patterns",
    excerpt:
      "Automating blog post release schedules using Eprovider Cron triggers and decoupled Edge Functions for seamless release pipelines.",
    cover_image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    category: "Engineering",
    tags: ["Cron", "Background Jobs", "DevOps", "Automation"],
    status: "published",
    published_at: "2025-02-23T15:00:00Z",
    claps_count: 57,
    read_time_minutes: 5,
    created_at: "2025-02-22T11:00:00Z",
    updated_at: "2025-02-23T15:00:00Z",
    content: [
      {
        id: "b31",
        type: "paragraph",
        text: "When publishing content at peak audience times across timezones, authors shouldn't have to stay online. By utilizing scheduled timestamps stored in the posts table, automated cron workers invoke the publish edge function reliably.",
      },
      {
        id: "b32",
        type: "heading2",
        text: "Deterministic Cron Execution",
      },
      {
        id: "b33",
        type: "paragraph",
        text: "Every minute, the worker executes a lightweight check finding all records where status = 'scheduled' and scheduled_at <= NOW(). Upon finding candidates, it dispatches atomic updates and triggers Realtime channel alerts.",
      },
    ],
  },
  {
    id: "post-004",
    author_id: "usr-admin-01",
    author: MOCK_PROFILES["usr-admin-01"],
    title: "Draft: The Future of Edge Intelligence in Content Creation",
    slug: "draft-the-future-of-edge-intelligence",
    excerpt: "Exploring next-generation AI pipelines directly inside the browser editor workflow.",
    category: "AI & Future",
    tags: ["AI", "Edge Computing", "Draft"],
    status: "draft",
    claps_count: 0,
    read_time_minutes: 3,
    created_at: "2025-02-24T10:00:00Z",
    updated_at: "2025-02-24T14:30:00Z",
    content: [
      {
        id: "b41",
        type: "paragraph",
        text: "This is a working draft exploring how local and edge LLMs can assist writers with tone adjustments, structural outlines, and instant fact-checking without slowing down editing flow.",
      },
    ],
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c-001",
    post_id: "post-001",
    author_id: "usr-mod-02",
    author: MOCK_PROFILES["usr-mod-02"],
    content:
      "Outstanding breakdown of RLS combined with tenant JWT claims. We use this exact pattern in production and it drastically cuts down boilerplate backend code!",
    status: "approved",
    created_at: "2025-02-20T14:30:00Z",
    replies: [
      {
        id: "c-001-r1",
        post_id: "post-001",
        author_id: "usr-admin-01",
        author: MOCK_PROFILES["usr-admin-01"],
        parent_id: "c-001",
        content: "Thanks Marcus! The best part is that PostgREST schema cache reloads automatically after migrations.",
        status: "approved",
        created_at: "2025-02-20T15:10:00Z",
      },
    ],
  },
  {
    id: "c-002",
    post_id: "post-001",
    author_id: "usr-reader-04",
    author: MOCK_PROFILES["usr-reader-04"],
    content:
      "Quick question: how do you handle rate limiting on edge functions during traffic surges?",
    status: "approved",
    created_at: "2025-02-21T09:00:00Z",
    replies: [],
  },
  {
    id: "c-003",
    post_id: "post-002",
    author_id: "usr-reader-04",
    author: MOCK_PROFILES["usr-reader-04"],
    content: "The serif font choice and subtle border radius look gorgeous on mobile. Great read!",
    status: "approved",
    created_at: "2025-02-22T11:20:00Z",
  },
  {
    id: "c-004-pending",
    post_id: "post-001",
    author_id: "usr-reader-04",
    author: MOCK_PROFILES["usr-reader-04"],
    content:
      "Check out my unrelated crypto site for free tokens: http://spam-example.test! (Testing moderation filter)",
    status: "pending",
    created_at: "2025-02-24T18:00:00Z",
  },
];