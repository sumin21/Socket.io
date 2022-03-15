const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};

// typescript

// import * as express from "express";

// import {
//   Filter,
//   Options,
//   RequestHandler,
//   createProxyMiddleware,
// } from "http-proxy-middleware";

// const app = express();

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://www.example.org",
//     changeOrigin: true,
//   })
// );
// app.listen(3000);

// // http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
