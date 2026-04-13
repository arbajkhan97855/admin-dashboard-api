const db = require("../../config/db");

exports.GetAllService = (req, res) => {
  const query = "SELECT * FROM tbl_api_services";

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(result);
  });
};

exports.SingleService = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM tbl_api_services WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(result);
  });
};

exports.CreateService = (req, res) => {
  const { api_name, api_type, isactive, created_on } = req.body;

  if (!api_name || !api_type || !isactive) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ApiName = api_name.trim();
  const Status = isactive === "Active" ? 1 : 0;

  // Check duplicate API name
  const checkQuery = "SELECT id FROM tbl_api_services WHERE api_name = ?";
  db.query(checkQuery, [ApiName], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });

    if (existing.length > 0) {
      return res.status(409).json({ message: "API name already exists" });
    }

    const insertQuery = `
      INSERT INTO tbl_api_services (api_name, api_type, isactive, created_on)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [ApiName, api_type, Status, created_on],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        res
          .status(201)
          .json({
            message: "Api created successfully",
            inserted: result.affectedRows,
          });
      }
    );
  });
};

exports.UpdateService = (req, res) => {
  const { id } = req.params;
  const { api_name, api_type, isactive } = req.body;

  if (!api_name || !api_type || !isactive) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ApiName = api_name.trim();
  const Status = isactive === "Active" ? 1 : 0;

  // Check duplicate API name
  const checkQuery =
    "SELECT id FROM tbl_api_services WHERE api_name = ? AND id != ?";

  db.query(checkQuery, [ApiName, id], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });

    if (existing.length > 0) {
      return res.status(409).json({ message: "API name already exists" });
    }

    const updateQuery = `
      UPDATE tbl_api_services
      SET api_name = ?, api_type = ?, isactive = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [ApiName, api_type, Status, id], (err, updated) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(200).json({ message: "Api updated successfully" });
    });
  });
};

exports.DeleteService = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM tbl_api_services WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Api deleted successfully" });
  });
};
