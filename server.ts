import express from "express";
import next from "next";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 4000;

app.prepare().then(() => {
  const server = express();

  // Handle Next.js requests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.all("*", (req: any, res: any) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
