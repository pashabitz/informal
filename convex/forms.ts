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