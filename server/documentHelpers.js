const Y = require('yjs')
const { fromUint8Array, toUint8Array } = require('js-base64')
const PocketBase = require('pocketbase/cjs')

const pb = new PocketBase(process.env.POCKETBASE_URL)

const onStoreDocument = async data => {
  const { documentName, document } = data

  const state = Y.encodeStateAsUpdate(document)
  const dbDocument = fromUint8Array(state)

  await pb?.collection('documentsContent').update(documentName, { content: dbDocument })
}
const onLoadDocument = async data => {
  const { documentName, document } = data

  if (!documentName) return Promise.resolve()

  const documentFromDB = await pb?.collection('documentsContent').getOne(documentName)

  if (documentFromDB) {
    const dbDocument = toUint8Array(documentFromDB.content || '')

    if (dbDocument && dbDocument?.length > 0) Y.applyUpdate(document, dbDocument)
    return document
  }
  return document
}

module.exports = {
  onStoreDocument,
  onLoadDocument,
}
