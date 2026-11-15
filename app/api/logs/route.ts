import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const dmLogs = await db.getDmLogs();
  const publishJobs = await db.getPublishJobs();
  return NextResponse.json({ dmLogs, publishJobs });
}
