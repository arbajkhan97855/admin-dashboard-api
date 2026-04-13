const db = require("../../config/db");

exports.GetCompany = async (req, res) => {
  try {
    const Alldata = "SELECT * FROM company";
    db.query(Alldata, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const data = "SELECT * FROM company WHERE id = ?";
    db.query(data, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "company not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateCompany = async (req, res) => {
  try {
    const {
      Company_Name,
      Address,
      Address_1,
      Country,
      State,
      PostCode,
      Email,
      City,
      Website,
      Alt_Email,
      Mobile,
      Landline,
      Fax,
    } = req.body;

    if (
      !Company_Name ||
      !Address ||
      !Address_1 ||
      !Country ||
      !State ||
      !PostCode ||
      !Email ||
      !City ||
      !Website ||
      !Alt_Email ||
      !Mobile ||
      !Landline ||
      !Fax
    ) {
      return res.status(400).json({ message: "All Field Requide" });
    }

    // check dublicate company
    const findcompany = "SELECT * FROM company WHERE Company_Name = ?";
    const Company_name = Company_Name.trim();
    db.query(findcompany, [Company_name], (err, company) => {
      if (err) return res.status(500).json({ message: err.message });
      if (company.length > 0)
        return res.status(404).json({ message: "Company Allready Add" });

      // insert company
      const inseltdata =
        "INSERT INTO company (Company_Name, Address, Address_1 , Country, State, PostCode,Email ,City, Website, Alt_Email ,Mobile, Landline, Fax) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
      db.query(
        inseltdata,
        [
          Company_name,
          Address,
          Address_1,
          Country,
          State,
          PostCode,
          Email,
          City,
          Website,
          Alt_Email,
          Mobile,
          Landline,
          Fax,
        ],
        (err2, result) => {
          if (err2) return res.status(500).json({ message: err2.message });
          res.status(201).json({ message: "Create Company Successfull" });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.UpdateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      Company_Name,
      Address,
      Address_1,
      Country,
      State,
      PostCode,
      Email,
      City,
      Website,
      Alt_Email,
      Mobile,
      Landline,
      Fax,
    } = req.body;

    // check dublicate company
    const findcompany =
      "SELECT * FROM company WHERE Company_Name = ? AND id != ?";
    const Company_name = Company_Name.trim();
    db.query(findcompany, [Company_name, id], (err, company) => {
      if (err) return res.status(500).json({ message: err.message });
      if (company.length > 0)
        return res.status(400).json({ message: "Company Allready Add" });

      // update company
      const updatedata =
        "UPDATE company SET Company_Name = ?, Address = ?, Address_1 = ? , Country = ?, State = ?, PostCode = ?,Email = ?,City = ?, Website = ?, Alt_Email = ?,Mobile = ?, Landline = ?, Fax = ? WHERE id = ?";

      db.query(
        updatedata,
        [
          Company_Name,
          Address,
          Address_1,
          Country,
          State,
          PostCode,
          Email,
          City,
          Website,
          Alt_Email,
          Mobile,
          Landline,
          Fax,
          id,
        ],
        (err2, result) => {
          if (err2) return res.status(500).json({ message: err2.message });
          res.status(201).json({ message: "update company Successfully" });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.DeleteCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM company WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Company Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
