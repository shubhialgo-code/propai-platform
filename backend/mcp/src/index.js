"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const server = new index_js_1.Server({
    name: "property-platform-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * List available tools.
 */
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "add_property",
            description: "Insert a new property listing into AlloyDB",
            inputSchema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    location_city: { type: "string" },
                    location_state: { type: "string" },
                    location_country: { type: "string" },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    bedrooms: { type: "integer" },
                    bathrooms: { type: "integer" },
                    area_sqft: { type: "number" },
                    property_type: { type: "string" },
                    amenities: { type: "object" },
                    images: { type: "array", items: { type: "string" } },
                    ownerId: { type: "string" },
                },
                required: ["title", "price", "location_city", "bedrooms", "bathrooms", "area_sqft", "property_type", "ownerId"],
            },
        },
        {
            name: "update_property",
            description: "Update an existing property listing",
            inputSchema: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    updates: { type: "object" },
                },
                required: ["id", "updates"],
            },
        },
        {
            name: "delete_property",
            description: "Remove a property listing",
            inputSchema: {
                type: "object",
                properties: {
                    id: { type: "string" },
                },
                required: ["id"],
            },
        },
        {
            name: "search_properties",
            description: "Filter properties by location, price, bedrooms, etc.",
            inputSchema: {
                type: "object",
                properties: {
                    location: { type: "string" },
                    minPrice: { type: "number" },
                    maxPrice: { type: "number" },
                    bedrooms: { type: "integer" },
                    propertyType: { type: "string" },
                    minArea: { type: "number" },
                },
            },
        },
        {
            name: "get_property_details",
            description: "Return full property information",
            inputSchema: {
                type: "object",
                properties: {
                    id: { type: "string" },
                },
                required: ["id"],
            },
        },
        {
            name: "semantic_property_search",
            description: "Natural language search using pgvector similarity",
            inputSchema: {
                type: "object",
                properties: {
                    query: { type: "string" },
                    limit: { type: "integer" },
                },
                required: ["query"],
            },
        },
        {
            name: "recommend_properties",
            description: "Get personalized recommendations",
            inputSchema: {
                type: "object",
                properties: {
                    budget: { type: "number" },
                    location: { type: "string" },
                    propertyPreferences: { type: "array", items: { type: "string" } },
                },
            },
        },
        {
            name: "nearby_properties",
            description: "Return properties within a geographic radius",
            inputSchema: {
                type: "object",
                properties: {
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    radiusKm: { type: "number" },
                },
                required: ["latitude", "longitude", "radiusKm"],
            },
        },
    ],
}));
/**
 * Handle tool calls.
 */
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "add_property": {
                const data = zod_1.z.object({
                    title: zod_1.z.string(),
                    description: zod_1.z.string().optional(),
                    price: zod_1.z.number(),
                    location_city: zod_1.z.string(),
                    location_state: zod_1.z.string().optional(),
                    location_country: zod_1.z.string().optional(),
                    latitude: zod_1.z.number().optional(),
                    longitude: zod_1.z.number().optional(),
                    bedrooms: zod_1.z.number().int(),
                    bathrooms: zod_1.z.number().int(),
                    area_sqft: zod_1.z.number(),
                    property_type: zod_1.z.string(),
                    amenities: zod_1.z.any().optional(),
                    images: zod_1.z.any().optional(),
                    ownerId: zod_1.z.string(),
                }).parse(args);
                const property = await prisma.property.create({ data });
                return { content: [{ type: "text", text: JSON.stringify(property, null, 2) }] };
            }
            case "update_property": {
                const { id, updates } = zod_1.z.object({ id: zod_1.z.string(), updates: zod_1.z.any() }).parse(args);
                const property = await prisma.property.update({ where: { id }, data: updates });
                return { content: [{ type: "text", text: JSON.stringify(property, null, 2) }] };
            }
            case "delete_property": {
                const { id } = zod_1.z.object({ id: zod_1.z.string() }).parse(args);
                await prisma.property.delete({ where: { id } });
                return { content: [{ type: "text", text: `Property ${id} deleted.` }] };
            }
            case "search_properties": {
                const { location, minPrice, maxPrice, bedrooms, propertyType, minArea } = args;
                const properties = await prisma.property.findMany({
                    where: {
                        OR: location ? [
                            { location_city: { contains: location, mode: 'insensitive' } },
                            { location_state: { contains: location, mode: 'insensitive' } }
                        ] : undefined,
                        price: { gte: minPrice, lte: maxPrice },
                        bedrooms: bedrooms ? { gte: bedrooms } : undefined,
                        property_type: propertyType,
                        area_sqft: minArea ? { gte: minArea } : undefined,
                    },
                });
                return { content: [{ type: "text", text: JSON.stringify(properties, null, 2) }] };
            }
            case "get_property_details": {
                const { id } = zod_1.z.object({ id: zod_1.z.string() }).parse(args);
                const property = await prisma.property.findUnique({
                    where: { id },
                    include: { owner: true },
                });
                if (!property)
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "Property not found");
                return { content: [{ type: "text", text: JSON.stringify(property, null, 2) }] };
            }
            case "semantic_property_search": {
                return { content: [{ type: "text", text: "Semantic search requires an embedding for the query. Implementation pending LLM integration." }] };
            }
            case "recommend_properties": {
                const { budget, location } = args;
                const properties = await prisma.property.findMany({
                    where: {
                        price: budget ? { lte: budget * 1.1 } : undefined,
                        location_city: location ? { contains: location, mode: 'insensitive' } : undefined,
                    },
                    take: 5,
                });
                return { content: [{ type: "text", text: JSON.stringify(properties, null, 2) }] };
            }
            case "nearby_properties": {
                const { latitude, longitude, radiusKm } = zod_1.z.object({
                    latitude: zod_1.z.number(),
                    longitude: zod_1.z.number(),
                    radiusKm: zod_1.z.number(),
                }).parse(args);
                const properties = await prisma.$queryRaw `
          SELECT * FROM "Property"
          WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= ${radiusKm}
        `;
                return { content: [{ type: "text", text: JSON.stringify(properties, null, 2) }] };
            }
            default:
                throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, `Invalid arguments: ${error.message}`);
        }
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Property Platform MCP server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map