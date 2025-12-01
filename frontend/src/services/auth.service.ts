import { supabase } from "../lib/supabase";

export interface AdminUser {
  id: number;
  email: string;
  nama_lengkap?: string;
  role: string;
  last_login?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Auth Service
 * Handles admin authentication
 */

export class AuthService {
  private static readonly STORAGE_KEY = "admin_session";

  // Login admin
  static async login(credentials: LoginCredentials): Promise<AdminUser> {
    const { email, password } = credentials;

    console.log("Attempting login with email:", email);

    // Query admin_users table (without is_active check since your table might not have it)
    const { data, error } = await supabase
      .from("pengguna")
      .select("id, email, role")
      .eq("email", email)
      .eq("password", password)
      .single();

    console.log("Login query result:", { data, error });

    if (error) {
      console.error("Login error:", error);

      // Check if it's a "no rows" error (wrong credentials)
      if (error.code === "PGRST116") {
        throw new Error("Email atau password salah!");
      }

      // Other errors
      throw new Error(`Login gagal: ${error.message}`);
    }

    if (!data) {
      throw new Error("Email atau password salah!");
    }

    // Save session to localStorage FIRST (so login works even if update fails)
    this.saveSession(data);

    // Try to update last login (ignore if function doesn't exist or fails)
    try {
      const { error: rpcError } = await supabase.rpc("update_last_login", {
        p_email: email,
      });
      if (rpcError) {
        console.warn(
          "Could not update last_login (function may not exist):",
          rpcError
        );
      }
    } catch (err) {
      console.warn("Could not update last_login:", err);
      // Ignore this error - login still succeeds
    }

    return data as AdminUser;
  }

  // Logout admin
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check if admin is logged in
  static isAuthenticated(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  // Get current session
  static getSession(): AdminUser | null {
    try {
      const session = localStorage.getItem(this.STORAGE_KEY);
      if (!session) return null;
      return JSON.parse(session) as AdminUser;
    } catch {
      return null;
    }
  }

  // Save session to localStorage
  private static saveSession(user: AdminUser): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  // Get current admin info
  static getCurrentAdmin(): AdminUser | null {
    return this.getSession();
  }
}
