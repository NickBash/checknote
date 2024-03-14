import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse, type NextRequest } from 'next/server'

const Bucket = process.env.AWS_BUCKET
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS! as string,
    secretAccessKey: process.env.AWS_SECRET! as string,
  },
  endpoint: process.env.AWS_ENDPOINT!,
})

export async function GET(_: Request, { params }: { params: { key: string } }) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', params.key)
  const command = new GetObjectCommand({ Bucket, Key: params.key })
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 })

  return NextResponse.json({ src })
}

export async function DELETE(request: NextRequest, { params }: { params: { key: string } }) {}
