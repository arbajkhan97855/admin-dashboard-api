const db = require("../../config/db");
const fs = require("fs");
const path = require("path");

exports.GetTicket = async (req, res) => {
  try {
    const AllTicket = "SELECT * FROM tbl_tickets ORDER BY id DESC";
    db.query(AllTicket, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleTicket = async (req, res) => {
  try {
    const id = req.params.id;
    const ticket = "SELECT * FROM tbl_tickets WHERE id = ?";
    db.query(ticket, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "ticket not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateTicket = async (req, res) => {
  try {
    const {
      Subject,
      Status,
      Description,
    } = req.body;

    if (!Subject || !Status || !Description || !req.file) {
      return res
        .status(400)
        .json({ message: "All Field Requide" });
    }
   const created_on = new Date().toISOString().slice(0, 19).replace("T", " ");
    const Image = req.file ? req.file.filename : null;
    const addquery = `
      INSERT INTO tbl_tickets
      ( Subject,
      Status,
      Image,
      Description,
      created_on)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      addquery,
      [
      Subject,
      Status,
      Image,
      Description,
      created_on,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res
          .status(201)
          .json({
            message: "Ticket Created Successfully",
            inserted: result.affectedRows,
          });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.UpdateTicket = async (req, res) => {
  try {
    const id = req.params.id;

    const getQuery = "SELECT * FROM tbl_tickets WHERE id = ?";
    db.query(getQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Ticket not found" });

      const oldData = result[0];

      const Subject = req.body.Subject || oldData.Subject;
      const Status = req.body.Status || oldData.Status;
      const Description = req.body.Description || oldData.Description;
      const IP_Address = req.body.IP_Address || oldData.IP_Address;
      const Root_Password = req.body.Root_Password || oldData.Root_Password;

      const Image = req.file ? req.file.filename : oldData.Image;

      // delete old image if new uploaded
      if (req.file && oldData.Image) {
        const oldImagePath = path.join(__dirname, "../../upload/", oldData.Image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log("Old image delete error:", err);
        });
      }

      const updateQuery = `
        UPDATE tbl_tickets 
        SET 
          Subject = ?, 
          Status = ?, 
          Image = ?, 
          Description = ?,
          IP_Address = ?,
          Root_Password = ?
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [
          Subject,
          Status,
          Image,
          Description,
          IP_Address,
          Root_Password,
          id,
        ],
        (err2, data) => {
          if (err2)
            return res.status(500).json({ message: err2.message });

          res.status(200).json({
            message: "Ticket Updated Successfully",
            updated: data.affectedRows,
          });
        }
      );
    });
  } catch (error) {
    return  res.status(500).json({ message: error.message });
  }
};


exports.DeleteTicket = async (req, res) => {
  try {
    const id = req.params.id;

    const getImageQuery = "SELECT Image FROM tbl_tickets WHERE id = ?";
    db.query(getImageQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Ticket not found" });

      const imageName = result[0].Image;

      const deleteQuery = "DELETE FROM tbl_tickets WHERE id = ?";
      db.query(deleteQuery, [id], (err2, data) => {
        if (err2) return res.status(500).json({ message: err2.message });

        if (imageName) {
          const imagePath = path.join(__dirname, "../../upload/", imageName);
          fs.unlink(imagePath, (errrr) => {
            if (errrr) res.status(404).json({ message: errrr });
          });
        }

        res.status(200).json({ message: "Ticket Deleted Successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.GetTicketWithChat = async (req, res) => {
  try {
    const id = req.params.id;

    const ticketQuery = "SELECT * FROM tbl_tickets WHERE id=?";
    const chatQuery =
      "SELECT * FROM tbl_ticket_chats WHERE ticket_id=? ORDER BY id DESC";

    db.query(ticketQuery, [id], (err, ticket) => {
      if (err) return res.status(500).json({ message: err.message });
      if (ticket.length === 0)
        return res.status(404).json({ message: "Ticket not found" });

      db.query(chatQuery, [id], (err2, chats) => {
        if (err2) return res.status(500).json({ message: err2.message });

        res.status(200).json({
          ticket: ticket[0],
          chats: chats,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.AddTicketChat = async (req, res) => {
  try {
    const { ticket_id, description, sender,sender_name } = req.body;

    if (!ticket_id || !description ) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!sender || !sender_name) {
      return res.status(400).json({ message: "sender is required" });
    }
    const image = req.file ? req.file.filename : "";
    const created_on = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const insertQuery = `
      INSERT INTO tbl_ticket_chats
      (ticket_id, description, image, sender, sender_name, created_on)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [ticket_id, description, image, sender, sender_name, created_on],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        res.status(201).json({
          message: "Chat added",
          chat: result,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.DeleteChat = async (req,res) => {
try {
  const id = req.params.id;

  const chatQuery = "SELECT * FROM tbl_ticket_chats WHERE id = ?";
  const deleteQuery = "DELETE FROM tbl_ticket_chats WHERE id = ?";

  db.query(chatQuery, [id],(err,result)=>{
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0) return res.status(404).json({ message: "No Match id" });
    const image = result[0].image;

    db.query(deleteQuery, [id], (err2, deleteChat) => {
      if (err2) return res.status(500).json({ message: err2.message }); 
      if (image) {
        const imagePath = path.join(__dirname, "../../upload/", image);
        fs.unlink(imagePath, (err3) => {
          if (err3) res.status(404).json({ message: err3 });
        });
      } 
      res.status(200).json({ message: "Chat Deleted Successfully" });
    });
  })
} catch (error) {
  res.status(500).json({ message: error.message });
}
  

}