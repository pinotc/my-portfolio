"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getGlobalSettings() {
  return await prisma.globalSetting.findUnique({
    where: { id: "site_config" }
  }) || { siteName: "My Portfolio", logoUrl: null, faviconUrl: null };
}

export async function updateGlobalSettings(formData: FormData) {
  try {
    const siteName = formData.get("siteName") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const faviconUrl = formData.get("faviconUrl") as string;

    await prisma.globalSetting.upsert({
      where: { id: "site_config" },
      update: { siteName, logoUrl, faviconUrl },
      create: { id: "site_config", siteName, logoUrl, faviconUrl }
    });

    revalidatePath("/", "layout"); // Revalidate toàn bộ site để cập nhật logo/tên
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}