import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Users ===
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.post(api.users.create.path, async (req, res) => {
      try {
          const input = api.users.create.input.parse(req.body);
          // Check existing
          const existing = await storage.getUserByUsername(input.username);
          if (existing) {
              return res.status(400).json({ message: "Username already exists" });
          }
          const user = await storage.createUser(input);
          res.status(201).json(user);
      } catch (err) {
          if (err instanceof z.ZodError) {
              return res.status(400).json({ message: err.errors[0].message });
          }
          throw err;
      }
  });

  app.put(api.users.update.path, async (req, res) => {
      const input = api.users.update.input.parse(req.body);
      const user = await storage.updateUser(Number(req.params.id), input);
      res.json(user);
  });

  // === Doctors ===
  app.get(api.doctors.list.path, async (req, res) => {
    const doctors = await storage.getAllDoctors();
    res.json(doctors);
  });

  app.get(api.doctors.get.path, async (req, res) => {
    const doctor = await storage.getDoctorProfile(Number(req.params.id));
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  });

  app.post(api.doctors.create.path, async (req, res) => {
      const input = api.doctors.create.input.parse(req.body);
      const doctor = await storage.createDoctorProfile(input);
      res.status(201).json(doctor);
  });
  
  app.put(api.doctors.update.path, async (req, res) => {
      const input = api.doctors.update.input.parse(req.body);
      const doctor = await storage.updateDoctorProfile(Number(req.params.id), input);
      res.json(doctor);
  });


  // === Hotels ===
  app.get(api.hotels.list.path, async (req, res) => {
    const hotels = await storage.getAllHotels();
    res.json(hotels);
  });

  app.post(api.hotels.create.path, async (req, res) => {
    const input = api.hotels.create.input.parse(req.body);
    const hotel = await storage.createHotel(input);
    res.status(201).json(hotel);
  });
  
  app.put(api.hotels.update.path, async (req, res) => {
      const input = api.hotels.update.input.parse(req.body);
      const hotel = await storage.updateHotel(Number(req.params.id), input);
      res.json(hotel);
  });
  
  app.delete(api.hotels.delete.path, async (req, res) => {
      await storage.deleteHotel(Number(req.params.id));
      res.status(204).send();
  });


  // === Quotes ===
  app.get(api.quotes.list.path, async (req, res) => {
    // In a real app, filter by role/user from session
    const quotes = await storage.getAllQuotes();
    res.json(quotes);
  });
  
  app.get(api.quotes.get.path, async (req, res) => {
      const quote = await storage.getQuote(Number(req.params.id));
      if (!quote) return res.status(404).json({ message: "Quote not found" });
      res.json(quote);
  });

  app.post(api.quotes.create.path, async (req, res) => {
    const input = api.quotes.create.input.parse(req.body);
    const quote = await storage.createQuote(input);
    res.status(201).json(quote);
  });
  
  app.put(api.quotes.update.path, async (req, res) => {
      const input = api.quotes.update.input.parse(req.body);
      const quote = await storage.updateQuote(Number(req.params.id), input);
      res.json(quote);
  });

  // === Payments ===
  app.get(api.payments.list.path, async (req, res) => {
      const payments = await storage.getAllPayments();
      res.json(payments);
  });
  
  app.post(api.payments.create.path, async (req, res) => {
      const input = api.payments.create.input.parse(req.body);
      const payment = await storage.createPayment(input);
      res.status(201).json(payment);
  });
  
  app.put(api.payments.update.path, async (req, res) => {
      const input = api.payments.update.input.parse(req.body);
      const payment = await storage.updatePayment(Number(req.params.id), input);
      res.json(payment);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
    const existingUsers = await storage.getAllUsers();
    if (existingUsers.length > 0) return;

    // 1. Admin
    const admin = await storage.createUser({
        username: "admin",
        password: "admin123", // In real app, hash this
        name: "Master Admin",
        role: "admin",
        language: "es"
    });

    // 2. Doctor
    const doctorUser = await storage.createUser({
        username: "dr.sculpture",
        password: "doctor123",
        name: "Dr. Ricardo Perez",
        role: "doctor",
        language: "es"
    });
    
    const doctorProfile = await storage.createDoctorProfile({
        userId: doctorUser.id,
        specialty: "Plastic Surgery",
        bioEs: "Especialista en cirugía reconstructiva y estética con más de 15 años de experiencia.",
        bioEn: "Specialist in reconstructive and aesthetic surgery with over 15 years of experience.",
        consultationFee: 100,
        isFreeConsultation: false,
        imageUrls: ["https://placehold.co/600x400?text=Dr+Perez"]
    });

    // 3. Patient
    const patientUser = await storage.createUser({
        username: "jane.doe",
        password: "patient123",
        name: "Jane Doe",
        role: "patient",
        language: "en"
    });

    // 4. Hotels
    const hotel1 = await storage.createHotel({
        name: "Hotel Eurobuilding Express",
        pricePerNight: 120,
        mealPrice: 40,
        descriptionEs: "Lujo y confort en el corazón de la ciudad.",
        descriptionEn: "Luxury and comfort in the heart of the city.",
        imageUrls: ["https://placehold.co/600x400?text=Eurobuilding"],
        amenities: ["WiFi", "Pool", "Gym", "Breakfast"]
    });

    const hotel2 = await storage.createHotel({
        name: "Hotel Tamanaco Intercontinental",
        pricePerNight: 180,
        mealPrice: 60,
        descriptionEs: "Icono de la hotelería venezolana con vistas al Ávila.",
        descriptionEn: "Icon of Venezuelan hospitality with views of the Avila.",
        imageUrls: ["https://placehold.co/600x400?text=Tamanaco"],
        amenities: ["WiFi", "Pool", "Spa", "Casino"]
    });

    // 5. Quote (Draft)
    await storage.createQuote({
        patientId: patientUser.id,
        doctorId: doctorUser.id,
        surgeryCost: 3500,
        diagnosis: "Rhinoplasty required.",
        status: "review",
        stayDays: 0,
        includeLogistics: false,
        includeMealPlan: false
    });

    console.log("Database seeded successfully!");
}
