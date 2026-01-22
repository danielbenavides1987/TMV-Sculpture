import { z } from 'zod';
import { insertUserSchema, insertDoctorProfileSchema, insertHotelSchema, insertQuoteSchema, insertPaymentSchema, users, doctorProfiles, hotelAlliances, quotes, payments } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users',
      responses: { 200: z.array(z.custom<typeof users.$inferSelect>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: { 
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound 
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/users/:id',
      input: insertUserSchema.partial(),
      responses: { 
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound 
      },
    },
    create: {
        method: 'POST' as const,
        path: '/api/users',
        input: insertUserSchema,
        responses: { 201: z.custom<typeof users.$inferSelect>() },
    }
  },
  doctors: {
    list: {
      method: 'GET' as const,
      path: '/api/doctors',
      responses: { 200: z.array(z.custom<typeof doctorProfiles.$inferSelect & { user: typeof users.$inferSelect }>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/doctors/:id',
      responses: { 
        200: z.custom<typeof doctorProfiles.$inferSelect>(),
        404: errorSchemas.notFound 
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/doctors',
      input: insertDoctorProfileSchema,
      responses: { 201: z.custom<typeof doctorProfiles.$inferSelect>() },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/doctors/:id',
      input: insertDoctorProfileSchema.partial(),
      responses: { 200: z.custom<typeof doctorProfiles.$inferSelect>() },
    }
  },
  hotels: {
    list: {
      method: 'GET' as const,
      path: '/api/hotels',
      responses: { 200: z.array(z.custom<typeof hotelAlliances.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/hotels',
      input: insertHotelSchema,
      responses: { 201: z.custom<typeof hotelAlliances.$inferSelect>() },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/hotels/:id',
      input: insertHotelSchema.partial(),
      responses: { 200: z.custom<typeof hotelAlliances.$inferSelect>() },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/hotels/:id',
      responses: { 204: z.void() },
    }
  },
  quotes: {
    list: {
      method: 'GET' as const,
      path: '/api/quotes',
      responses: { 200: z.array(z.custom<typeof quotes.$inferSelect>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/quotes/:id',
      responses: { 
        200: z.custom<typeof quotes.$inferSelect>(),
        404: errorSchemas.notFound
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/quotes',
      input: insertQuoteSchema,
      responses: { 201: z.custom<typeof quotes.$inferSelect>() },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/quotes/:id',
      input: insertQuoteSchema.partial(),
      responses: { 200: z.custom<typeof quotes.$inferSelect>() },
    }
  },
  payments: {
    list: {
      method: 'GET' as const,
      path: '/api/payments',
      responses: { 200: z.array(z.custom<typeof payments.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/payments',
      input: insertPaymentSchema,
      responses: { 201: z.custom<typeof payments.$inferSelect>() },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/payments/:id',
      input: insertPaymentSchema.partial(),
      responses: { 200: z.custom<typeof payments.$inferSelect>() },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
