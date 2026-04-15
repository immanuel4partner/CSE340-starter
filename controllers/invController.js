const invModel = require("../models/inventory-model");
const Util = require("../utilities");

const invCont = {};

/* =========================
   FLASH HELPER
========================= */
function getFlash(req) {
  return {
    notice: req.flash("notice") || [],
    error: req.flash("error") || [],
  };
}

/* =========================
   SAFE NAV
========================= */
async function safeNav() {
  try {
    return await Util.getNav();
  } catch (err) {
    console.error("Nav error:", err);
    return "<ul><li><a href='/'>Home</a></li></ul>";
  }
}

/* =========================
   SAFE CLASSIFICATION LIST
========================= */
async function safeClassificationList(selectedId = null) {
  try {
    return await Util.buildClassificationList(selectedId);
  } catch (err) {
    console.error("Classification list error:", err);
    return "<select><option disabled>Error loading classifications</option></select>";
  }
}

/* =========================
   SAFE INT PARSER
========================= */
function safeInt(value) {
  const num = Number(value);
  return Number.isInteger(num) ? num : null;
}

/* =========================
   INVENTORY BY CLASSIFICATION
========================= */
invCont.buildByClassificationId = async (req, res, next) => {
  try {
    const classification_id = safeInt(req.params.classification_id);

    if (!classification_id) {
      req.flash("error", "Invalid classification ID.");
      return res.redirect("/inv/");
    }

    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await safeNav();

    if (!data || data.length === 0) {
      return res.render("inventory/classification", {
        title: "No vehicles found",
        nav,
        grid: "<p>No vehicles found.</p>",
        flash: getFlash(req),
        errors: [],
      });
    }

    const grid = await Util.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: data[0].classification_name,
      nav,
      grid,
      flash: getFlash(req),
      errors: [],
    });

  } catch (error) {
    console.error("buildByClassificationId error:", error);
    next(error);
  }
};

/* =========================
   MANAGEMENT VIEW
========================= */
invCont.buildManagement = async (req, res) => {
  const nav = await safeNav();
  const classificationSelect = await safeClassificationList();

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: [],
    flash: getFlash(req),
  });
};

/* =========================
   ADD INVENTORY VIEW
========================= */
invCont.buildAddInventory = async (req, res) => {
  const nav = await safeNav();
  const classificationSelect = await safeClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
    errors: [],
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    flash: getFlash(req),
  });
};

/* =========================
   EDIT INVENTORY VIEW
========================= */
invCont.buildEditInventory = async (req, res, next) => {
  try {
    const inv_id = safeInt(req.params.inv_id);

    if (!inv_id) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await safeNav();

    if (!vehicle) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }

    const classificationSelect = await safeClassificationList(
      vehicle.classification_id
    );

    res.render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      classificationSelect,
      flash: getFlash(req),
      errors: [],
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image,
      inv_thumbnail: vehicle.inv_thumbnail,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      classification_id: vehicle.classification_id,
    });

  } catch (error) {
    console.error("buildEditInventory error:", error);
    next(error);
  }
};

/* =========================
   🔥 DETAIL VIEW (ADDED FIX)
========================= */
invCont.buildDetailView = async (req, res, next) => {
  try {
    const inv_id = safeInt(req.params.inv_id);

    if (!inv_id) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await safeNav();

    if (!vehicle) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      flash: getFlash(req),
      errors: [],
    });

  } catch (error) {
    console.error("buildDetailView error:", error);
    next(error);
  }
};

/* =========================
   UPDATE INVENTORY
========================= */
invCont.updateInventory = async (req, res, next) => {
  try {
    const inv_id = safeInt(req.body.inv_id);

    if (!inv_id) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    const result = await invModel.updateInventory(
      inv_id,
      req.body.inv_make,
      req.body.inv_model,
      req.body.inv_description,
      req.body.inv_image,
      req.body.inv_thumbnail,
      req.body.inv_price,
      req.body.inv_year,
      req.body.inv_miles,
      req.body.inv_color,
      req.body.classification_id
    );

    if (result) {
      req.flash("notice", "Vehicle updated successfully.");
      return res.redirect("/inv/");
    }

    req.flash("error", "Update failed.");
    return res.redirect(`/inv/edit/${inv_id}`);

  } catch (error) {
    console.error("updateInventory error:", error);
    next(error);
  }
};

/* =========================
   DELETE CONFIRM VIEW
========================= */
invCont.buildDeleteConfirm = async (req, res, next) => {
  try {
    const inv_id = safeInt(req.params.inv_id);

    if (!inv_id) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await safeNav();

    if (!vehicle) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }

    res.render("inventory/delete-confirm", {
      title: "Delete Vehicle",
      nav,
      flash: getFlash(req),
      errors: [],
      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price,
      inv_image: vehicle.inv_image,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      inv_description: vehicle.inv_description
    });

  } catch (error) {
    console.error("buildDeleteConfirm error:", error);
    next(error);
  }
};

/* =========================
   DELETE INVENTORY
========================= */
invCont.deleteInventoryItem = async (req, res, next) => {
  try {
    const inv_id = safeInt(req.body.inv_id);

    if (!inv_id) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    const result = await invModel.deleteInventory(inv_id);

    if (result) {
      req.flash("notice", "Vehicle deleted successfully.");
    } else {
      req.flash("error", "Delete failed.");
    }

    return res.redirect("/inv/");

  } catch (error) {
    console.error("deleteInventoryItem error:", error);
    next(error);
  }
};

/* =========================
   INVENTORY JSON
========================= */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = safeInt(req.params.classification_id);

    if (!classification_id) {
      return res.status(400).json({ error: "Invalid classification ID" });
    }

    const data = await invModel.getInventoryByClassificationId(classification_id);

    return res.json(data || []);

  } catch (error) {
    console.error("getInventoryJSON error:", error);
    next(error);
  }
};

/* =========================
   TEST ERROR
========================= */
invCont.triggerError = (req, res, next) => {
  next(new Error("Intentional Server Error"));
};

module.exports = invCont;