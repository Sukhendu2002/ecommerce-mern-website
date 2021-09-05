const Catagory = require("../models/catagoryModel");

const catagoryCtrl = {
  getAllCatagory: async (req, res) => {
    try {
      const catagory = await Catagory.find();
      res.status(200).json(catagory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = catagoryCtrl;
