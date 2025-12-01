import type { VehicleType } from "@/types";

export const TARIF: Record<VehicleType, number> = {
  Motor: 2000,
  Mobil: 5000,
};

export const ROUTES = {
  HOME: "/",
  TICKET: "/ticket",
  ADMIN: "/admin",
  SCANNER: "/admin/scanner",
} as const;
