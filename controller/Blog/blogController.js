const db = require("../../config/db");
const fs = require("fs");
const path = require("path");

exports.GetBlog = async (req, res) => {
  try {
    const Allblog = "SELECT * FROM blog";
    db.query(Allblog, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.SingleBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = "SELECT * FROM blog WHERE id = ?";
    db.query(blog, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length == 0) {
        return res.status(404).json({ message: "blog not found" });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.CreateBlog = async (req, res) => {
  try {
    const {
      Title,
      Subtitle,
      Status,
      Description,
      Meta_Title,
      Meta_Keyword,
      Meta_Description,
    } = req.body;

    if (!Title || !Subtitle || !Status || !req.file) {
      return res
        .status(400)
        .json({ message: "Title, Subtitle, Status, Image Field Requide" });
    }
    const Image = req.file ? req.file.filename : null;
    const addblogquery = `
      INSERT INTO blog
      (Title, Subtitle, Image, Status, Description, Meta_Title, Meta_Keyword, Meta_Description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      addblogquery,
      [
        Title,
        Subtitle,
        Image,
        Status,
        Description,
        Meta_Title,
        Meta_Keyword,
        Meta_Description,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Create Blog Successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.UpdateBlog = async (req, res) => {
  try {
    const id = req.params.id;

    const getBlogQuery = "SELECT * FROM blog WHERE id = ?";
    db.query(getBlogQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Blog not found" });

      const oldImage = result[0].Image;

      const {
        Title,
        Subtitle,
        Status,
        Description,
        Meta_Title,
        Meta_Keyword,
        Meta_Description,
      } = req.body;
    
  
      const Image = req.file ? req.file.filename : oldImage;

      if (req.file && oldImage) {
        const oldImagePath = path.join(__dirname, "../../upload/", oldImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log("Old image delete error:", err);
        });
      }

      const updateQuery = `
        UPDATE blog SET Title=?, Subtitle=?, Image=?, Status=?, Description=?, Meta_Title=?, Meta_Keyword=?, Meta_Description=?
        WHERE id=?
      `;

      db.query(
        updateQuery,
        [
          Title,
          Subtitle,
          Image,
          Status,
          Description,
          Meta_Title,
          Meta_Keyword,
          Meta_Description,
          id,
        ],
        (err2, data) => {
          if (err2) return res.status(500).json({ message: err2.message });
          res.status(201).json({ message: "Blog Updated Successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.DeleteBlog = async (req, res) => {
  try {
    const id = req.params.id;

    const getImageQuery = "SELECT Image FROM blog WHERE id = ?";
    db.query(getImageQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Blog not found" });

      const imageName = result[0].Image;

      const deleteQuery = "DELETE FROM blog WHERE id = ?";
      db.query(deleteQuery, [id], (err2, data) => {
        if (err2) return res.status(500).json({ message: err2.message });

        if (imageName) {
          const imagePath = path.join(__dirname, "../../upload/", imageName);
          fs.unlink(imagePath, (errrr) => {
            if (errrr) res.status(404).json({ message: errrr });
          });
        }

        res.status(200).json({ message: "Blog Deleted Successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};