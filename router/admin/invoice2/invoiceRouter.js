const express = require("express")
const {verifyToken} = require("../../../middleware/jwt");
const { GetInvoice, SingleInvoice, CreateInvoice, UpdateInvoice, DeleteInvoice, SendInvoice } = require("../../../controller/Invoice/invoiceController");
const upload = require("../../../middleware/upload")
const uploadEmailAttachment = require("../../../middleware/uploadEmailAttachment");

const InvoiceRouter = express.Router()
 
InvoiceRouter.get("/getAllInvoice", verifyToken, GetInvoice);
InvoiceRouter.get("/getInvoice/:id", verifyToken, SingleInvoice);
InvoiceRouter.post("/addInvoice", verifyToken, upload.single("Logo"), CreateInvoice);
InvoiceRouter.put("/editInvoice/:id", verifyToken, upload.single("Logo"), UpdateInvoice);
InvoiceRouter.delete("/deleteInvoice/:id", verifyToken, DeleteInvoice);
InvoiceRouter.post("/sendInvoice/:id", verifyToken, uploadEmailAttachment.single("attachment"), SendInvoice);



module.exports = InvoiceRouter