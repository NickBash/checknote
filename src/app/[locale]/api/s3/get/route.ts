import { NextResponse } from 'next/server'

const Bucket = process.env.AWS_BUCKET
const endpoint = process.env.AWS_ENDPOINT!

export async function POST() {
  return NextResponse.json({ url: `${endpoint}/${Bucket}/` }, { status: 200 })
}
