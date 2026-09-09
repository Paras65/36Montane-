const Article = require('../models/Article');

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, author, date, shortDescription, fullContent } = req.body;

    const newArticle = new Article({
      title,
      author,
      date,
      shortDescription,
      fullContent
    });

    await newArticle.save();
    res.status(201).json({
      message: 'Article created successfully!',
      article: newArticle
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error });
  }
};

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error });
  }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error });
  }
};

// Update an article
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Article.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('updateArticle error:', error);
    res.status(500).json({ message: 'Error updating article', error });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json({ message: 'Article deleted successfully', id });
  } catch (error) {
    console.error('deleteArticle error:', error);
    res.status(500).json({ message: 'Error deleting article', error });
  }
};
