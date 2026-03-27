import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProfileDetailClient from "./ProfileDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/profiles/${id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Prisma — Profil" };
    const { profile } = await res.json();
    const name = profile.name ?? "Anonym";
    return {
      title: `${name} — ${profile.archetype_name} | Prisma`,
      description: `Schau dir das Präferenz-DNA-Profil von ${name} an.`,
    };
  } catch {
    return { title: "Prisma — Profil" };
  }
}

export default async function ProfilPage({ params }: Props) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let profile = null;
  try {
    const res = await fetch(`${baseUrl}/api/profiles/${id}`, { cache: "no-store" });
    if (res.ok) ({ profile } = await res.json());
  } catch { /* handled below */ }

  if (!profile) notFound();

  return <ProfileDetailClient profile={profile} />;
}
