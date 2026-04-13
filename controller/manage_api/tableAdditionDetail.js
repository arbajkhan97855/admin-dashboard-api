const db = require("../../config/db");

// GetExtraDetail API
exports.GetExtraDetail = async (req, res) => {
  try {
    const serviceId = req.params.service_id;

    const ServiceTableQuery = "SELECT * FROM tbl_api_services WHERE id = ?";
    const DetailTableQuery =
      "SELECT * FROM tbl_api_detail WHERE service_id = ?";
    const ExtraDetailTableQuery =
      "SELECT * FROM tbl_api_addition_detail WHERE service_id = ?";
    const MemberTableQuery =
      "SELECT * FROM tbl_member_api_detail WHERE service_id = ?";

    db.query(ServiceTableQuery, [serviceId], (err1, serviceResult) => {
      if (err1) return res.status(500).json({ message: err1.message });
      if (serviceResult.length === 0)
        return res.status(404).json({ message: "Service not found" });

      db.query(DetailTableQuery, [serviceId], (err2, detailResult) => {
        if (err2) return res.status(500).json({ message: err2.message });
        if (detailResult.length === 0)
          return res.status(404).json({ message: "Details not found" });

        db.query(MemberTableQuery, [serviceId], (err3, memberResult) => {
          if (err3) return res.status(500).json({ message: err3.message });

          db.query(
            ExtraDetailTableQuery,
            [serviceId],
            (err4, extraDetailResult) => {
              if (err4) return res.status(500).json({ message: err4.message });

              res.status(200).json({
                detail: detailResult,
                ExtraDetail: extraDetailResult,
                Memberdata: memberResult,
              });
            }
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CreateExtraDetails API
exports.CreateExtraDetails = async (req, res) => {
  try {
    const serviceId = req.params.service_id;
    const { details, mode, currency, type, isActive } = req.body;

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ message: "Details are required" });
    }

    const extraValues = details.map((item) => [
      serviceId,
      item.field_id,
      item.Name,
      item.value || "",
    ]);

    const statusValue = isActive == "Active" ? 1 : 0;

    const deleteExtraQuery =
      "DELETE FROM tbl_api_addition_detail WHERE service_id = ?";
    const deleteMemberQuery =
      "DELETE FROM tbl_member_api_detail WHERE service_id = ?";
    const insertExtraQuery = `
      INSERT INTO tbl_api_addition_detail (service_id, field_id, Name, value)
      VALUES ?
    `;
    const insertMemberQuery = `
      INSERT INTO tbl_member_api_detail (service_id, mode, currency, type, isActive)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Delete old records first
    db.query(deleteExtraQuery, [serviceId], (err) => {
      if (err) return res.status(500).json({ message: err.message });

      db.query(deleteMemberQuery, [serviceId], (err) => {
        if (err) return res.status(500).json({ message: err.message });

        // Insert new extra details
        db.query(insertExtraQuery, [extraValues], (err1, result1) => {
          if (err1) return res.status(500).json({ message: err1.message });

          // Insert member table data
          db.query(
            insertMemberQuery,
            [serviceId, mode, currency, type, statusValue],
            (err2, result2) => {
              if (err2) return res.status(500).json({ message: err2.message });

              return res.status(200).json({
                message: "Saved successfully",
                inserted: result1.affectedRows,
                memInserted: result2.affectedRows,
              });
            }
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
