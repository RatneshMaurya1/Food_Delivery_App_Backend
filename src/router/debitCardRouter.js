const express = require("express");
const DebitCard = require("../models/debitCard.schema");
const userAuth = require("../middlewares/userAuth");

const debitCardRouter = express.Router();

debitCardRouter.post("/debitCard", userAuth, async (req, res) => {
    try {
      const user = req.user; 
      const { cardNumber, expire, cvc, cardName } = req.body;
  
      if (!cardNumber || !expire || !cvc || !cardName) {
        return res.status(400).json({ message: "Missing required field" });
      }
  
      if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        return res.status(400).json({ message: "Invalid card number" });
      }
  
      const expireRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expireRegex.test(expire)) {
        return res.status(400).json({ message: "Invalid expiration date format (MM/YY)" });
      }
  
      if (cvc.length !== 3 || isNaN(cvc)) {
        return res.status(400).json({ message: "Invalid CVC" });
      }
  
      const userCard = new DebitCard({
        userId: user._id,
        cardNumber,
        expire,
        cvc,
        cardName,
      });
      await userCard.save();
  
      return res.status(200).json({ message: "Card added successfully", userCard });
    } catch (error) {
      console.error("Error adding debit card:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
debitCardRouter.get("/debitCard", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userCard = await DebitCard.find({ userId: user._id });
    if (!userCard) {
      return res.status(404).json({ message: "card not found" });
    }
    return res.status(200).json({ message: "user card", userCard });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to get user card", error: error.message });
  }
});

debitCardRouter.put("/debitCard/:userCardId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { cardNumber, expire, cvc, cardName } = req.body;

    if (!cardNumber && !expire && !cvc && !cardName) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update." });
    }

    if (cardNumber && cardNumber.length !== 16 || isNaN(cardNumber)) {
      return res.status(400).json({ message: "Invalid card number" });
    }
    const expireRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (expire && !expireRegex.test(expire)) {
      return res.status(400).json({ message: "Invalid expiration date format (MM/YY)" });
    }

    if (cvc && cvc.length !== 3 || isNaN(cvc)) {
      return res.status(400).json({ message: "Invalid CVC" });
    }


    const updatedDabitCard = await DebitCard.findOne({
      _id: req.params.userCardId,
      userId: user._id,
    });
    if (!updatedDabitCard) {
      return res.status(404).json({ message: "card not found" });
    }
    updatedDabitCard.cardNumber = cardNumber || updatedDabitCard.cardNumber;
    updatedDabitCard.expire= expire || updatedDabitCard.expire;
    updatedDabitCard.cvc = cvc || updatedDabitCard.cvc;
    updatedDabitCard.cardName = cardName || updatedDabitCard.cardName;
    await updatedDabitCard.save();
    res
      .status(200)
      .json({ message: "card updated successfully", updatedDabitCard });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to update card details", error: error.message });
  }
});

debitCardRouter.delete("/debitCard/:userCardId", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const deletedDebitCard = await DebitCard.findOneAndDelete({
      _id: req.params.userCardId,
      userId: user._id,
    });

    if (!deletedDebitCard) {
      return res.status(404).json({ message: "card not found" });
    }

    return res.status(200).json({ message: "card deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to delete card", error: error.message });
  }
});

module.exports = debitCardRouter;
