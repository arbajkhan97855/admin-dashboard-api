const express = require("express")

const {verifyToken} = require("../../../middleware/jwt")
const upload = require("../../../middleware/upload")
const { GetTicket, SingleTicket, CreateTicket, UpdateTicket, DeleteTicket, GetTicketWithChat, AddTicketChat, DeleteChat } = require("../../../controller/Tickets/ticketController")

const TicketRouter = express.Router()

TicketRouter.get("/getTickets",verifyToken, GetTicket)
TicketRouter.get("/getTicket/:id",verifyToken, SingleTicket)
TicketRouter.post("/addTicket", verifyToken, upload.single("Image"), CreateTicket)
TicketRouter.delete("/deleteTicket/:id", verifyToken, DeleteTicket)
TicketRouter.put("/editTicket/:id", verifyToken, upload.single("Image"), UpdateTicket)
TicketRouter.get("/getTicketChat/:id", verifyToken, GetTicketWithChat);
TicketRouter.post("/addChat",verifyToken, upload.single("image"),AddTicketChat);
TicketRouter.delete("/deleteChat/:id",verifyToken, DeleteChat);

  



module.exports = TicketRouter