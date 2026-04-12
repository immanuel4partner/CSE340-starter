const invModel = require("../models/inventory-model")

const Util = {}

/* ===== NAVIGATION ===== */
Util.getNav = async function () {
  const result = await invModel.getClassifications()
  const data = result.rows || result   // ✅ handles BOTH cases safely

  let list = "<ul>"
  list += '<li><a href="/">Home</a></li>'

  data.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}">
        ${row.classification_name}
      </a>
    </li>`
  })

  list += "</ul>"
  return list
}

/* ===== CLASSIFICATION SELECT LIST ===== */
Util.buildClassificationList = async function (classification_id = null) {
  const result = await invModel.getClassifications()
  const data = result.rows || result   // ✅ FIX

  let list = '<select name="classification_id" id="classificationList" required>'
  list += '<option value="">Choose a Classification</option>'

  data.forEach((row) => {
    list += `<option value="${row.classification_id}"`

    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      list += " selected"
    }

    list += `>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}

/* ===== CLASSIFICATION GRID ===== */
Util.buildClassificationGrid = async function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'

  data.forEach((vehicle) => {
    grid += `<li>
      <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model}">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </a>
      <div class="namePrice">
        <h2>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model}">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
      </div>
    </li>`
  })

  grid += "</ul>"
  return grid
}

/* ===== VEHICLE DETAIL HTML ===== */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p class='notice'>Sorry, vehicle details could not be found.</p>"
  }

  return `
  <div class="detail-image">
    <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
  </div>
  <div class="detail-info">
    <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
    <ul class="vehicle-specs">
      <li><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</li>
      <li><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</li>
      <li><strong>Color:</strong> ${vehicle.inv_color}</li>
      <li><strong>Classification:</strong> ${vehicle.classification_name}</li>
    </ul>
    <p class="vehicle-desc">${vehicle.inv_description}</p>
  </div>
  `
}

/* ===== ERROR HANDLER MIDDLEWARE ===== */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = Util