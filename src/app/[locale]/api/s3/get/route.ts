import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse, type NextRequest } from 'next/server'

const Bucket = process.env.AWS_BUCKET
const endpoint = process.env.AWS_ENDPOINT!

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS! as string,
    secretAccessKey: process.env.AWS_SECRET! as string,
  },
  endpoint,
})

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const fileName = formData.get('fileName') as string

  const command = new GetObjectCommand({ Bucket, Key: fileName })
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 })

  return NextResponse.json({ src: `${endpoint}/${Bucket}/${fileName}` })
}
