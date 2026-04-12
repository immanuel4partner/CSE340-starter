'use strict'

// ================================
// GET ELEMENTS (SAFE)
// ================================
const classificationList = document.querySelector("#classificationList")
const inventoryDisplay = document.querySelector("#inventoryDisplay")

// ================================
// EVENT LISTENER (SAFE + ROBUST)
// ================================
if (classificationList && inventoryDisplay) {

  classificationList.addEventListener("change", async function () {

    const classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)

    // Prevent empty selection
    if (!classification_id) {
      inventoryDisplay.innerHTML = `
        <tr>
          <td colspan="3">Select a classification to view inventory.</td>
        </tr>
      `
      return
    }

    const url = `/inv/getInventory/${classification_id}`

    try {
      const response = await fetch(url)

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Inventory data:", data)

      buildInventoryList(data)

    } catch (error) {
      console.error("Fetch error:", error)

      inventoryDisplay.innerHTML = `
        <tr>
          <td colspan="3">⚠️ Failed to load inventory data</td>
        </tr>
      `
    }
  })
}

// ================================
// BUILD TABLE FUNCTION
// ================================
function buildInventoryList(data) {

  // Clear table first
  inventoryDisplay.innerHTML = ""

  // No data case
  if (!data || data.length === 0) {
    inventoryDisplay.innerHTML = `
      <tr>
        <td colspan="3">No vehicles found in this classification.</td>
      </tr>
    `
    return
  }

  // Build table header + body
  let table = `
    <thead>
      <tr>
        <th>Vehicle Name</th>
        <th>Modify</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
  `

  // Build rows
  data.forEach(vehicle => {
    console.log(vehicle.inv_id + ", " + vehicle.inv_model)

    table += `
      <tr>
        <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
        <td>
          <a href="/inv/edit/${vehicle.inv_id}" title="Click to update">Modify</a>
        </td>
        <td>
          <a href="/inv/delete/${vehicle.inv_id}" title="Click to delete">Delete</a>
        </td>
      </tr>
    `
  })

  table += `</tbody>`

  // Inject into DOM
  inventoryDisplay.innerHTML = table
}