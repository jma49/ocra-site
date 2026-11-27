#!/usr/bin/env node
const { readFileSync, writeFileSync } = require("node:fs");
const { createServer } = require("node:http");

const port = Number(process.argv[process.argv.indexOf("--port") + 1]);
createServer((_request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.end(readFileSync("served.json"));
}).listen(port, "127.0.0.1", () => {
  writeFileSync("listener.json", JSON.stringify({ pid: process.pid, port }));
});

// A graceful server can keep listening briefly after receiving SIGTERM.
process.on("SIGTERM", () => setTimeout(() => process.exit(0), 100));
