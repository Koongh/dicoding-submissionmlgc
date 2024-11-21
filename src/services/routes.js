import { postPredictHandler, getHistoriesHandler } from "./handler.js";

const routes = [
  {
    method: "GET",
    path: "/api/version",
    handler: (req, res) => {
      return res.response({
        status: "Success",
        message: "v1.0.0",
      });
    },
  },
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000000,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getHistoriesHandler,
  },
];

export default routes;
