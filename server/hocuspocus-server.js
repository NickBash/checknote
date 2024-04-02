const { Hocuspocus } = require('@hocuspocus/server')
const { onStoreDocument, onLoadDocument } = require('./documentHelpers')

const server = new Hocuspocus({
  port: 1234,
  onStoreDocument,
  onLoadDocument,
  debounce: 2000,
})

server.listen()
