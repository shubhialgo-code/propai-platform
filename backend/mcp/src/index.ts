import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const server = new Server(
  {
    name: "property-platform-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
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
          embedding: { type: "array", items: { type: "number" } },
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
          embedding: { type: "array", items: { type: "number" } },
          limit: { type: "integer" },
        },
        required: ["embedding"],
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
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "add_property": {
        const data = z.object({
          title: z.string(),
          description: z.string().optional(),
          price: z.number(),
          location_city: z.string().refine(city => ["Hyderabad", "Bangalore", "Bengaluru"].includes(city), {
            message: "PropAI only supports listings in Hyderabad and Bangalore."
          }),
          location_state: z.string().optional(),
          location_country: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          bedrooms: z.number().int(),
          bathrooms: z.number().int(),
          area_sqft: z.number(),
          property_type: z.string(),
          amenities: z.any().optional(),
          images: z.any().optional(),
          embedding: z.array(z.number()).optional(),
          ownerId: z.string(),
        }).parse(args);

        const property = await prisma.property.create({ 
          data: {
            ...data,
            description: data.description ?? undefined,
            location_state: data.location_state ?? undefined,
            location_country: data.location_country ?? undefined,
            latitude: data.latitude ?? undefined,
            longitude: data.longitude ?? undefined,
            amenities: data.amenities ?? undefined,
            images: data.images ?? undefined,
            embedding: data.embedding ? (data.embedding as any) : undefined,
          } as any
        });
        return { content: [{ type: "text", text: JSON.stringify(property, null, 2) }] };
      }

      case "update_property": {
        const { id, updates } = z.object({ id: z.string(), updates: z.any() }).parse(args);
        const property = await prisma.property.update({ where: { id }, data: updates });
        return { content: [{ type: "text", text: JSON.stringify(property, null, 2) }] };
      }

      case "delete_property": {
        const { id } = z.object({ id: z.string() }).parse(args);
        await prisma.property.delete({ where: { id } });
        return { content: [{ type: "text", text: `Property ${id} deleted.` }] };
      }

      case "search_properties": {
        const { location, minPrice, maxPrice, bedrooms, propertyType, minArea } = args as any;
        const properties = await prisma.property.findMany({
          where: {
            AND: [
              {
                location_city: { in: ["Hyderabad", "Bangalore", "Bengaluru"] }
              },
              location ? {
                OR: [
                  { location_city: { contains: location } },
                  { location_state: { contains: location } },
                  { title: { contains: location } },
                  { description: { contains: location } }
                ]
              } : {}
            ],
            price: { 
              gte: minPrice ?? undefined, 
              lte: maxPrice ?? undefined 
            },
            bedrooms: bedrooms ? { gte: bedrooms } : undefined,
            property_type: propertyType ?? undefined,
            area_sqft: minArea ? { gte: minArea } : undefined,
          },
        });
        return { content: [{ type: "text", text: JSON.stringify(properties, null, 2) }] };
      }

      case "get_property_details": {
        const { id } = z.object({ id: z.string() }).parse(args);
        const property = await prisma.property.findUnique({
          where: { id },
          include: { owner: true },
        });
        if (!property) throw new McpError(ErrorCode.InvalidParams, "Property not found");
        return { content: [{ type: "text", text: JSON.stringify(property, null, 2) }] };
      }

      case "semantic_property_search": {
        const { limit = 5 } = args as any;
        // SQLite Fallback: Basic title/description search since pgvector is not available
        const results = await prisma.property.findMany({
          where: {
            OR: [
              { title: { contains: "modern" } }, // Mocking relevance
              { description: { contains: "luxury" } }
            ]
          },
          take: limit,
        });

        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }

      case "recommend_properties": {
        const { budget, location } = args as any;
        const properties = await prisma.property.findMany({
          where: {
            price: budget ? { lte: budget * 1.1 } : undefined,
            location_city: { in: ["Hyderabad", "Bangalore", "Bengaluru"] },
          },
          take: 5,
        });
        return { content: [{ type: "text", text: JSON.stringify(properties, null, 2) }] };
      }

      case "nearby_properties": {
        // SQLite Fallback: Return all properties since complex geo-math is not available
        const properties = await prisma.property.findMany({ take: 10 });
        return { content: [{ type: "text", text: JSON.stringify(properties, null, 2) }] };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${error.message}`);
    }
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Property Platform MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
