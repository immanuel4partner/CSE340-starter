/* ***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()
const app = express()
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

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
 * Routes
 *************************/
app.use(staticRoutes)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)

/* **********************
 * File not found route - must be last route
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ************************
 * Express Error Handler
 ***************************/
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
const port = process.env.PORT || 3000

app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`)
})