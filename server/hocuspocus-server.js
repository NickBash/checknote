const { Hocuspocus } = require('@hocuspocus/server')
const { onStoreDocument, onLoadDocument } = require('./documentHelpers')

const server = new Hocuspocus({
  port: process.env.HOCUSPOCUS_PORT,
  onStoreDocument,
  onLoadDocument,
  debounce: process.env.HOCUSPOCUS_DEBOUNCE,
})

server.listen()
