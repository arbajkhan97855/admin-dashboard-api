const express = require("express");
const { verifyToken } = require("../../../middleware/jwt");
const {
  GetinvoiceCompany,
  SingleinvoiceCompany,
  CreateinvoiceCompany,
  UpdateinvoiceCompany,
  DeleteinvoiceCompany,
} = require("../../../controller/invoice/manageCompany");

const manageCompany = express.Router();

manageCompany.get("/getInvoiceCompany", verifyToken, GetinvoiceCompany);
manageCompany.get(
  "/getInvoiceCompany/:id",
  verifyToken,
  SingleinvoiceCompany
);
manageCompany.post(
  "/addInvoiceCompany",
  verifyToken,
  CreateinvoiceCompany
);
manageCompany.put(
  "/editInvoiceCompany/:id",
  verifyToken,
  UpdateinvoiceCompany
);
manageCompany.delete(
  "/deleteInvoiceCompany/:id",
  verifyToken,
  DeleteinvoiceCompany
);

module.exports = manageCompany;
