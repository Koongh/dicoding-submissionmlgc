import db from "./db.js";
async function getData() {
  try {
    const predictCollection = db.collection("predictions");

    const allData = await predictCollection.get();
    return allData;
  } catch (e) {
    throw new Error("Terjadi kesalahan dalam input file ke firebase");
  }
}

export default getData;