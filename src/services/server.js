import Hapi from "@hapi/hapi";
import routes from "./routes.js";
import loadModel from "../server/loadModel.js";
import dotenv from "dotenv";
import path from "path";
import InputError from "../exceptions/InputError.js";

import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const failActions = (_, res, error) => {
  const errorMessage = error.details[0].message;

  const response = res
    .response({
      status: "fail",
      message: errorMessage,
    })
    .takeover();

  return response.code(400);
};

const init = async () => {
  try {
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: process.env.HOST || "localhost",
      routes: {
        cors: {
          origin: ["*"],
        },
      },
    });

    const model = await loadModel();
    server.app.model = model;

    routes.map((route) => {
      if (route.options != undefined && route.options.validate != undefined) {
        route.options.validate.failAction = (request, h, err) => {
          throw err;
        };
      }

      return route;
    });

    server.route(routes);
    server.ext("onPreResponse", (req, res) => {
      const response = req.response;
      if (response.isJoi) {
        return failActions(req, res, response);
      }

      if (response instanceof InputError) {
        const newResponse = res.response({
          status: "fail",
          message: `${response.message}`,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (response.isBoom) {
        const newResponse = res.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.output.statusCode);
        return newResponse;
      }

      return res.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (e) {
    console.log(e);
  }
};

init();
