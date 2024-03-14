import { NextRequest, NextResponse } from 'next/server'

import { ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'

const Bucket = process.env.AWS_BUCKET
const Endpoint = process.env.AWS_ENDPOINT!

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS! as string,
    secretAccessKey: process.env.AWS_SECRET! as string,
  },
  endpoint: process.env.AWS_ENDPOINT!,
})

// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }))
  return NextResponse.json(response?.Contents ?? [])
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  const ext = file.name.split('.').pop()

  const Body = (await file.arrayBuffer()) as Buffer

  const newName = nanoid()

  const command = new PutObjectCommand({
    Bucket,
    Key: `${newName}.${ext}`,
    Body,
    ContentDisposition: 'attachment',
  })

  try {
    await s3.send(command)

    return NextResponse.json({
      name: `${newName}.${ext}`,
      status: true,
      src: `${Endpoint}/${Bucket}/${newName}.${ext}`,
      originalName: file.name,
    })
  } catch (e) {
    console.error(e)
  }
}
