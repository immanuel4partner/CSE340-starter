/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const session = require("express-session")
require("dotenv").config()
const app = express()
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const pool = require("./database/") 
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const flash = require("connect-flash")
const bodyParser = require("body-parser")
/* ***********************
 * Middleware to parse POST data
 *************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Global Variables for Views
 *************************/
app.use((req, res, next) => {
  res.locals.loggedin = false
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Session and Flash Setup
 *************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sessionId",
}))

app.use(flash())

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.use("/account", accountRoute)
app.use("/inv", inventoryRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))

/* **********************
 * 404 - File not found route
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500
app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`)
})