import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { AnyDataModel, GenericMutationCtx } from 'convex/server';
const generateUniqueSlug = async (ctx: GenericMutationCtx<AnyDataModel>) => {
    let tries = 0;
    while (tries < 5) {
        const randomString = [...Array(5)]
        .map(() => Math.random().toString(36)[2])
        .join("");
        const existingForm = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("slug"), randomString))
            .first();
        if (!existingForm) {
            return randomString;
        }
        tries++;
    }
    throw new ConvexError("Failed to generate a unique slug");
};
export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        const newFormId = await ctx.db.insert("forms", {
            createdBy: identity.tokenIdentifier,
            slug: await generateUniqueSlug(ctx),
        });
        return newFormId;
    },
});
export const update = mutation({
    args: {
        formId: v.id("forms"),
        name: v.string(),
        description: v.string(),
        slug: v.string(),
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

        const formBySlug = await ctx.db
            .query("forms")
            .filter((q) => q.eq(q.field("slug"), args.slug))
            .first();
        if (formBySlug && formBySlug._id !== args.formId) {
            throw new ConvexError("Form with this slug already exists");
        }

        const formsOfThisUser = await ctx.db
        .query("forms")
        .filter((q) => q.eq(q.field("createdBy"), identity.tokenIdentifier))
        .collect();
        const sameNameForms = formsOfThisUser.filter((f) => f.name === args.name.trim());
        
        if (sameNameForms.length > 0 && sameNameForms[0]._id !== args.formId) {
            throw new ConvexError("Form with this name already exists");
        }

        await ctx.db
            .patch(args.formId, {
                name: args.name,
                description: args.description,
                slug: args.slug,
            });
    },
});

export const deleteForm = mutation({
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
        const formResponses = await ctx.db
            .query("form_responses")
            .filter((q) => q.eq(q.field("formId"), args.formId))
            .collect();
        if (formResponses?.length > 0) {
            throw new ConvexError("Form has responses - cannot delete");
        }

        const formFields = await ctx.db
            .query("form_fields")
            .filter((q) => q.eq(q.field("formId"), args.formId))
            .collect();
        for (const field of formFields) {
            await ctx.db.delete(field._id);
        }
        await ctx.db.delete(args.formId);
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