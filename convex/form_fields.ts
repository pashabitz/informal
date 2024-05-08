import { mutation, query } from './_generated/server';
import { v } from "convex/values";

export const addField = mutation({
    args: {
        formId: v.string(),
        name: v.string(),
        type: v.string(),
        order: v.number(),
        selectOptions: v.optional(v.array(v.string())),
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

export const deleteField = mutation({
    args: {
        fieldId: v.id("form_fields"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        const field = await ctx.db
            .query("form_fields")
            .filter((q) => q.eq(q.field("_id"), args.fieldId))
            .unique();
        if (!field) {
            throw new Error("Field not found");
        }
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("_id"), field.formId))
            .unique();
        if (!form || form.createdBy !== identity.tokenIdentifier) {
            throw new Error("Form not found");
        }
        
        await ctx.db.delete(args.fieldId);

        // maintain order
        const fields = await ctx.db
            .query("form_fields")
            .filter((q) => q.and(
                q.eq(q.field("formId"), field.formId),
                q.gt(q.field("order"), field.order)
            ))
            .collect();
        for (const f of fields) {
            await ctx.db.patch(f._id, {
                order: f.order - 1,
            });
        }
    },
});

export const getFormFields = query({
    args: {
        formId: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db
            .query("form_fields")
            .filter((q) => q.eq(q.field("formId"), args.formId))
            .collect();
    },
});

export const getBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("slug"), args.slug))
            .unique();
        if (!form) {
            throw new Error("Form not found");
        }
        return ctx.db
            .query("form_fields")
            .filter((q) => q.eq(q.field("formId"), form._id))
            .collect();
    },
});