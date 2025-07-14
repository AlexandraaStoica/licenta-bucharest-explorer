"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSyncer() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    fetch("/api/user-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.imageUrl,
      }),
    });
  }, [user]);

  return null;
} 