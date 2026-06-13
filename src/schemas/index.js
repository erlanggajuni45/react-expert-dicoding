import z from 'zod';

const ThreadSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  category: z.string(),
  createdAt: z.string(),
  ownerId: z.string(),
  totalComments: z.number(),
  upVotesBy: z.array(z.string()),
  downVotesBy: z.array(z.string()),
});

const OwnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string(),
});

const ThreadCardSchema = z.object({
  thread: ThreadSchema,
  owner: OwnerSchema,
});

const CategoryFilterSchema = z.object({
  categories: z.array(z.string()),
  selected: z.string().nullable(),
  onSelected: z.function(),
});

const CommentSchema = z.object({
  threadId: z.string(),
  comment: z.object({
    id: z.string(),
    createdAt: z.string(),
    content: z.string(),
    owner: OwnerSchema,
    upVotesBy: z.array(z.string()),
    downVotesBy: z.array(z.string()),
  }),
});

const CommentPostSchema = z.object({
  threadId: z.string(),
  commentCount: z.number(),
});

const VoteButtonSchema = z.object({
  upCount: z.number(),
  downCount: z.number(),
  upActive: z.boolean(),
  downActive: z.boolean(),
  onUp: z.function(),
  onDown: z.function(),
});

export {
  ThreadSchema,
  OwnerSchema,
  ThreadCardSchema,
  CategoryFilterSchema,
  CommentSchema,
  CommentPostSchema,
  VoteButtonSchema,
};
