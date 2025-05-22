const express = require("express");
const app = express();
const PORT = process.env.PORT || 5555;
const morgan = require("morgan");
const hbs = require("express-hbs");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require("express-mysql-session")(sessions);

require("dotenv").config();
const db = require("./db");

// HANDLEBARS HELPERS
// const hbsHelpers = require("./helpers/hbs-helpers");
// hbsHelpers.register(hbs);


// Gunakan middleware ambilKategori untuk semua route
app.use( async (req, res, next) => {
  try {
    const categories = await db.query("select * from categories order by nama") 
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.error('Gagal mengambil kategori:', error);
    res.locals.categories = [];
    next();
  }
});


// SESSION AND COOKIE PARSER
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
    store: new MySQLStore(
      {
        clearExpired: true,
        checkExpirationInterval: 1000 * 60 * 60,
        expiration: oneDay,
      },
      db.pool
    ),
  })
);
app.use(cookieParser());

app.engine(
  "hbs",
  hbs.express4({
    partialsDir: "views/partials",
    defaultLayout: "views/layout",
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(function (tokens, req, res) {
  // get time in HH:MM:SS format
  const d = new Date();
  const time = d.toLocaleTimeString("id");

  // get first character from req.session.role then convert to uppercase
  const role = req.session?.role ? req.session.role.charAt(0).toUpperCase() : 'X';
  const name = req.session?.user ? `${req.session.user} -` : '';
  const userLine = role === 'X' ? '(?) -' : `(${role}) ${name}`;

  // URL
  let url = tokens.url(req, res);
  url = url.includes('monitor=betteruptime') ? '🔥 Uptime Check' : url;

  return [
    time,
    userLine,
    tokens.method(req, res),
    url,
    tokens.status(req, res),
    // tokens.res(req, res, 'content-length'), '-',
    `${tokens['response-time'](req, res)}ms`
  ].join(' ')
}));

// const routeApi = require("./routes/api");
// const routeAuth = require("./routes/auth");
const routeIndex = require("./routes/index");

// PUBLIC ROUTES
app.use("/", routeIndex);
// app.use("/auth", routeAuth);
// app.use("/api", routeApi);


app.listen(PORT, () => console.log(`🚀  APP running at ${PORT}`));
