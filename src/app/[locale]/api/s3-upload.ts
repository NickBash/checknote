import { APIRoute } from 'next-s3-upload'

export default APIRoute.configure({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  bucket: process.env.AWS_BUCKET,
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
})
