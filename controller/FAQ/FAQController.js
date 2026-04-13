const db = require("../../config/db");
const path = require("path");

exports.GetFAQ = async (req, res) => {
  try {
    const AllFAQ = "SELECT * FROM faq";
    db.query(AllFAQ, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleFAQ = async (req, res) => {
  try {
    const id = req.params.id;
    const FAQ = "SELECT * FROM faq WHERE id = ?";
    db.query(FAQ, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateFAQ = async (req, res) => {
  try {
    const { faq_question, faq_answer, status } = req.body;

    if (!faq_question || !faq_answer || !status) {
      return res.status(400).json({ message: "All Field Requide" });
    }

    const FAQ_Question = faq_question.trim();
    const FAQ_Answer = faq_answer.trim();
    const Status = status.trim();

    const addfaqquery = `
      INSERT INTO faq
      (faq_question, faq_answer, status)
      VALUES (?, ?, ?)
    `;

    db.query(addfaqquery, [FAQ_Question, FAQ_Answer, Status], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "Create FAQ Successfull" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.DeleteFAQ = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedata = "DELETE FROM faq WHERE id = ?";
    db.query(deletedata, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({ message: "FAQ Delete Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.UpdateFAQ = async (req, res) => {
  try {
    const id = req.params.id;
    const { faq_question, faq_answer, status } = req.body;

    const FAQ_Question = faq_question.trim();
    const FAQ_Answer = faq_answer.trim();
    const Status = status.trim();

    const updatedata =
      "UPDATE faq SET faq_question = ?, faq_answer = ?, status = ? WHERE id = ?";

    db.query(
      updatedata,
      [FAQ_Question, FAQ_Answer, Status, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Update FAQ Successfully" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
