// Minimal local server for the termlogin demo.
// Serves index.html + logger.js, and prints submitted demo events to this terminal.
// Everything stays on your machine — nothing is sent anywhere else.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css"
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "text/plain" });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/events") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        console.log("\n--- Demo submission received ---");
        console.log("Event:   ", payload.event || "(none)");
        if (payload.username !== undefined) console.log("Username:", payload.username);
        if (payload.password !== undefined) console.log("Password:", payload.password);
        if (payload.message !== undefined) console.log("Message: ", payload.message);
        console.log("---------------------------------\n");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (req.method === "GET") {
    let filePath = req.url === "/" ? "/index.html" : req.url;
    filePath = path.join(__dirname, filePath);
    serveFile(res, filePath);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain" });
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`termlogin demo server running at http://localhost:${PORT}`);
  console.log("Open that URL in your browser, then submit the form.");
  console.log("Submitted values will be printed right here in this terminal.\n");
});
