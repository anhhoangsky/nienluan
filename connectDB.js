const admin = require("firebase-admin");
const serviceAccount = require("./privatekey/crawl-vnexpress-ab5b581c40c5.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports.paginateQuery = async function (collection, page) {
  // [START firestore_query_cursor_pagination]
  let first = db
    .collection(collection)
    .orderBy(admin.firestore.FieldPath.documentId())
    .limit(10);
  let snapshot = await first.get();

  // Get the last document
  while (true) {
    if (page <= 1) break;
    let last = snapshot.docs[snapshot.docs.length - 1];
    const next = db
      .collection(collection)
      .orderBy(admin.firestore.FieldPath.documentId())
      .startAfter(last.id)
      .limit(10);

    // Use the query for pagination
    // [START_EXCLUDE]
    snapshot = await next.get();
    // console.log("Num results:", nextSnapshot.docs.length);
    page = page - 1;
    first = next;
  }

  // Construct a new query starting at this document.
  // Note: this will not have the desired effect if multiple
  // cities have the exact same population value.
  // [END_EXCLUDE]
  // [END firestore_query_cursor_pagination]
  return snapshot;
};

module.exports.readerTen = async function (collection) {
  const first = db
    .collection(collection)
    .orderBy(admin.firestore.FieldPath.documentId())
    .limit(10);

  const snapshot = await first.get();
  return snapshot;
};

module.exports.reader = async function (collection, q) {
  const snapshot = await db.collection(collection).get();
  return snapshot;
};

module.exports.readerDetail = async function (collection, q) {
  const snapshot = await db
    .collection(collection)
    .where("dishID", "==", q)
    .get();
  return snapshot;
};

module.exports.readerDoc = async function (collectionPath) {
  const snapshot = await db.doc(collectionPath).get();
  return snapshot;
};

module.exports.writer = async function (collection, doc, index) {
  const docRef = db.collection(collection).doc(index);

  await docRef.set(doc);
};

module.exports.writerwithoutindex = async function (collection, doc) {
  const docRef = db.collection(collection);

  await docRef.add(doc);
};

module.exports.count = function (collection) {
  db.collection(collection)
    .get()
    .then(function (querySnapshot) {
      console.log(querySnapshot.size);
    });
};

module.exports.clearCollection = function (path) {
  const ref = db.collection(path);
  ref.onSnapshot((snapshot) => {
    snapshot.docs.forEach((doc) => {
      ref.doc(doc.id).delete();
    });
  });
};
