'use strict';

document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // GET ELEMENTS
  // ================================
  const classificationList = document.querySelector("#classificationList");
  const inventoryDisplay = document.querySelector("#inventoryDisplay");

  if (!classificationList || !inventoryDisplay) {
    console.error("Missing required DOM elements");
    return;
  }

  // ================================
  // EVENT LISTENER
  // ================================
  classificationList.addEventListener("change", async () => {

    const classification_id = classificationList.value;
    console.log("Selected classification_id:", classification_id);

    // Empty selection
    if (!classification_id) {
      inventoryDisplay.innerHTML = `
        <tr>
          <td colspan="3">Select a classification to view inventory.</td>
        </tr>
      `;
      return;
    }

    try {
      const response = await fetch(`/inv/getInventory/${classification_id}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Inventory data:", data);

      renderInventoryTable(data);

    } catch (err) {
      console.error("Fetch error:", err);

      inventoryDisplay.innerHTML = `
        <tr>
          <td colspan="3">⚠️ Failed to load inventory data</td>
        </tr>
      `;
    }
  });

  // ================================
  // RENDER TABLE
  // ================================
  function renderInventoryTable(data) {

    inventoryDisplay.innerHTML = "";

    if (!data || data.length === 0) {
      inventoryDisplay.innerHTML = `
        <tr>
          <td colspan="3">No vehicles found in this classification.</td>
        </tr>
      `;
      return;
    }

    let table = `
      <thead>
        <tr>
          <th>Vehicle Name</th>
          <th>Modify</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
    `;

    data.forEach(vehicle => {
      table += `
        <tr>
          <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
          <td>
            <a href="/inv/edit/${vehicle.inv_id}">Modify</a>
          </td>
          <td>
            <a href="/inv/delete/${vehicle.inv_id}">Delete</a>
          </td>
        </tr>
      `;
    });

    table += `</tbody>`;

    inventoryDisplay.innerHTML = table;
  }

});