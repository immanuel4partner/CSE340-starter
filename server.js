/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()
const app = express()
const static = require("./routes/static")

// ADD THESE 👇
const path = require("path")
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
app.get("/", (req, res) => {
  res.render("index");
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000  
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`)
})