import { mutation, query } from './_generated/server';
import { v } from "convex/values";

export const addField = mutation({
    args: {
        formId: v.string(),
        name: v.string(),
        type: v.string(),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("_id"), args.formId))
            .unique();
        if (!form || form.createdBy !== identity.tokenIdentifier) {
            throw new Error("Form not found");
        }
        const newFormId = await ctx.db.insert("form_fields", args);
        return newFormId;
    },
});

export const getFormFields = query({
    args: {
        formId: v.string(),
    },
    handler: async (ctx, args) => {

        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("_id"), args.formId))
            .unique();
        if (!form) {
            throw new Error("Form not found");
        }
        return ctx.db
            .query("form_fields")
            .filter((q) => q.eq(q.field("formId"), args.formId))
            .collect();
    },
});