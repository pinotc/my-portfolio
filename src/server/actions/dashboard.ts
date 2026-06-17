"use server";

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Khởi tạo client kết nối Google Analytics Data API
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Xử lý ký tự xuống dòng trong .env
  },
});

const propertyId = process.env.GA_PROPERTY_ID;

// ================= CORES GOOGLE ANALYTICS DATA =================
export async function getDashboardStats() {
  try {
    if (!propertyId) {
      throw new Error("Thiếu cấu hình GA_PROPERTY_ID trong file .env");
    }

    // 1. Lấy tổng số người dùng (Active Users) và số lượt xem trang trong 30 ngày qua
    const [mainReport] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" }
      ],
    });

    const totalActiveUsers = parseInt(mainReport.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
    const totalPageViews = parseInt(mainReport.rows?.[0]?.metricValues?.[1]?.value || "0", 10);

    // 2. Lấy danh sách Top 5 đường dẫn được xem nhiều nhất
    const [pageReport] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: 5,
    });

    const topPages = (pageReport.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "/",
      views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    }));

    // 3. Lấy số lượng người dùng đang trực tuyến (Realtime - trong 30 phút qua)
    const [realtimeReport] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    const realtimeUsers = parseInt(realtimeReport.rows?.[0]?.metricValues?.[0]?.value || "0", 10);

    return {
      totalActiveUsers,
      totalPageViews,
      topPages,
      realtimeUsers,
      success: true
    };
  } catch (error) {
    console.error("Lỗi khi kết nối Google Analytics API:", error);
    return {
      totalActiveUsers: 0,
      totalPageViews: 0,
      topPages: [],
      realtimeUsers: 0,
      success: false
    };
  }
}

// ================= SEO SETTINGS (Giữ nguyên) =================
export async function getSEOSettings() {
  return await prisma.sEOSetting.findMany({ orderBy: { page: "asc" } });
}

export async function saveSEOSetting(formData: FormData) {
  try {
    const page = formData.get("page") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const keywords = formData.get("keywords") as string;
    const ogImage = formData.get("ogImage") as string;

    await prisma.sEOSetting.upsert({
      where: { page },
      update: { title, description, keywords, ogImage },
      create: { page, title, description, keywords, ogImage }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}