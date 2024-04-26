import { NextRequest, NextResponse } from 'next/server'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'

const Bucket = process.env.AWS_BUCKET
const Endpoint = process.env.AWS_ENDPOINT!

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS! as string,
    secretAccessKey: process.env.AWS_SECRET! as string,
  },
  endpoint: Endpoint,
  forcePathStyle: true,
})

// endpoint to get the list of files in the bucket
// export async function GET() {
//   const response = await s3.send(new ListObjectsCommand({ Bucket }))
//   return NextResponse.json(response?.Contents ?? [])
// }

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const fileName = formData.get('fileName') as string

  const ext = file.name.split('.').pop()

  const Body = (await file.arrayBuffer()) as Buffer

  const newName = nanoid()

  const command = new PutObjectCommand({
    Bucket,
    Key: fileName ? `${fileName}.${ext}` : `${newName}.${ext}`,
    Body,
    ContentDisposition: 'attachment',
  })

  try {
    await s3.send(command)

    return NextResponse.json(
      {
        name: fileName ? `${fileName}.${ext}` : `${newName}.${ext}`,
        status: true,
        url: `${Endpoint}/${Bucket}/`,
        originalName: file.name,
      },
      { status: 200 },
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        message: 'Not created',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const formData = await request.formData()
  const filename = formData.get('filename') as string

  const command = new DeleteObjectCommand({
    Bucket,
    Key: filename,
  })

  try {
    await s3.send(command)

    return NextResponse.json(
      {
        status: true,
      },
      { status: 200 },
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        message: 'Not deleted',
      },
      { status: 500 },
    )
  }
}
