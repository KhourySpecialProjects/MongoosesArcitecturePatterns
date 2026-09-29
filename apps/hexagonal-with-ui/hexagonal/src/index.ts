/**
 * Main application entry point for the hexagonal architecture monolith.
 * Initializes the Fastify server and starts listening on the configured port.
 */

import { buildApp } from "./app.js";

const app = buildApp();
const port = Number(process.env.PORT) || 3000;

app.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Hexagonal architecture monolith running on http://0.0.0.0:${port}`);
});
