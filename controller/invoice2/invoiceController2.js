const db = require("../../config/db");
const nodemailer = require("nodemailer");
require("dotenv/config");
const fs = require("fs");
const path = require("path");

exports.CreateInvoice = async (req, res) => {
  let {
    Invoice_Number,
    Invoice_Date,
    Due_Date,
    Client_Name,
    Email,
    Phone,
    Address,
    S_Name,
    S_Email,
    S_Phone,
    S_Address,
    Status,
    Payment_Method,
    Grand_Total,
    items,
  } = req.body;

  /*  PARSE ITEMS (FormData sends string) */
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (err) {
      return res.status(400).json({ message: "Invalid items format" });
    }
  }

  const Logo = req.file ? req.file.filename : "";

  /*  REQUIRED FIELD VALIDATION */
  if (
    !Invoice_Number ||
    !Invoice_Date ||
    !Due_Date ||
    !Client_Name ||
    !Email ||
    !Phone ||
    !Address ||
    !S_Name ||
    !S_Email ||
    !S_Phone ||
    !S_Address ||
    !Status ||
    !Payment_Method ||
    Grand_Total === undefined ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  /*  TRIM STRINGS */
  Invoice_Number = Invoice_Number.trim();
  Client_Name = Client_Name.trim();
  Email = Email.trim();
  Phone = Phone.trim();
  Address = Address.trim();
  Status = Status.trim();
  Payment_Method = Payment_Method.trim();
  S_Name = S_Name.trim();
  S_Email = S_Email.trim();
  S_Phone = S_Phone.trim();
  S_Address = S_Address.trim();

  /*  DUPLICATE INVOICE CHECK */
  const checkDuplicate = "SELECT id FROM tbl_invoice WHERE Invoice_Number = ?";

  db.query(checkDuplicate, [Invoice_Number], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });

    if (existing.length > 0) {
      return res.status(409).json({ message: "Invoice number already exists" });
    }

    const insertInvoice = `
      INSERT INTO tbl_invoice (
        Invoice_Number, Invoice_Date, Due_Date, Client_Name,
        Email, Phone, Address, S_Name, S_Email, S_Phone,
        S_Address, Status, Payment_Method, Grand_Total, Logo
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.query(
      insertInvoice,
      [
        Invoice_Number,
        Invoice_Date,
        Due_Date,
        Client_Name,
        Email,
        Phone,
        Address,
        S_Name,
        S_Email,
        S_Phone,
        S_Address,
        Status,
        Payment_Method,
        Grand_Total,
        Logo,
      ],
      (err2) => {
        if (err2) return res.status(500).json({ message: err2.message });

        /*  INSERT ITEMS */
        const itemValues = items.map((item) => [
          item.description,
          item.qty,
          item.rate,
          item.total,
          Invoice_Number,
        ]);

        const insertItems = `
          INSERT INTO tbl_invoice_items
          (Description, Qty, Rate, Total, Invoice_Number)
          VALUES ?
        `;

        db.query(insertItems, [itemValues], (err3, result3) => {
          if (err3) return res.status(500).json({ message: err3.message });

          res.status(201).json({
            message: "Invoice created successfully",
            inserted: result3.affectedRows,
          });
        });
      }
    );
  });
};

exports.GetInvoice = (req, res) => {
  const query = "SELECT * FROM tbl_invoice";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(result);
  });
};

exports.SingleInvoice = (req, res) => {
  const id = req.params.id;

  const invoiceQuery = "SELECT * FROM tbl_invoice WHERE id = ?";
  db.query(invoiceQuery, [id], (err, invoiceResult) => {
    if (err) return res.status(500).json({ message: err.message });

    if (invoiceResult.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = invoiceResult[0];

    const itemsQuery =
      "SELECT * FROM tbl_invoice_items WHERE Invoice_Number = ?";

    db.query(itemsQuery, [invoice.Invoice_Number], (err2, itemsResult) => {
      if (err2) return res.status(500).json({ message: err2.message });

      res.status(200).json({
        invoice,
        items: itemsResult,
      });
    });
  });
};

exports.UpdateInvoice = (req, res) => {
  const id = req.params.id;

  let {
    Invoice_Number,
    Invoice_Date,
    Due_Date,
    Client_Name,
    Email,
    Phone,
    Address,
    S_Name,
    S_Email,
    S_Phone,
    S_Address,
    Status,
    Payment_Method,
    Grand_Total,
    items,
  } = req.body;

  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      return res.status(400).json({ message: "Invalid items format" });
    }
  }

  if (
    !Invoice_Number ||
    !Invoice_Date ||
    !Due_Date ||
    !Client_Name ||
    !Email ||
    !Phone ||
    !Address ||
    !S_Name ||
    !S_Email ||
    !S_Phone ||
    !S_Address ||
    !Status ||
    !Payment_Method ||
    Grand_Total === undefined ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const FetchQuery = "SELECT * FROM tbl_invoice WHERE id = ?";
  db.query(FetchQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Invoice not found" });

    const oldImage = result[0].Logo;

    const Image = req.file ? req.file.filename : oldImage;

    if (req.file && oldImage) {
      const oldImagePath = path.join(__dirname, "../../upload/", oldImage);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("Old image delete error:", err);
      });
    }

    const updateInvoice = `
    UPDATE tbl_invoice SET
      Invoice_Number = ?, Invoice_Date = ?, Due_Date = ?,
      Client_Name = ?, Email = ?, Phone = ?, Address = ?, S_Name = ?,
     S_Email = ?, S_Phone = ?, S_Address = ?,
      Status = ?, Payment_Method = ?, Grand_Total = ?, Logo = ?
    WHERE id = ?
  `;

    db.query(
      updateInvoice,
      [
        Invoice_Number,
        Invoice_Date,
        Due_Date,
        Client_Name,
        Email,
        Phone,
        Address,
        S_Name,
        S_Email,
        S_Phone,
        S_Address,
        Status,
        Payment_Method,
        Grand_Total,
        Image,
        id,
      ],
      (err) => {
        if (err) return res.status(500).json({ message: err.message });

        const deleteItems =
          "DELETE FROM tbl_invoice_items WHERE Invoice_Number = ?";

        db.query(deleteItems, [Invoice_Number], (err2) => {
          if (err2) return res.status(500).json({ message: err2.message });

          if (items.length === 0) {
            return res.json({ message: "Invoice updated successfully" });
          }

          const itemValues = items.map((item) => [
            item.description,
            item.qty,
            item.rate,
            item.total,
            Invoice_Number,
          ]);

          const insertItems = `
          INSERT INTO tbl_invoice_items
          (Description, Qty, Rate, Total, Invoice_Number)
          VALUES ?
        `;

          db.query(insertItems, [itemValues], (err3) => {
            if (err3) return res.status(500).json({ message: err3.message });

            res.status(200).json({ message: "Invoice updated successfully" });
          });
        });
      }
    );
  });
};

exports.DeleteInvoice = (req, res) => {
  const id = req.params.id;

  const getInvoice = "SELECT Invoice_Number FROM tbl_invoice WHERE id = ?";
  const deleteInvoice = "DELETE FROM tbl_invoice WHERE id = ?";
  const deleteInvoiceItem =
    "DELETE FROM tbl_invoice_items WHERE Invoice_Number = ?";
  db.query(getInvoice, [id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    if (rows.length === 0)
      return res.status(404).json({ message: "Invoice not found" });

    const invoiceNumber = rows[0].Invoice_Number;
    const invoiceLogo = rows[0].Logo;
    db.query(deleteInvoiceItem, [invoiceNumber], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });

      db.query(deleteInvoice, [id], (err3) => {
        if (err3) return res.status(500).json({ message: err3.message });
        if (invoiceLogo) {
          const imagePath = path.join(__dirname, "../../upload/", invoiceLogo);
          fs.unlink(imagePath, (errrr) => {
            if (errrr) res.status(404).json({ message: errrr });
          });
        }

        res.status(200).json({ message: "Invoice deleted successfully" });
      });
    });
  });
};

exports.SendInvoice = (req, res) => {
  const id = req.params.id;
  const { smtp_title, message } = req.body;
  const file = req.file;

  if (!message || !smtp_title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const invoiceQuery = "SELECT * FROM tbl_invoice WHERE id = ?";
  const SMTPQuery = "SELECT * FROM tbl_manage_smtp WHERE Title = ?";

  db.query(invoiceQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = result[0];

    db.query(SMTPQuery, [smtp_title], async (err2, result2) => {
      if (err2) return res.status(500).json({ message: err2.message });

      if (result2.length === 0) {
        return res.status(404).json({ message: "SMTP not found" });
      }

      const smtp = result2[0]; 

      try {
        const transporter = nodemailer.createTransport({
          host: smtp.SMTP_Host,
          port:  465,
          secure: true,
          auth: {
            user: smtp.SMTP_Username,
            pass: smtp.SMTP_Password,
          },
        });


        let attachments = [];

        if (file) {
          const filePath = path.join(__dirname, "../../upload/emailAttachments", file.filename);
          const fileBuffer = fs.readFileSync(filePath);
      
          attachments.push({
            filename: file.originalname,
            content: fileBuffer,
            contentType: file.mimetype,
            encoding: "base64",
          });
        }


        const mailOptions = {
          from: invoice.S_Email,
          to: invoice.Email,
          subject: `Invoice Message`,
          html: `
            <p>Hello ${invoice.Client_Name},</p>
            <p>${message}</p>
            <hr/>
            <p>
              <b>Invoice Details</b><br/>
              Invoice Number: ${invoice.Invoice_Number}<br/>
              Invoice Date: ${invoice.Invoice_Date || "-"}
            </p>
          `,
         attachments: attachments,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
          message: "Email sent successfully",
        });
      } catch (mailErr) {
        console.error(mailErr);
        return res.status(500).json({
          message: "Failed to send email",
        });
      }
    });
  });
};

