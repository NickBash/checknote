const { Hocuspocus } = require('@hocuspocus/server')
const { onStoreDocument, onLoadDocument } = require('./documentHelpers')

const server = new Hocuspocus({
  port: process.env.HOCUSPOCUS_PORT || 1234,
  onStoreDocument,
  onLoadDocument,
  debounce: process.env.HOCUSPOCUS_DEBOUNCE || 2000,
})

server.listen()
