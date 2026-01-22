import { 
  users, doctorProfiles, hotelAlliances, quotes, payments,
  type User, type InsertUser,
  type DoctorProfile, type InsertDoctorProfile,
  type HotelAlliance, type InsertHotel,
  type Quote, type InsertQuote,
  type Payment, type InsertPayment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>; // For admin mainly

  // Doctors
  getDoctorProfile(id: number): Promise<DoctorProfile | undefined>;
  getDoctorByUserId(userId: number): Promise<DoctorProfile | undefined>;
  getAllDoctors(): Promise<(DoctorProfile & { user: User })[]>;
  createDoctorProfile(profile: InsertDoctorProfile): Promise<DoctorProfile>;
  updateDoctorProfile(id: number, updates: Partial<InsertDoctorProfile>): Promise<DoctorProfile>;

  // Hotels
  getAllHotels(): Promise<HotelAlliance[]>;
  getHotel(id: number): Promise<HotelAlliance | undefined>;
  createHotel(hotel: InsertHotel): Promise<HotelAlliance>;
  updateHotel(id: number, updates: Partial<InsertHotel>): Promise<HotelAlliance>;
  deleteHotel(id: number): Promise<void>;

  // Quotes
  getQuote(id: number): Promise<Quote | undefined>;
  getQuotesByPatient(patientId: number): Promise<Quote[]>;
  getQuotesByDoctor(doctorId: number): Promise<Quote[]>;
  getAllQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote>;

  // Payments
  getPaymentsByQuote(quoteId: number): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
      return await db.select().from(users);
  }

  // Doctors
  async getDoctorProfile(id: number): Promise<DoctorProfile | undefined> {
    const [profile] = await db.select().from(doctorProfiles).where(eq(doctorProfiles.id, id));
    return profile;
  }

  async getDoctorByUserId(userId: number): Promise<DoctorProfile | undefined> {
    const [profile] = await db.select().from(doctorProfiles).where(eq(doctorProfiles.userId, userId));
    return profile;
  }

  async getAllDoctors(): Promise<(DoctorProfile & { user: User })[]> {
    const result = await db.select({
        profile: doctorProfiles,
        user: users
    })
    .from(doctorProfiles)
    .innerJoin(users, eq(doctorProfiles.userId, users.id));
    
    return result.map(r => ({ ...r.profile, user: r.user }));
  }

  async createDoctorProfile(insertProfile: InsertDoctorProfile): Promise<DoctorProfile> {
    const [profile] = await db.insert(doctorProfiles).values(insertProfile).returning();
    return profile;
  }

  async updateDoctorProfile(id: number, updates: Partial<InsertDoctorProfile>): Promise<DoctorProfile> {
      const [profile] = await db.update(doctorProfiles).set(updates).where(eq(doctorProfiles.id, id)).returning();
      return profile;
  }

  // Hotels
  async getAllHotels(): Promise<HotelAlliance[]> {
    return await db.select().from(hotelAlliances);
  }
  
  async getHotel(id: number): Promise<HotelAlliance | undefined> {
      const [hotel] = await db.select().from(hotelAlliances).where(eq(hotelAlliances.id, id));
      return hotel;
  }

  async createHotel(hotel: InsertHotel): Promise<HotelAlliance> {
    const [newHotel] = await db.insert(hotelAlliances).values(hotel).returning();
    return newHotel;
  }

  async updateHotel(id: number, updates: Partial<InsertHotel>): Promise<HotelAlliance> {
      const [hotel] = await db.update(hotelAlliances).set(updates).where(eq(hotelAlliances.id, id)).returning();
      return hotel;
  }

  async deleteHotel(id: number): Promise<void> {
      await db.delete(hotelAlliances).where(eq(hotelAlliances.id, id));
  }

  // Quotes
  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async getQuotesByPatient(patientId: number): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.patientId, patientId)).orderBy(desc(quotes.createdAt));
  }

  async getQuotesByDoctor(doctorId: number): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.doctorId, doctorId)).orderBy(desc(quotes.createdAt));
  }
  
  async getAllQuotes(): Promise<Quote[]> {
      return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db.insert(quotes).values(quote).returning();
    return newQuote;
  }
  
  async updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote> {
      const [quote] = await db.update(quotes).set(updates).where(eq(quotes.id, id)).returning();
      return quote;
  }

  // Payments
  async getPaymentsByQuote(quoteId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.quoteId, quoteId));
  }
  
  async getAllPayments(): Promise<Payment[]> {
      return await db.select().from(payments).orderBy(desc(payments.submittedAt));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }
  
  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment> {
      const [payment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
      return payment;
  }
}

export const storage = new DatabaseStorage();
