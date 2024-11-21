import db from "./db.js";
async function storeData(id, data) {
  try {
    const predictCollection = db.collection("predictions");
    return predictCollection.doc(id).set(data);
  } catch (e) {
    throw new Error("Terjadi kesalahan dalam input file ke firebase");
  }
}

export default storeData;
