const PORT = process.env.PORT || 5555;
const TOKEN = process.env.JWT_SECRET;
const express = require("express");
const mongoose = require('mongoose'); 
const cookieParser = require("cookie-parser");
const session = require('express-session');
const path = require('path');
const connect = require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const passport = require('passport');
const globalRoutes = require('./routers/Index');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

const app = express();
app.use(session({ secret: 'fares', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors());
// if (process.env.ENABLE_CORS) {
//   const dashboard_url = process.env.CORS_DASHBOARD_URL;
//   app.use(cors({ origin: dashboard_url.split("|"),
//                 methods: "GET, POST, PUT, DELETE",
//                 credentials: true,
//                 exposedHeaders: "Authorization"
//                }));
// }

app.use(cors({
  origin: ["http://185.192.96.18:30902","http://185.192.96.18:30203","http://185.192.96.18:32647"],
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
  exposedHeaders: "Authorization"
}));

let url = connect.parsed.DATABASE_URL;
mongoose.connect(url).then(() => {
  console.log("MongoDB connected");
}).catch(() => {
  console.log("Not connected to MongoDB");
});

app.use(cookieParser());
app.use(express.json());

app.use(globalRoutes);
app.use('/utils/images', express.static('utils/images'));

app.use((req, res, next) => {
  req.headers['Authorization'] = `Bearer ${TOKEN}`;
  next();
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use('/uploads', express.static(__dirname + '/uploads'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
