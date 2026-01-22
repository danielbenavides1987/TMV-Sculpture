import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === Users ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Email/Phone
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("patient"), // 'admin', 'doctor', 'patient'
  language: text("language").default("es"), // 'es', 'en'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// === Doctor Profiles ===
export const doctorProfiles = pgTable("doctor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // FK to users
  bioEs: text("bio_es"),
  bioEn: text("bio_en"),
  cvUrl: text("cv_url"),
  imageUrls: text("image_urls").array(),
  consultationFee: integer("consultation_fee").default(0),
  isFreeConsultation: boolean("is_free_consultation").default(false),
  specialty: text("specialty"),
});

export const insertDoctorProfileSchema = createInsertSchema(doctorProfiles).omit({ id: true });

// === Hotel Alliances ===
export const hotelAlliances = pgTable("hotel_alliances", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  mealPrice: integer("meal_price").default(0),
  imageUrls: text("image_urls").array(),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  amenities: text("amenities").array(),
});

export const insertHotelSchema = createInsertSchema(hotelAlliances).omit({ id: true });

// === Quotes (The core workflow) ===
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  
  // Step 1: Doctor Proposal
  surgeryCost: integer("surgery_cost"), // Base medical cost
  diagnosis: text("diagnosis"),
  
  // Step 2: Admin Config
  hotelId: integer("hotel_id"), // FK to hotel
  logisticsFee: integer("logistics_fee").default(0),
  
  // Step 3: Patient Config
  stayDays: integer("stay_days").default(0),
  includeLogistics: boolean("include_logistics").default(false),
  includeMealPlan: boolean("include_meal_plan").default(false),
  whatsappNumber: text("whatsapp_number"),
  
  totalCost: integer("total_cost").default(0),
  appointmentDate: timestamp("appointment_date"),
  patientName: text("patient_name"),
  patientPhone: text("patient_phone"),
  patientEmail: text("patient_email"),
  
  // Status Flow: 'draft' -> 'review' (Doctor->Admin) -> 'ready' (Admin->Patient) -> 'pending_payment' (Patient Confirmed) -> 'paid'
  status: text("status").default("draft"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true, createdAt: true });

// === Payments ===
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").notNull(),
  amount: integer("amount").notNull(),
  referenceNumber: text("reference_number").notNull(),
  bankName: text("bank_name"),
  receiptUrl: text("receipt_url"),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, submittedAt: true });

// === Types ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DoctorProfile = typeof doctorProfiles.$inferSelect;
export type InsertDoctorProfile = z.infer<typeof insertDoctorProfileSchema>;

export type HotelAlliance = typeof hotelAlliances.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
