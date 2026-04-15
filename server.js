/***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()
const app = express()
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const pool = require("./database/")
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const reviewRoute = require("./routes/reviewRoute") // reviews route
const utilities = require("./utilities/")
const flash = require("connect-flash")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

/***********************
 * Body Parsing
 *************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/***********************
 * Cookies
 *************************/
app.use(cookieParser())

/***********************
 * Session (must come before flash)
 *************************/
app.use(
  require("express-session")({
    store: new (require("connect-pg-simple")(require("express-session")))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
)

/***********************
 * Flash Messages
 *************************/
app.use(flash())

app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

/***********************
 * JWT Middleware
 *************************/
app.use((req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    res.locals.loggedin = false
    res.locals.accountData = null
    req.session.loggedin = false
    req.session.accountData = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    res.locals.loggedin = true
    res.locals.accountData = decoded

    req.session.loggedin = true
    req.session.accountData = decoded
  } catch (err) {
    res.clearCookie("jwt")

    res.locals.loggedin = false
    res.locals.accountData = null

    req.session.loggedin = false
    req.session.accountData = null
  }

  next()
})

/***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/***********************
 * ROUTES
 *************************/
app.use(staticRoutes)
app.use("/account", accountRoute)
app.use("/inv", inventoryRoute)

/**
 * IMPORTANT:
 * Your review routes are now under:
 * http://localhost:5500/reviews/...
 */
app.use("/reviews", reviewRoute)

/***********************
 * HOME ROUTE
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))

/***********************
 * AUTH MIDDLEWARE
 *************************/
function requireAuth(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "Please login first.")
    return res.redirect("/account/login")
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    next()
  } catch (err) {
    res.clearCookie("jwt")
    req.flash("notice", "Session expired. Please login again.")
    return res.redirect("/account/login")
  }
}

/***********************
 * TEST ROUTE
 *************************/
app.get("/dashboard", requireAuth, (req, res) => {
  res.send(`Welcome ${req.user.account_email}`)
})

/***********************
 * 404 HANDLER
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, page not found." })
})

/***********************
 * GLOBAL ERROR HANDLER
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()

  console.error(err.message)

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.status === 404
      ? err.message
      : "Something went wrong on the server.",
    nav,
  })
})

/***********************
 * SERVER START
 *************************/
const port = process.env.PORT || 5500

app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`)
})