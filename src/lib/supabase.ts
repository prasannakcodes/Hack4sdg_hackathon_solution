import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { MakerShipment } from "@/types";

export interface DbShipmentRow {
  id: string;
  maker_name: string;
  category: string;
  weight_kg: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  volume_m3: number;
  origin: string;
  destination: string;
  pickup_date: string;
  approved: boolean;
  created_at?: string;
}

export const SUPABASE_SQL_SCHEMA = `-- Run this in Supabase SQL Editor:
create table if not exists shipments (
  id text primary key,
  maker_name text not null,
  category text not null,
  weight_kg numeric not null,
  length_cm numeric not null,
  width_cm numeric not null,
  height_cm numeric not null,
  volume_m3 numeric not null,
  origin text not null,
  destination text not null,
  pickup_date text not null,
  approved boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (optional / public read-write for prototype)
alter table shipments enable row level security;

create policy "Allow public read" on shipments for select using (true);
create policy "Allow public insert" on shipments for insert with check (true);
create policy "Allow public update" on shipments for update using (true);
create policy "Allow public delete" on shipments for delete using (true);
`;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  // Node.js SSR WebSocket shim for @supabase/supabase-js on Node < 22
  if (typeof window === "undefined" && typeof globalThis.WebSocket === "undefined") {
    Object.defineProperty(globalThis, "WebSocket", {
      value: class {},
      writable: true,
      configurable: true,
    });
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof window !== "undefined"
      ? localStorage.getItem("tempowala_supabase_url")
      : null);
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof window !== "undefined"
      ? localStorage.getItem("tempowala_supabase_anon_key")
      : null);

  if (url && key && url.startsWith("https://")) {
    try {
      cachedClient = createClient(url, key);
      return cachedClient;
    } catch {
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  if (typeof window !== "undefined") {
    const localUrl = localStorage.getItem("tempowala_supabase_url");
    const localKey = localStorage.getItem("tempowala_supabase_anon_key");
    if (localUrl && localKey) return true;
  }
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function toMakerShipment(row: DbShipmentRow): MakerShipment {
  return {
    id: row.id,
    makerName: row.maker_name,
    category: row.category,
    weightKg: Number(row.weight_kg),
    dimensionsCm: {
      length: Number(row.length_cm),
      width: Number(row.width_cm),
      height: Number(row.height_cm),
    },
    volumeM3: Number(row.volume_m3),
    origin: row.origin,
    destination: row.destination,
    pickupDate: row.pickup_date,
    approved: row.approved ?? true,
  };
}

export function toDbRow(s: MakerShipment): DbShipmentRow {
  return {
    id: s.id,
    maker_name: s.makerName,
    category: s.category,
    weight_kg: s.weightKg,
    length_cm: s.dimensionsCm?.length ?? 150,
    width_cm: s.dimensionsCm?.width ?? 150,
    height_cm: s.dimensionsCm?.height ?? 150,
    volume_m3: s.volumeM3,
    origin: s.origin,
    destination: s.destination,
    pickup_date: s.pickupDate,
    approved: s.approved ?? true,
  };
}

export async function fetchShipmentsFromDb(): Promise<{
  data: MakerShipment[] | null;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Supabase credentials not configured" };
  }

  try {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    if (data && Array.isArray(data)) {
      const converted = data.map((row) => toMakerShipment(row as DbShipmentRow));
      return { data: converted, error: null };
    }

    return { data: [], error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to query database",
    };
  }
}

export async function insertShipmentToDb(
  shipment: MakerShipment
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  try {
    const row = toDbRow(shipment);
    const { error } = await supabase.from("shipments").upsert([row]);
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to insert into database",
    };
  }
}

export async function deleteShipmentFromDb(
  id: string
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to delete from database",
    };
  }
}

export async function toggleApprovalInDb(
  id: string,
  approved: boolean
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase not configured" };
  }

  try {
    const { error } = await supabase
      .from("shipments")
      .update({ approved })
      .eq("id", id);
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Failed to update database",
    };
  }
}

export async function seedInitialShipments(
  seededMakers: MakerShipment[]
): Promise<{ count: number; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { count: 0, error: "Supabase not configured" };
  }

  try {
    const rows = seededMakers.map(toDbRow);
    const { error } = await supabase.from("shipments").upsert(rows);
    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: rows.length, error: null };
  } catch (err: unknown) {
    return {
      count: 0,
      error: err instanceof Error ? err.message : "Failed to seed database",
    };
  }
}
