import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST() {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
  const API_KEY = process.env.CLOUDINARY_API_KEY
  const API_SECRET = process.env.CLOUDINARY_API_SECRET

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      { error: "Missing Cloudinary env vars" },
      { status: 500 }
    )
  }

  // Cloudinary expects timestamp in seconds
  const timestamp = Math.floor(Date.now() / 1000)

  // IMPORTANT:
  // Only sign what the client will upload
  const toSign = `timestamp=${timestamp}${API_SECRET}`

  const signature = crypto
    .createHash("sha1")
    .update(toSign)
    .digest("hex")

  return NextResponse.json({
    signature,
    timestamp,
    api_key: API_KEY,
    cloud_name: CLOUD_NAME,
  })
}
