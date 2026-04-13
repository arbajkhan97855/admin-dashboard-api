const db = require("../../config/db");
const nodemailer = require("nodemailer");
require("dotenv/config");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

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

  if (!smtp_title || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!file) {
    return res.status(400).json({ message: "Invoice PDF missing" });
  }

  const invoiceQuery = "SELECT * FROM tbl_invoice WHERE id = ?";
  const SMTPQuery = "SELECT * FROM tbl_manage_smtp WHERE Title = ?";

  db.query(invoiceQuery, [id], (err, invoiceResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!invoiceResult.length)
      return res.status(404).json({ message: "Invoice not found" });

    const invoice = invoiceResult[0];
    const Invoice_Date = invoice.Invoice_Date
      ? invoice.Invoice_Date.toISOString().split("T")[0]
      : "";
    const Due_Date = invoice.Due_Date
      ? invoice.Due_Date.toISOString().split("T")[0]
      : "";

    db.query(SMTPQuery, [smtp_title], async (err2, smtpResult) => {
      if (err2) return res.status(500).json({ message: err2.message });
      if (!smtpResult.length)
        return res.status(404).json({ message: "SMTP not found" });

      const smtp = smtpResult[0];

      try {
        const transporter = nodemailer.createTransport({
          host: smtp.SMTP_Host,
          port: 465,
          secure: true,
          auth: {
            user: smtp.SMTP_Username,
            pass: smtp.SMTP_Password,
          },
        });

        await transporter.sendMail({
          from: smtp.SMTP_Username,
          to: invoice.Email,
          subject: `Invoice ${invoice.Invoice_Number}`,
          html: `
            <p>Hello ${invoice.Client_Name},</p>
            <p>${message}</p></hr>
            <p>
              <b>Invoice Details</b>
              <div style="display:flex;justifyContent:space-between;gap:5px"> 
                     <span>
                  <p>Invoice Number: ${invoice.Invoice_Number}</p>
                  <p>Date: ${Invoice_Date}</p>
              </span>
              <span>
                  <p>Invoice Payment: ${invoice.Grand_Total}</p>
                  <p>Due_Date: ${Due_Date}</p>
              </span>
              </div>
             
              
                      
            </p>
          `,
          attachments: [
            {
              filename: file.originalname,
              path: file.path,
            },
          ],
        });

        return res.json({ message: "Invoice email sent successfully" });
      } catch (errMail) {
        console.error(errMail);
        return res.status(500).json({ message: "Email sending failed" });
      }
    });
  });
};

exports.GenerateInvoicePDF = async (req, res) => {
  const id = req.params.id;

  const invoiceQuery = "SELECT * FROM tbl_invoice WHERE id = ?";
  db.query(invoiceQuery, [id], (err, invoiceResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!invoiceResult.length)
      return res.status(404).json({ message: "Invoice not found" });

    const invoice = invoiceResult[0];
    const Invoice_Date = invoice.Invoice_Date
      ? invoice.Invoice_Date.toISOString().split("T")[0]
      : "";
    const Due_Date = invoice.Due_Date
      ? invoice.Due_Date.toISOString().split("T")[0]
      : "";

    const itemsQuery =
      "SELECT * FROM tbl_invoice_items WHERE Invoice_Number = ?";
    db.query(itemsQuery, [invoice.Invoice_Number], async (err2, items) => {
      if (err2) return res.status(500).json({ message: err2.message });

      try {
        const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Invoice</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;font-size:14px;color:#222">

<table width="800" align="center" cellspacing="0" cellpadding="0" style="background:#fff;border:1px solid #ddd;border-collapse:collapse;margin:20px auto">

<!-- HEADER -->
<tr>
<td style="padding:40px 24px">
<table width="100%">
<tr>
<td>
<img src="http://localhost:4000/upload/${invoice.Logo}" style="height:90px" />
</td>
<td align="right">
<div style="font-size:22px;font-weight:bold;margin-bottom:10px">INVOICE</div>

<table align="right" cellspacing="0" cellpadding="0" style="border:1px solid #ccc;font-size:13px">
<tr>
<td style="padding:6px;background:#f1f1f1;font-weight:500">INVOICE NO</td>
<td style="padding:6px">${invoice.Invoice_Number}</td>
</tr>
<tr>
<td style="padding:6px;background:#f1f1f1;font-weight:500">INVOICE DATE</td>
<td style="padding:6px">${Invoice_Date}</td>
</tr>
<tr>
<td style="padding:6px;background:#f1f1f1;font-weight:500">DUE DATE</td>
<td style="padding:6px">${Due_Date}</td>
</tr>
</table>

</td>
</tr>
</table>
</td>
</tr>

<!-- BILLING -->
<tr>
<td style="padding:24px">
<table width="100%">
<tr>
<td valign="top">
<b>Billed From</b><br/>
${invoice.S_Name}<br/>
${invoice.S_Email}<br/>
${invoice.S_Phone}<br/>
${invoice.S_Address}
</td>

<td valign="top" align="right">
<b>Billed To</b><br/>
${invoice.Client_Name}<br/>
${invoice.Email}<br/>
${invoice.Phone}<br/>
${invoice.Address}<br/><br/>

<span style="border:1px solid #d32f2f;color:#d32f2f;padding:6px 18px;border-radius:4px">
${invoice.Status}
</span>
</td>
</tr>
</table>
</td>
</tr>

<!-- ITEMS -->
<tr>
<td style="padding:24px">
<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #ccc">

<tr style="background:#f1f1f1;font-weight:bold">
<th style="padding:10px;border:1px solid #ccc">Description</th>
<th style="padding:10px;border:1px solid #ccc">Qty</th>
<th style="padding:10px;border:1px solid #ccc">Rate</th>
<th style="padding:10px;border:1px solid #ccc">Amount</th>
</tr>

${items
  .map(
    (item) => `
<tr>
<td style="padding:10px;border:1px solid #ccc">${item.Description}</td>
<td style="padding:10px;border:1px solid #ccc">${item.Qty}</td>
<td style="padding:10px;border:1px solid #ccc">${item.Rate}</td>
<td style="padding:10px;border:1px solid #ccc">${item.Total}</td>
</tr>
`
  )
  .join("")}

<tr style="background:#f1f1f1;font-weight:bold">
<td colspan="3" align="right" style="padding:10px;border:1px solid #ccc">
Grand Total
</td>
<td style="padding:10px;border:1px solid #ccc">
${invoice.Grand_Total} INR
</td>
</tr>

</table>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:24px">
<b>Terms & Conditions</b><br/>
Please visit <a href="https://www.amazingweb.design">www.amazingweb.design</a>
</td>
</tr>

</table>

</body>
</html>
        `;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfDir = path.join(__dirname, "../../upload/pdf");
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

        const pdfName = `invoice_${invoice.Invoice_Number}.pdf`;
        const pdfPath = path.join(pdfDir, pdfName);

        await page.pdf({
          path: pdfPath,
          format: "A4",
          printBackground: true,
        });

        await browser.close();

        db.query(
          "UPDATE tbl_invoice SET Pdf_File=? WHERE id=?",
          [pdfName, id],
          () => {
            res.json({
              message: "Invoice PDF generated successfully",
              pdf: pdfName,
            });
          }
        );
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "PDF generation failed" });
      }
    });
  });
};
