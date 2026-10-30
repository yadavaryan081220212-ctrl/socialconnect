// Client-side helper, loaded by index.html.
// Currently just a hook point — the actual logging happens on the server
// (server.js) when the page POSTs to /events, so the real values always
// print to the terminal running server.js, not here in the browser.
console.log("termlogin demo page loaded. Submissions will post to /events.");
