const invModel = require("../models/inventory-model");
const Util = require("../utilities");

const invCont = {};

/* ===== Helper to safely get flash messages ===== */
function getFlash(req) {
  return {
    notice: req.flash("notice") || [],
    error: req.flash("error") || [],
  };
}

/* ===== Helper: Safe Nav ===== */
async function safeNav() {
  try {
    return await Util.getNav();
  } catch (err) {
    console.error("Nav error:", err);
    return "<ul><li><a href='/'>Home</a></li></ul>";
  }
}

/* ===== Helper: Safe Classification List ===== */
async function safeClassificationList(selectedId = null) {
  try {
    return await Util.buildClassificationList(selectedId);
  } catch (err) {
    console.error("Classification list error:", err);
    return "<select><option disabled>Error loading classifications</option></select>";
  }
}

/* ===== VEHICLE MANAGEMENT VIEW ===== */
invCont.buildManagement = async (req, res) => {
  const nav = await safeNav();

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    pageClass: "inv-management",
    flash: getFlash(req),
  });
};

/* ===== ADD CLASSIFICATION VIEW ===== */
invCont.buildAddClassification = async (req, res) => {
  const nav = await safeNav();

  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
    flash: getFlash(req),
  });
};

/* ===== PROCESS ADD CLASSIFICATION ===== */
invCont.addClassification = async (req, res) => {
  const nav = await safeNav();
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash("notice", "Classification added successfully.");
      return res.redirect("/inv/");
    }

    req.flash("error", "Failed to add classification.");
  } catch (error) {
    console.error("addClassification error:", error);
    req.flash("error", "An error occurred while adding classification.");
  }

  return res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name,
    flash: getFlash(req),
  });
};

/* ===== ADD INVENTORY VIEW (FIXED) ===== */
invCont.buildAddInventory = async (req, res) => {
  const nav = await safeNav();
  const classificationSelect = await safeClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
    errors: null,

    // ✅ SAFE DEFAULT VALUES (CRITICAL FIX)
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

/* ===== PROCESS ADD INVENTORY ===== */
invCont.addInventory = async (req, res) => {
  const nav = await safeNav();
  const classificationSelect = await safeClassificationList(
    req.body.classification_id
  );

  try {
    const result = await invModel.addInventory(req.body);

    if (result) {
      req.flash("notice", "Inventory item added successfully.");
      return res.redirect("/inv/");
    }

    req.flash("error", "Failed to add inventory item.");
  } catch (error) {
    console.error("addInventory error:", error);
    req.flash("error", "An error occurred while adding inventory.");
  }

  return res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
    errors: null,
    ...req.body,
    flash: getFlash(req),
  });
};

/* ===== CLASSIFICATION VIEW ===== */
invCont.buildByClassificationId = async (req, res, next) => {
  try {
    const classification_id = req.params.classification_id;

    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await Util.buildClassificationGrid(data || []);
    const nav = await safeNav();

    const className =
      data && data.length > 0 ? data[0].classification_name : "Vehicles";

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
      flash: getFlash(req),
    });
  } catch (error) {
    console.error("buildByClassificationId error:", error);
    next(error);
  }
};

/* ===== VEHICLE DETAIL VIEW ===== */
invCont.buildDetailView = async (req, res, next) => {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await safeNav();

    if (!vehicle) {
      return res.render("inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        detailHtml:
          "<p class='notice'>Sorry, vehicle details could not be found.</p>",
        flash: getFlash(req),
      });
    }

    const detailHtml = Util.buildVehicleDetail(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHtml,
      flash: getFlash(req),
    });
  } catch (error) {
    console.error("buildDetailView error:", error);
    next(error);
  }
};

/* ===== INTENTIONAL ERROR (500) ===== */
invCont.triggerError = async (req, res, next) => {
  next(new Error("Intentional Server Error"));
};

module.exports = invCont;