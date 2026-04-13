exports.GetMemTbdata = async (req, res) => {
  try {
    const id = req.params.service_id;
    const AllData = "SELECT * FROM tbl_member_api_detail WHERE service_id = ?";
    db.query(AllData, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleMemTb = async (req, res) => {
  try {
    const id = req.params.id;
    const Singledata = "SELECT * FROM tbl_member_api_detail WHERE id = ?";
    db.query(Singledata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateMemTb = async (req, res) => {
  try {
    const id = req.params.service_id;
    const { mode, currency, type, member, isActive } = req.body;

    if (!mode || !currency || !type || !member) {
      return res.status(400).json({ message: "All Field Requide" });
    }

    const Status = isActive === "Active" ? 1 : 0;

    const addquery = `
        INSERT INTO tbl_member_api_detail 
        (mode, currency, type, member, isActive, service_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    db.query(
      addquery,
      [mode, currency, type, member, Status, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res
          .status(201)
          .json({
            message: "Create Successfull",
            inserted: result.affectedRows,
          });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.UpdateMemTb = async (req, res) => {
  try {
    const id = req.params.id;
    const { mode, currency, type, member, isActive } = req.body;
    const Status = isActive == "Active" ? 1 : 0;

    const updatedata =
      "UPDATE tbl_member_api_detail SET mode = ?, currency = ?, type = ?,  member = ?,  isActive = ? WHERE id = ?";
    db.query(
      updatedata,
      [mode, currency, type, member, Status, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Update Successfully" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.DeleteMemTb = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM tbl_member_api_detail WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
