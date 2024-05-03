/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "cnd3zpe5pv9n657",
    "created": "2024-04-29 15:59:27.217Z",
    "updated": "2024-04-29 15:59:27.217Z",
    "name": "documentsContent",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pllr5a4z",
        "name": "content",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cnd3zpe5pv9n657");

  return dao.deleteCollection(collection);
})
