import predictClassification from "../server/inferenceService.js";
import crypto from "crypto";
import storeData from "../server/storeData.js";
import InputError from "../exceptions/InputError.js";
import getData from "../server/getData.js";

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image,
    );
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
    response.code(201);

    await storeData(id, data);

    return response;
  } catch (e) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

async function getHistoriesHandler(_, h) {
  try {
    const allData = await getData();

    const data = await allData.docs.map((doc) => {
      const docData = doc.data();
      console.log("\n data ", docData);
      return {
        id: doc.id,
        history: {
          ...docData,
        },
      };
    });

    const response = h.response({
      status: "success",
      data: data,
    });

    response.code(200);
    return response;
  } catch (e) {
    console.log(e);
  }
}

export { postPredictHandler, getHistoriesHandler };
