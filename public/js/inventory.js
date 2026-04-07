'use strict'

// ================================
// GET ELEMENTS (SAFE)
// ================================
const classificationList = document.querySelector("#classification_id")
const inventoryDisplay = document.querySelector("#inventoryDisplay")

// ================================
// EVENT LISTENER (SAFE)
// ================================
if (classificationList && inventoryDisplay) {
  classificationList.addEventListener("change", async function () {
    const classification_id = classificationList.value

    // Prevent empty selection crash
    if (!classification_id) {
      inventoryDisplay.innerHTML = ""
      return
    }

    console.log(`Selected classification: ${classification_id}`)

    const url = `/inv/getInventory/${classification_id}`

    try {
      const response = await fetch(url)

      // ✅ HANDLE SERVER ERRORS
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

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
// BUILD TABLE
// ================================
function buildInventoryList(data) {

  // CLEAR TABLE FIRST
  inventoryDisplay.innerHTML = ""

  // NO DATA CASE
  if (!data || data.length === 0) {
    inventoryDisplay.innerHTML = `
      <tr>
        <td colspan="3">No vehicles found in this classification.</td>
      </tr>
    `
    return
  }

  // TABLE HEADER
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

  // TABLE ROWS
  data.forEach(vehicle => {
    table += `
      <tr>
        <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
        <td>
          <a href="/inv/edit/${vehicle.inv_id}" class="table-link">Modify</a>
        </td>
        <td>
          <a href="/inv/delete/${vehicle.inv_id}" class="table-link delete">Delete</a>
        </td>
      </tr>
    `
  })

  table += "</tbody>"

  // INSERT INTO TABLE
  inventoryDisplay.innerHTML = table
}