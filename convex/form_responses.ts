import { mutation, query } from './_generated/server';
import { v } from "convex/values";

export const addResponse = mutation({
    args: {
        slug: v.string(),
        values: v.array(v.object({
            name: v.string(),
            value: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("slug"), args.slug))
            .unique();
        if (!form) {
            throw new Error("Form not found");
        }
        const response = {...args, formId: form._id};
        const responseId = await ctx.db.insert("form_responses", response);
        return responseId;
    },
});

export const getFormResponses = query({
    args: {
        formId: v.id("forms"),
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
            .withIndex("by_formId", q => q.eq("formId", args.formId))
            .collect();
    },
})