const invModel = require("../models/inventory-model");
const Util = require("../utilities");

const invCont = {};

/* ===== BUILD CLASSIFICATION PAGE ===== */
invCont.buildByClassificationId = async (req, res, next) => {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    const grid = await Util.buildClassificationGrid(data);
    const nav = await Util.getNav();
    const className = data[0]?.classification_name || "Vehicles";

    res.render("inventory/classification", {
      title: className + " Vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ===== BUILD VEHICLE DETAIL PAGE ===== */
invCont.buildDetailView = async (req, res, next) => {
  try {
    const inv_id = req.params.invId;
    const vehicle = await invModel.getInventoryById(inv_id);

    if (!vehicle) {
      return res.render("inventory/detail", {
        title: "Vehicle Not Found",
        nav: await Util.getNav(),
        detailHtml: "<p class='notice'>Sorry, vehicle details could not be found.</p>",
      });
    }

    const nav = await Util.getNav();
    const detailHtml = Util.buildVehicleDetail(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHtml,
    });
  } catch (error) {
    next(error);
  }
};

/* ===== INTENTIONAL ERROR (500) ===== */
invCont.triggerError = async (req, res, next) => {
  throw new Error("Intentional Server Error");
};

module.exports = invCont;