const db = require("../../config/db");

exports.GetDepartment = async(req, res) => {
  try {
    const Alldata = "SELECT * FROM department";
    db.query(Alldata, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleDepartment = async(req, res) => {
  try {
    const id = req.params.id;
    const data = "SELECT * FROM department WHERE id = ?";
    db.query(data, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "department not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateDepartment = async(req, res) => {
  try {
    const { department_name } = req.body;
    if (!department_name)
      return res.status(400).json({ message: "All Field Requide" });

    // check validation
    const finddepartment = "SELECT * FROM department WHERE department_name = ?";
    const Department_name = department_name.trim();
    db.query(finddepartment, [Department_name], (err, department) => {
      if (err) return res.status(500).json({ message: err.message });
      if (department.length > 0)
        return res.status(404).json({ message: "Department Allready Add" });

      //  insert data
      const inseltdata = "INSERT INTO department (department_name) VALUES (?)";
      db.query(inseltdata, [Department_name], (err2, result) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.status(201).json({ message: "Create Department Successfull" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.UpdateDepartment = async(req, res) => {
  try {
    const id = req.params.id;
    const { department_name } = req.body;

    // check dublicate company
    const finddepartment =
      "SELECT * FROM department WHERE department_name = ? AND id != ?";
    const Department_name = department_name.trim();
    db.query(finddepartment, [Department_name, id], (err, department) => {
      if (err) return res.status(500).json({ message: err.message });
      if (department.length > 0)
        return res.status(400).json({ message: "Department Allready Add" });

      // update department
      const updatedata =
        "UPDATE department SET department_name = ? WHERE id = ?";

      db.query(updatedata, [department_name, id], (err2, result) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.status(201).json({ message: "Update Department Successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.DeleteDepartment = async(req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM department WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "Department Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
