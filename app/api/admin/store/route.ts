import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_STORE_DATA, StoreData } from "@/lib/store";

const STORE_FILE_PATH = path.join(process.cwd(), "data", "store.json");

export async function GET() {
  try {
    if (fs.existsSync(STORE_FILE_PATH)) {
      const fileContent = fs.readFileSync(STORE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileContent);
      return NextResponse.json(parsed);
    }
  } catch (err: any) {
    console.error("[Store API] Error reading store.json:", err);
  }
  return NextResponse.json(DEFAULT_STORE_DATA);
}

export async function POST(req: Request) {
  try {
    const body: StoreData = await req.json();

    if (!body || !body.products) {
      return NextResponse.json(
        { error: "Invalid store payload" },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Store state successfully saved to data/store.json",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Store API] Error writing store.json:", err);
    return NextResponse.json(
      { error: "Failed to save store data: " + err.message },
      { status: 500 }
    );
  }
}
