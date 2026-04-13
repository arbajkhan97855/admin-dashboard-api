const db = require("../../config/db");

exports.GetEmployee = async(req, res) => {
  try {
    const Alldata = "SELECT * FROM employee";
    db.query(Alldata, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleEmployee = async(req, res) => {
  try {
    const id = req.params.id;
    const data = "SELECT * FROM employee WHERE id = ?";
    db.query(data, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "employee not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateEmployee = async(req, res) => {
  try {
    const {
      name,
      dob,
      Company,
      Branch,
      Department,
      Address,
      City,
      Country,
      Mobile,
    } = req.body;

    if (
      !name ||
      !dob ||
      !Company ||
      !Country ||
      !Branch ||
      !Department ||
      !Address ||
      !City ||
      !City ||
      !Country ||
      !Mobile ||
      !Mobile
    ) {
      return res.status(400).json({ message: "All Field Requide" });
    }

    // insert employee
    const inseltdata =
      "INSERT INTO employee ( name , dob ,Company,Branch , Department, Address ,City, Country, Mobile) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(
      inseltdata,
      [name, dob, Company, Branch, Department, Address, City, Country, Mobile],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Create Employee Successfull" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.UpdateEmployee = async(req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      dob,
      Company,
      Branch,
      Department,
      Address,
      City,
      Country,
      Mobile,
    } = req.body;
    const updatedata =
      "UPDATE employee SET name = ?, dob = ?,  Company = ? , Branch = ?, Department = ?,  Address = ?, City = ?, Country = ?, Mobile = ? WHERE id = ?";

    db.query(
      updatedata,
      [
        name,
        dob,
        Company,
        Branch,
        Department,
        Address,
        City,
        Country,
        Mobile,
        id,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Update Employee Successfully" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.DeleteEmployee = async(req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM employee WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Employee Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
