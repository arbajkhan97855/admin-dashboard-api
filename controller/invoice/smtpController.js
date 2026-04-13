const db = require("../../config/db");

exports.GetSMTP = (req, res) => {
  const query = "SELECT * FROM tbl_manage_smtp";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(result);
  });
};

exports.SingleSMTP = (req, res) => {
  const id = req.params.id;

  const smtpQuery = "SELECT * FROM tbl_manage_smtp WHERE id = ?";
  db.query(smtpQuery, [id], (err, Result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (Result.length === 0) {
      return res.status(404).json({ message: "SMTP not found" });
    }
    const SMTP = Result[0];
    res.status(200).json(SMTP);
  });
};

exports.CreateSMTP = (req, res) => {
  let {
    Title,
    SMTP_Host,
    SMTP_Username,
    SMTP_Password,
    SMTP_Status,
  } = req.body;

  if (
    !Title ||
    !SMTP_Host ||
    !SMTP_Username ||
    !SMTP_Password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // TRIM STRINGS
  Title = Title.trim();
  SMTP_Username = SMTP_Username.trim();
  SMTP_Password = SMTP_Password.trim();

  SMTP_Status = SMTP_Status === "Active" || SMTP_Status === 1 ? 1 : 0;

  // DUPLICATE CHECK
  const checkDuplicate =
    "SELECT id FROM tbl_manage_smtp WHERE SMTP_Username = ?";

  db.query(checkDuplicate, [SMTP_Username], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });

    if (existing.length > 0) {
      return res.status(409).json({ message: "SMTP already exists" });
    }

    const insertQuery = `
      INSERT INTO tbl_manage_smtp (
        Title,
        SMTP_Host,
        SMTP_Username,
        SMTP_Password,
        SMTP_Status
      ) VALUES (?,?,?,?,?)
    `;

    db.query(
      insertQuery,
      [
        Title,
        SMTP_Host,
        SMTP_Username,
        SMTP_Password,
        SMTP_Status,
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

exports.UpdateSMTP = (req, res) => {
  const id = req.params.id;
  let {
    Title,
    SMTP_Host,
    SMTP_Username,
    SMTP_Password,
    SMTP_Status
  } = req.body;

  if (
    !Title ||
    !SMTP_Host ||
    !SMTP_Username ||
    !SMTP_Password ||
    !SMTP_Status 
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  /*  TRIM STRINGS */
  Title = Title.trim();
  SMTP_Username = SMTP_Username.trim();
  SMTP_Password = SMTP_Password.trim();


  const smtpQuery =
    "SELECT * FROM tbl_manage_smtp WHERE id = ? ";
  const updateSMTP = `
  UPDATE tbl_manage_smtp SET
    Title = ?, SMTP_Host = ?, SMTP_Username = ?,
    SMTP_Password = ?, SMTP_Status = ? 
    WHERE id = ?
`;
  db.query(smtpQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "smtp not found" });

    db.query(
      updateSMTP,
      [
        Title,
        SMTP_Host,
        SMTP_Username,
        SMTP_Password,
        SMTP_Status,
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

exports.DeleteSMTP = (req, res) => {
  const id = req.params.id;

  const deleteQuery = "DELETE FROM tbl_manage_smtp WHERE id = ?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "SMTP not found" });

    res.json({ message: "deleted successfully", deleted: result.affectedRows });
  });
};
