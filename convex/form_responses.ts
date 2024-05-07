import { mutation, query } from './_generated/server';
import { v } from "convex/values";

export const addResponse = mutation({
    args: {
        formId: v.string(),
        values: v.array(v.object({
            name: v.string(),
            value: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("_id"), args.formId))
            .unique();
        if (!form) {
            throw new Error("Form not found");
        }
        const responseId = await ctx.db.insert("form_responses", args);
        return responseId;
    },
});

export const getFormResponses = query({
    args: {
        formId: v.string(),
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
        return ctx.db
            .query("form_responses")
            .filter((q) => q.eq(q.field("formId"), args.formId))
            .collect();
    },
})