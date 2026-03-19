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
const path = require("path")

/* ✅ STATIC FILES (VERY IMPORTANT) */
app.use(express.static(path.join(__dirname, "public")))

/* VIEW ENGINE */
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

/* ROUTES */
app.use(static)

// Index Route
app.get("/", (req, res) => {
  res.render("index");
})

/* SERVER */
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})