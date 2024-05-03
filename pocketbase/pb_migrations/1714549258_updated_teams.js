/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("brpb3do4lfu0ti9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dhlwocbv",
    "name": "usersRoles",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("brpb3do4lfu0ti9")

  // remove
  collection.schema.removeField("dhlwocbv")

  return dao.saveCollection(collection)
})
