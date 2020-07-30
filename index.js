// Module dependencies.
const express = require("express");
const http = require("http");
const path = require("path");
const routes = require("./routes/routes");
const ejs = require('ejs');

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://05a4f8e4cd82412c99bb859b19ad8f63@o427022.ingest.sentry.io/5370511' });

const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// PORT
const PORT = process.env.PORT || 5000;

// All environments
app.set("port", PORT);

// App routes
app.use(routes);

// Run server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

