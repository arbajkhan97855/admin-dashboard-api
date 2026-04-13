const db = require("../../config/db");

exports.GetDetails = async (req, res) => {
  try {
    const id = req.params.service_id;
    const AllDetails = "SELECT * FROM tbl_api_detail WHERE service_id = ?";
    db.query(AllDetails, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const Details = "SELECT * FROM tbl_api_detail WHERE id = ?";
    db.query(Details, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateDetails = async (req, res) => {
  try {
    const id = req.params.service_id;
    const { txt_name, txt_value, isActive } = req.body;

    if (!txt_name || !txt_value || !isActive) {
      return res.status(400).json({ message: "All Field Requide" });
    }

    const Txt_name = txt_name.trim();
    const Txt_value = txt_value.trim();
    const Status = isActive === "Active" ? 1 : 0;

    const checkQuery =
      "SELECT * FROM tbl_api_detail WHERE txt_name = ?  AND txt_value = ?";

    db.query(checkQuery, [Txt_name, Txt_value], (err, existing) => {
      if (err) return res.status(500).json({ message: err.message });
      if (existing.length > 0)
        return res
          .status(404)
          .json({ message: "Text Name And Value Allready Add" });

      const addDetailsquery = `
        INSERT INTO tbl_api_detail
        (txt_name, txt_value, isActive, service_id )
        VALUES (?, ?, ?, ?)
      `;
      db.query(
        addDetailsquery,
        [Txt_name, Txt_value, Status, id],
        (err, result) => {
          if (err) return res.status(500).json({ message: err });
          res
            .status(201)
            .json({
              message: "Create Details Successfull",
              inserted: result.affectedRows,
            });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.UpdateDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const { txt_name, txt_value, isActive } = req.body;

    const Txt_name = txt_name.trim();
    const Txt_value = txt_value.trim();
    const Status = isActive == "Active" ? 1 : 0;
    // check dublicate
    const checkQuery =
      "SELECT * FROM tbl_api_detail WHERE Txt_name = ? AND id != ?";
    db.query(checkQuery, [Txt_name, id], (err, existing) => {
      if (err) return res.status(500).json({ message: err.message });
      if (existing.length > 0)
        return res.status(400).json({ message: "Text Name Allready Add" });

      const updatedata =
        "UPDATE tbl_api_detail SET txt_name = ?, txt_value = ?, isActive = ? WHERE id = ?";
      db.query(updatedata, [Txt_name, Txt_value, Status, id], (err, result) => {
        if (err) return res.status(500).json({ message: err });
        res.status(201).json({ message: "Update Details Successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.DeleteDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM tbl_api_detail WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Detail Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
