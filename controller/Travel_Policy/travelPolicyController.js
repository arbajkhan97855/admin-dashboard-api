const db = require("../../config/db");

exports.CreateTravelPolicy = async (req, res) => {
      const {
      Policy_Name,
      Policy_Code,
      Status,
      Department,
      Designation,
      Travel_Scope,
      Allowed_Cabin_Class,
      Cheapest_Flight_Mandatory,
      Max_Price_Deviation,
      Advance_Booking_Days,
      Blocked_Airlines,
      If_Policy_Followed,
      If_Policy_Violated,
      Approval_Level_1,
      Approval_Level_2,
      Payment_Mode,
      Cost_Center_Mandatory,
      Monthly_Spend_Limit,
      Invoice_Cycle,
    } = req.body;
  try {
  
  const Createpolicy = `
    INSERT INTO travel_policy (
      Policy_Name, Policy_Code, Status, Department, Designation,
      Travel_Scope, Allowed_Cabin_Class, Cheapest_Flight_Mandatory,
      Max_Price_Deviation, Advance_Booking_Days, Blocked_Airlines,
      If_Policy_Followed, If_Policy_Violated,
      Approval_Level_1, Approval_Level_2, Payment_Mode,
      Cost_Center_Mandatory, Monthly_Spend_Limit, Invoice_Cycle
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;
   db.query(Createpolicy,[
      Policy_Name,
      Policy_Code,
      Status,
      Department,
      Designation,
      Travel_Scope,
      Allowed_Cabin_Class,
      Cheapest_Flight_Mandatory,
      Max_Price_Deviation,
      Advance_Booking_Days,
      Blocked_Airlines,
      If_Policy_Followed,
      If_Policy_Violated,
      Approval_Level_1,
      Approval_Level_2,
      Payment_Mode,
      Cost_Center_Mandatory,
      Monthly_Spend_Limit,
      Invoice_Cycle], (err,result) =>{
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Successfully Add Travel policy"});
      }
    )
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};


exports.GetTravelPolicy = async (req,res) =>{
   try {
    const Alldata = "SELECT * FROM travel_policy";
    db.query(Alldata, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.SingleTravelPolicy = async (req,res) =>{
    const id = req.params.id;
   try {
    const data = "SELECT * FROM travel_policy WHERE id = ?";
    db.query(data, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


exports.UpdateTravelPolicy = async (req, res) => {
  const id = req.params.id
    const {
    Policy_Name,
    Policy_Code,
    Status,
    Department,
    Designation,
    Travel_Scope,
    Allowed_Cabin_Class,
    Cheapest_Flight_Mandatory,
    Max_Price_Deviation,
    Advance_Booking_Days,
    Blocked_Airlines,
    If_Policy_Followed,
    If_Policy_Violated,
    Approval_Level_1,
    Approval_Level_2,
    Payment_Mode,
    Cost_Center_Mandatory,
    Monthly_Spend_Limit,
    Invoice_Cycle,
  } = req.body;
  try {
    const data = "SELECT * FROM travel_policy WHERE id = ?";
    db.query(data, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
       if (result.length == 0) {
        return res.status(404).json({ message: "travel policy not found" });
      }
    
   const updateQuery = `UPDATE travel_policy SET 
      Policy_Name = ?,
      Policy_Code = ?,
      Status = ?,
      Department = ?,
      Designation = ?,
      Travel_Scope = ?,
      Allowed_Cabin_Class = ?,
      Cheapest_Flight_Mandatory = ?,
      Max_Price_Deviation = ?,
      Advance_Booking_Days = ?,
      Blocked_Airlines = ?,
      If_Policy_Followed = ?,
      If_Policy_Violated = ?,
      Approval_Level_1 = ?,
      Approval_Level_2 = ?,
      Payment_Mode = ?,
      Cost_Center_Mandatory = ?,
      Monthly_Spend_Limit = ?,
      Invoice_Cycle = ? WHERE id = ?`

      db.query(updateQuery,[
      Policy_Name,
      Policy_Code,
      Status,
      Department,
      Designation,
      Travel_Scope,
      Allowed_Cabin_Class,
      Cheapest_Flight_Mandatory,
      Max_Price_Deviation,
      Advance_Booking_Days,
      Blocked_Airlines,
      If_Policy_Followed,
      If_Policy_Violated,
      Approval_Level_1,
      Approval_Level_2,
      Payment_Mode,
      Cost_Center_Mandatory,
      Monthly_Spend_Limit,
      Invoice_Cycle,
      id
      ], (err2, updateResult) =>{
         if (err2) return res.status(500).json({ message: err2.message });
        res.status(201).json({ message: "Successfully Update Travel policy"});
      })
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}