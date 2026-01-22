import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { User, InsertUser, DoctorProfile, InsertDoctorProfile, HotelAlliance, InsertHotel, Quote, InsertQuote, Payment, InsertPayment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ================= USERS =================
export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json() as User[];
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: [api.users.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.users.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json() as User;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create user");
      return await res.json() as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.list.path] });
      toast({ title: "Success", description: "User created successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
}

// ================= DOCTORS =================
export function useDoctors() {
  return useQuery({
    queryKey: [api.doctors.list.path],
    queryFn: async () => {
      const res = await fetch(api.doctors.list.path);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      // Typing this strictly per schema
      return await res.json() as (DoctorProfile & { user: User })[];
    },
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: [api.doctors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.doctors.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch doctor");
      return await res.json() as DoctorProfile;
    },
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertDoctorProfile) => {
      const res = await fetch(api.doctors.create.path, {
        method: api.doctors.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create profile");
      return await res.json() as DoctorProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.doctors.list.path] });
      toast({ title: "Success", description: "Profile updated successfully" });
    }
  });
}

// ================= HOTELS =================
export function useHotels() {
  return useQuery({
    queryKey: [api.hotels.list.path],
    queryFn: async () => {
      const res = await fetch(api.hotels.list.path);
      if (!res.ok) throw new Error("Failed to fetch hotels");
      return await res.json() as HotelAlliance[];
    },
  });
}

export function useCreateHotel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertHotel) => {
      const res = await fetch(api.hotels.create.path, {
        method: api.hotels.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create hotel");
      return await res.json() as HotelAlliance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hotels.list.path] });
      toast({ title: "Success", description: "Hotel added successfully" });
    }
  });
}

// ================= QUOTES =================
export function useQuotes() {
  return useQuery({
    queryKey: [api.quotes.list.path],
    queryFn: async () => {
      const res = await fetch(api.quotes.list.path);
      if (!res.ok) throw new Error("Failed to fetch quotes");
      return await res.json() as Quote[];
    },
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertQuote) => {
      const res = await fetch(api.quotes.create.path, {
        method: api.quotes.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create quote");
      return await res.json() as Quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quotes.list.path] });
      toast({ title: "Success", description: "Quote created successfully" });
    }
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertQuote>) => {
      const url = buildUrl(api.quotes.update.path, { id });
      const res = await fetch(url, {
        method: api.quotes.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update quote");
      return await res.json() as Quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quotes.list.path] });
      toast({ title: "Success", description: "Quote updated successfully" });
    }
  });
}

// ================= PAYMENTS =================
export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertPayment) => {
      const res = await fetch(api.payments.create.path, {
        method: api.payments.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit payment");
      return await res.json() as Payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.payments.list.path] });
      toast({ title: "Success", description: "Payment submitted successfully" });
    }
  });
}
