import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        const newFormId = await ctx.db.insert("forms", {
            createdBy: identity.tokenIdentifier,
        });
        return newFormId;
    },
});
export const update = mutation({
    args: {
        formId: v.id("forms"),
        name: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.and(
                q.eq(q.field("_id"), args.formId),
                q.eq(q.field("createdBy"), identity.tokenIdentifier)
            ))
            .unique();
        if (!form) {
            throw new Error("Form not found");
        }
        await ctx.db
            .patch(args.formId, {
                name: args.name,
                description: args.description,
            });
    },
});

export const get = query({
    args: {
        formId: v.id("forms"),
    },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("_id"), args.formId))
            .unique();
        if (!form) {
            throw new Error("Form not found");
        }
        return form;
    },
});

export const getUserForms = query({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        return ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("createdBy"), identity.tokenIdentifier))
            .collect();
    },
});