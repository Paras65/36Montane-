// routes/campingRoutes.js
const express = require('express');
const Contact = require('../models/contact');




// POST endpoint to save the contact form data
const postContact =  async (req, res) => {
    const { name, email, phone, message } = req.body;
  
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
  
    // Create new contact document
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });
  
    try {
      // Save the contact data to the database
      await newContact.save();
      res.status(200).json({ message: "Your message has been saved successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save the message" });
    }
  }

// GET all contacts
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch contact inquiries" });
    }
};

// DELETE a contact inquiry
const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Contact.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Contact inquiry not found" });
        }
        res.status(200).json({ message: "Inquiry deleted successfully", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete inquiry" });
    }
};

module.exports = { postContact, getAllContacts, deleteContact };
