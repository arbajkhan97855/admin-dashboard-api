const db = require("../../config/db");

exports.GetinvoiceCompany = (req, res) => {
  const query = "SELECT * FROM tbl_manage_company";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(result);
  });
};

exports.SingleinvoiceCompany = (req, res) => {
  const id = req.params.id;

  const companyQuery = "SELECT * FROM tbl_manage_company WHERE id = ?";
  db.query(companyQuery, [id], (err, Result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (Result.length === 0) {
      return res.status(404).json({ message: "SMTP not found" });
    }
    const company = Result[0];
    res.status(200).json(company);
  });
};

exports.CreateinvoiceCompany = (req, res) => {
  let {
    Company_Name,
    Company_Email,
    Company_Phone,
    Company_Address,
  } = req.body;

  if (
    !Company_Name ||
    !Company_Email ||
    !Company_Phone ||
    !Company_Address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  /*  TRIM STRINGS */
  
  Company_Name = 	Company_Name.trim();
  Company_Email = Company_Email.trim();
  Company_Phone = Company_Phone.trim();
  Company_Address = Company_Address.trim();
 
  /*  DUPLICATE SMTP CHECK */
  const checkDuplicate =
    "SELECT * FROM tbl_manage_company WHERE Company_Email = ? ";

  db.query(checkDuplicate, [Company_Email], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });

    if (existing.length > 0) {
      return res.status(409).json({ message: "invoice company already exists" });
    }

    const InvoiceCompany = `
        INSERT INTO tbl_manage_company (
        Company_Name,
        Company_Email,
        Company_Phone,
        Company_Address
        ) VALUES (?,?,?,?)
      `;

    db.query(
        InvoiceCompany,
      [
        Company_Name,
        Company_Email,
        Company_Phone,
        Company_Address,
      ],
      (err2, result2) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.status(201).json({
          message: "Created successfully",
          inserted: result2.affectedRows,
        });
      }
    );
  });
};

exports.UpdateinvoiceCompany = (req, res) => {
  const id = req.params.id;
  let {
    Company_Name,
    Company_Email,
    Company_Phone,
    Company_Address
  } = req.body;

  if (
    !Company_Name ||
    !Company_Email ||
    !Company_Phone ||
    !Company_Address
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  /*  TRIM STRINGS */
  Company_Name = Company_Name.trim();
  Company_Email = Company_Email.trim();
  Company_Phone = Company_Phone.trim();
  Company_Address = Company_Address.trim();

  const Query =
    "SELECT * FROM tbl_manage_company WHERE id = ? ";
  const updateSMTP = `
  UPDATE tbl_manage_company SET
     Company_Name = ?, 
    Company_Email = ?, Company_Phone = ?, Company_Address = ? 
    WHERE id = ?
`;
  db.query(Query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "company not found" });

    db.query(
      updateSMTP,
      [
        Company_Name,
        Company_Email,
        Company_Phone,
        Company_Address,
        id,
      ],
      (err2, result2) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.status(201).json({
          message: "updated successfully",
          updated: result2.affectedRows,
        });
      }
    );
  });
};

exports.DeleteinvoiceCompany = (req, res) => {
  const id = req.params.id;

  const deleteQuery = "DELETE FROM tbl_manage_company WHERE id = ?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "invoice company not found" });

    res.json({ message: "deleted successfully", deleted: result.affectedRows });
  });
};
