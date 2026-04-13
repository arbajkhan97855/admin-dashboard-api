const db = require("../../config/db");

exports.GetBranch = async (req, res) => {
  try {
    const Alldata = "SELECT * FROM branch";
    db.query(Alldata, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleBranch = async (req, res) => {
  try {
    const id = req.params.id;
    const data = "SELECT * FROM branch WHERE id = ?";
    db.query(data, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "branch not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateBranch = async (req, res) => {
  try {
    const {
      Company_name,
      Branch_name,
      Address,
      City,
      Country,
      Mobile,
      Status,
    } = req.body;
    if (
      !Company_name ||
      !Branch_name ||
      !Address ||
      !City ||
      !Country ||
      !Mobile ||
      !Status
    ) {
      return res.status(400).json({ message: "All Field Requide" });
    }
    //  check validation
    const findbranch =
      "SELECT * FROM branch WHERE Company_name = ? AND Branch_name = ?";
    const Company_Name = Company_name.trim();
    const Branch_Name = Branch_name.trim();
    db.query(findbranch, [Company_Name, Branch_Name], (err, branch) => {
      if (err) return res.status(500).json({ message: err.message });
      if (branch.length > 0)
        return res.status(404).json({ message: "Branch Allready Add" });

      const inseltdata =
        "INSERT INTO branch ( Company_name , Branch_name ,Address,City , Country, Mobile ,Status) VALUES (?,?,?,?,?,?,?)";
      db.query(
        inseltdata,
        [Company_Name, Branch_Name, Address, City, Country, Mobile, Status],
        (err2, result) => {
          if (err2) return res.status(500).json({ message: err2.message });
          res.status(201).json({ message: "Create Branch Successfull",  inserted: result.affectedRows });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.UpdateBranch = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      Company_name,
      Branch_name,
      Address,
      City,
      Country,
      Mobile,
      Status,
    } = req.body;

    // check dublicate company
    const findbranch =
      "SELECT * FROM branch WHERE Company_name = ? AND  Branch_name = ? AND id != ?";
    const Company_Name = Company_name.trim();
    const Branch_Name = Branch_name.trim();
    db.query(findbranch, [Company_Name, Branch_Name, id], (err, branch) => {
      if (err) return res.status(500).json({ message: err.message });
      if (branch.length > 0)
        return res.status(400).json({ message: "Branch Allready Add" });

      //  update branch
      const updatedata =
        "UPDATE branch SET Company_name = ?, Branch_name = ?, Address = ? , City = ?, Country = ?,  Mobile = ?, Status = ? WHERE id = ?";

      db.query(
        updatedata,
        [Company_Name, Branch_Name, Address, City, Country, Mobile, Status, id],
        (err2, result) => {
          if (err2) return res.status(500).json({ message: err2.message });
          res.status(201).json({ message: "Update Branch Successfully" });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.DeleteBranch = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM branch WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Branch Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
