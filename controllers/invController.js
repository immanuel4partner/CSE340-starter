const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()

    if (!data || data.length === 0) {
      return res.render("./inventory/classification", {
        title: "NO VEHICLES HAVE BEEN FOUND",
        nav,
        grid: "There has not been any vehicles created in this classification.",
      })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Build vehicle detail view (FINAL FIXED VERSION)
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  try {
    const invId = req.params.id
    const nav = await utilities.getNav()

    const vehicle = await invModel.getInventoryById(invId)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)

    // ✅ SAFE: always return array (prevents crash)
    const reviews = await reviewModel.getReviewsByInvId(invId) || []

    const vehicleTitle =
      `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("./inventory/detail", {
      title: vehicleTitle,
      nav,
      htmlData,
      reviews,
      vehicle,

      // 🔥 CRITICAL FIX (THIS FIXES YOUR "loggedin is not defined")
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Intentional error
 * ************************************ */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}

/* ***************************
 * Vehicle management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Add classification view
 * ************************** */
invCont.newClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav()

  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 * Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { classification_name } = req.body

    const insertResult = await invModel.addClassification(classification_name)

    if (insertResult) {
      req.flash("message success", `The ${classification_name} classification was successfully added.`)
      return res.redirect("/inv/")
    }

    req.flash("message warning", "Insert failed.")
    res.redirect("/inv/add-classification")
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Add inventory view
 * ************************** */
invCont.newInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 * Add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const insertResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (insertResult) {
      req.flash("message success", `${inv_make} ${inv_model} was successfully added.`)
      return res.redirect("/inv/")
    }

    req.flash("message warning", "Insert failed.")
    res.redirect("/inv/add-inventory")
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * JSON inventory
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)

    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData && invData.length > 0) {
      return res.json(invData)
    }

    next(new Error("No data returned"))
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Edit inventory view
 * ************************** */
invCont.editInvItemView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()

    const invData = await invModel.getInventoryById(inv_id)

    if (!invData) return next({ status: 404, message: "Not found" })

    const classificationSelect = await utilities.buildClassificationList(
      invData.classification_id
    )

    const itemName = `${invData.inv_make} ${invData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      ...invData,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Update inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const updateResult = await invModel.updateInventory(...Object.values(req.body))

    if (updateResult) {
      req.flash("message success", "Update successful.")
      return res.redirect("/inv/")
    }

    req.flash("message warning", "Update failed.")
    res.redirect("/inv/")
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Delete view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()

    const itemData = await invModel.getInventoryById(inv_id)

    if (!itemData) return next({ status: 404, message: "Not found" })

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      ...itemData,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Delete item
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
      req.flash("message success", "Deletion successful.")
      return res.redirect("/inv/")
    }

    req.flash("message warning", "Delete failed.")
    res.redirect("/inv/")
  } catch (err) {
    next(err)
  }
}

module.exports = invCont