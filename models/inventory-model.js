const pool = require("../database/");

/* =========================
   GET ALL CLASSIFICATIONS
========================= */
async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return data.rows;
}

/* =========================
   GET BY CLASSIFICATION
========================= */
async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i
     JOIN public.classification AS c
     ON i.classification_id = c.classification_id
     WHERE i.classification_id = $1`,
    [classification_id]
  );
  return data.rows;
}

/* =========================
   GET BY ID
========================= */
async function getInventoryById(inv_id) {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i
     JOIN public.classification AS c
     ON i.classification_id = c.classification_id
     WHERE i.inv_id = $1`,
    [inv_id]
  );
  return data.rows[0];
}

/* =========================
   ADD CLASSIFICATION
========================= */
async function addClassification(classification_name) {
  const sql = `
    INSERT INTO public.classification (classification_name)
    VALUES ($1)
    RETURNING *`;

  const data = await pool.query(sql, [classification_name]);
  return data.rows[0];
}

/* =========================
   ADD INVENTORY
========================= */
async function addInventory(inv) {
  const sql = `
    INSERT INTO public.inventory (
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`;

  const data = await pool.query(sql, [
    inv.inv_make,
    inv.inv_model,
    inv.inv_year,
    inv.inv_description,
    inv.inv_image,
    inv.inv_thumbnail,
    inv.inv_price,
    inv.inv_miles,
    inv.inv_color,
    inv.classification_id,
  ]);

  return data.rows[0];
}

/* =========================
   DELETE INVENTORY
========================= */
async function deleteInventory(inv_id) {
  const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
  const data = await pool.query(sql, [inv_id]);

  return data.rowCount > 0;
}

/* =========================
   🚨 STEP 5: UPDATE INVENTORY (FIXED)
========================= */
async function updateInventory(
  inv_id,
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
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_make = $1,
        inv_model = $2,
        inv_description = $3,
        inv_image = $4,
        inv_thumbnail = $5,
        inv_price = $6,
        inv_year = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *`;

    const data = await pool.query(sql, [
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
      inv_id,
    ]);

    return data.rows[0]; // ✅ REQUIRED FOR ASSIGNMENT
  } catch (error) {
    console.error("updateInventory error:", error);
    throw error;
  }
}

/* =========================
   EXPORT
========================= */
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  deleteInventory,
  updateInventory,
};