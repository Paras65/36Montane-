// routes/trekkingRoutes.js
const express = require('express');
const Trekking = require('../models/Trekking'); 


// Get all trekking trips
 const getAllTrek =  async (req, res) => {
  try {
    const trekks = await Trekking.find();
    res.json(trekks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Add a new trekking trip
const addTrek =  async (req, res) => {
  const { name, location, duration, difficulty, price, availableSlots, date } = req.body;
  
  const newTrekking = new Trekking({
    name,
    location,
    duration,
    difficulty,
    price,
    availableSlots,
    date
  });

  try {
    const savedTrekking = await newTrekking.save();
    res.status(201).json(savedTrekking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Get trekking by ID (details of a specific trekking trip)
const getTrekById = async (req, res) => {
  try {
    const trekking = await Trekking.findById(req.params.id);
    if (!trekking) {
      return res.status(404).json({ message: "Trekking not found" });
    }
    res.json(trekking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getAllTrek,addTrek,getTrekById};
