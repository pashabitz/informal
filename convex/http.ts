import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/form",
    method: "GET", 
    handler: httpAction(async (ctx, request) => {
        return new Response("Hello, Form", { status: 200 });
    }),
});
export default http;