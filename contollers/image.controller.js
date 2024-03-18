const { default: mongoose } = require("mongoose");
const Image = require("../models/image.model");
const uploadImageToCloudinary = require("../util/uploadImageToCloudinary");

exports.postImage = async (req, res) => {
  try {
    const image = req.files.image;
    const name = req.body.name;
    const userId = req.userId;
    if (!name || !image) return res.status(400).json({ error: "All fields are required" });

    const { url: imageUrl } = await uploadImageToCloudinary(image.data);
    const newImage =  new Image({ userId, name, imageUrl });
    const response = await newImage.save();

    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

exports.getImages = async (req, res) => {
  const { name, limit = 10, page = 1 } = req.query;
  try {
    const query = { userId:req.userId };
    if (name) query.name = new RegExp(name, "i");

    const count = await Image.countDocuments(query);
    const images = await Image.find(query)
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))
      .exec();

    res.json({
      message: "Image fetch success",
      data: { images, page: Number(page), limit: Number(limit), totalCount: count },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message});
  }
};


exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    if (image.userId !== req.userId)
      return res.status(403).json({ error: "You are not authorized to delete this image" });

    const response = await Image.findByIdAndDelete(id);
    res.json({ message: "Image deleted successfully", data: response });
  } catch (error) {
    res.json(error.message);
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    if (image.userId !== req.userId)
      return res.status(403).json({ error: "You are not authorized to update this image" });

    image.name = name;
    const response = await image.save();
    res.json({ message: "Image name updated successfully", data: response });
  } catch (error) {
    res.json(error.message);
  }
};
