const express = require("express");
const Address = require("../models/address.schema");
const userAuth = require("../middlewares/userAuth");

const addressRouter = express.Router();

addressRouter.post("/address", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { state, city, pinCode, phoneNumber, fullAddress } = req.body;

    if (!state || !city || !pinCode || !phoneNumber || !fullAddress) {
      return res.status(400).json({ message: "Missing required field" });
    }
    const userAddress = new Address({
      userId: user._id,
      state,
      city,
      pinCode,
      phoneNumber,
      fullAddress,
    });
    await userAddress.save();
    res
      .status(200)
      .json({ message: "Address added successfully", userAddress });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to create address", error: error.message });
  }
});
addressRouter.get("/address", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userAddress = await Address.find({ userId: user._id });
    if (!userAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    return res.status(200).json({ message: "user address", userAddress });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to get address", error: error.message });
  }
});

addressRouter.put("/address/:addressId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { state, city, pinCode, phoneNumber, fullAddress } = req.body;

    if (!state && !city && !pinCode && !phoneNumber && !fullAddress) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update." });
    }

    const updatedAddress = await Address.findOne({
      _id: req.params.addressId,
      userId: user._id,
    });
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    updatedAddress.state = state || updatedAddress.state;
    updatedAddress.city = city || updatedAddress.city;
    updatedAddress.pinCode = pinCode || updatedAddress.pinCode;
    updatedAddress.phoneNumber = phoneNumber || updatedAddress.phoneNumber;
    updatedAddress.fullAddress = fullAddress || updatedAddress.fullAddress;
    await updatedAddress.save();
    res
      .status(200)
      .json({ message: "Address updated successfully", updatedAddress });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to create address", error: error.message });
  }
});
addressRouter.delete("/address/:addressId", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const deletedAddress = await Address.findOneAndDelete({
      _id: req.params.addressId,
      userId: user._id,
    });

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to create address", error: error.message });
  }
});

addressRouter.get("/address/:addressId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userAddress = await Address.find({_id:req.params.addressId, userId: user._id });
    if (!userAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    return res.status(200).json({ message: "Address selected successfully", userAddress });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to get address", error: error.message });
  }
});


module.exports = addressRouter;
