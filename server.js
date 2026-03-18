/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
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
app.get("/",function(req, res){
  res.render("index", {title: "Home"})
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
