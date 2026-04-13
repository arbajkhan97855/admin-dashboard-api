const db = require("../../config/db");
const fs = require("fs");
const path = require("path");

exports.GetAgency = async (req, res) => {
  try {
    const AllAgent = "SELECT * FROM agent_form";
    db.query(AllAgent, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingelAgency = async (req, res) => {
  try {
    const id = req.params.id;
    const Agent = "SELECT * FROM agent_form WHERE id = ?";
    db.query(Agent, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        res.status(404).json({ message: "Agent Not Found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateAgency = async (req, res) => {
  try {
    const {
      Agency_Name,
      Agency_Type,
      Year_Establishment,
      GST,
      IATA_Number,
      Website,
      Office_Address,
      City,
      Zipcode,
      Country,
      Full_Name,
      Designation,
      Mobile_Number,
      Email,
      Password,
      Confirm_Password,
      IsFlight,
      IsHotel,
      IsHotelFlight,
      IsVisa,
      IsCarRental,
    } = req.body;

    const Logo = req.files?.Logo ? req.files.Logo[0].filename : null;
    const License = req.files?.License ? req.files.License[0].filename : null;
    const ID_Proof = req.files?.ID_Proof ? req.files.ID_Proof[0].filename: null;

    const AddAgentQuery = `INSERT INTO agent_form (
     Agency_Name,
     Agency_Type,
     Year_Establishment,
     GST,
     IATA_Number,
     Website,
     Office_Address,
     City,
     Zipcode,
     Country,
     Full_Name,
     Designation,
     Mobile_Number,
     Email,
    Password,
    Confirm_Password,
    IsFlight,
    IsHotel,
    IsHotelFlight,
    IsVisa,
    IsCarRental,
    Logo,
    License,
    ID_Proof 
    )  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const insertdata = [
      Agency_Name,
      Agency_Type,
      Year_Establishment,
      GST,
      IATA_Number,
      Website,
      Office_Address,
      City,
      Zipcode,
      Country,
      Full_Name,
      Designation,
      Mobile_Number,
      Email,
      Password,
      Confirm_Password,
      IsFlight,
      IsHotel,
      IsHotelFlight,
      IsVisa,
      IsCarRental,
      Logo,
      License,
      ID_Proof,
    ];
    
   if(Password === Confirm_Password){
       db.query(AddAgentQuery, insertdata, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "Create Agent Successfully" });
    });
   }else{
    return res.status(404).json({ message: "Password & Confirm Password Not Match" });
   }
 

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.UpdateAgency = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      Agency_Name,
      Agency_Type,
      Year_Establishment,
      GST,
      IATA_Number,
      Website,
      Office_Address,
      City,
      Zipcode,
      Country,
      Full_Name,
      Designation,
      Mobile_Number,
      Email,
      Password,
      Confirm_Password,
      IsFlight,
      IsHotel,
      IsHotelFlight,
      IsVisa,
      IsCarRental,
    } = req.body;


    const getQuery = "SELECT * FROM agent_form WHERE id = ?";
    db.query(getQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Agent not found" });
     const olddata = result[0]

     const newLogo = req.files?.Logo ? req.files.Logo[0].filename : olddata.Logo;
     const newLicense = req.files?.License ? req.files.License[0].filename : olddata.License;
     const newIDProof = req.files?.ID_Proof ? req.files.ID_Proof[0].filename : olddata.ID_Proof;
     
   const updateQuery = `
        UPDATE agent_form SET
          Agency_Name = ?,
          Agency_Type = ?,
          Year_Establishment = ?,
          GST = ?,
          IATA_Number = ?,
          Website = ?,
          Office_Address = ?,
          City = ?,
          Zipcode = ?,
          Country = ?,
          Full_Name = ?,
          Designation = ?,
          Mobile_Number = ?,
          Email = ?,
          Password = ?,
          Confirm_Password = ?,
          IsFlight = ?,
          IsHotel = ?,
          IsHotelFlight = ?,
          IsVisa = ?,
          IsCarRental = ?,
          Logo = ?,
          License = ?,
          ID_Proof = ?
        WHERE id = ?
      `;

      const updateData = [
        Agency_Name,
        Agency_Type,
        Year_Establishment,
        GST,
        IATA_Number,
        Website,
        Office_Address,
        City,
        Zipcode,
        Country,
        Full_Name,
        Designation,
        Mobile_Number,
        Email,
        Password,
        Confirm_Password,
        IsFlight,
        IsHotel,
        IsHotelFlight,
        IsVisa,
        IsCarRental,
        newLogo,
        newLicense,
        newIDProof,
        id,
      ];

      db.query(updateQuery, updateData, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Agent Updated Successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.DeleteAgency = async (req, res) => {
  try {
    const id = req.params.id;

    const getQuery = "SELECT * FROM agent_form WHERE id = ?";
    db.query(getQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Agent not found" });

      const AllImage = [result[0].License, result[0].Logo, result[0].ID_Proof];

      const deleteQuery = "DELETE FROM agent_form WHERE id = ?";
      db.query(deleteQuery, [id], (errr, data) => {
        if (errr) return res.status(500).json({ message: errr });

        // all file image deleted
        AllImage.forEach((image) => {
          if (image) {
            const imagePath = path.join(__dirname, "../../upload/", image);
            fs.unlink(imagePath, (errrr) => {
              if (errrr) res.status(404).json({ message: errrr.message });
            });
          }
        });

        res.status(200).json({ message: "Agent Deleted Successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
