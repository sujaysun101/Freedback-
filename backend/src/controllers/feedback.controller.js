// Mock feedback storage (replace with database in production)
const feedbackItems = [];

const feedbackController = {
  async createFeedback(req, res) {
    try {
      const { title, description, category } = req.body;

      // Validation
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const feedback = {
        id: feedbackItems.length + 1,
        title,
        description,
        category: category || 'general',
        userId: req.user.userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      feedbackItems.push(feedback);

      res.status(201).json({
        message: 'Feedback created successfully',
        feedback
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllFeedback(req, res) {
    try {
      const { category, status } = req.query;
      
      let filteredFeedback = [...feedbackItems];

      if (category) {
        filteredFeedback = filteredFeedback.filter(f => f.category === category);
      }

      if (status) {
        filteredFeedback = filteredFeedback.filter(f => f.status === status);
      }

      res.json({ 
        feedback: filteredFeedback,
        count: filteredFeedback.length 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFeedbackById(req, res) {
    try {
      const { id } = req.params;
      const feedback = feedbackItems.find(f => f.id === parseInt(id));

      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      res.json({ feedback });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateFeedback(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, status } = req.body;
      
      const feedbackIndex = feedbackItems.findIndex(f => f.id === parseInt(id));

      if (feedbackIndex === -1) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      // Check authorization - users can only update their own feedback
      if (feedbackItems[feedbackIndex].userId !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Update feedback
      if (title) feedbackItems[feedbackIndex].title = title;
      if (description) feedbackItems[feedbackIndex].description = description;
      if (category) feedbackItems[feedbackIndex].category = category;
      if (status) feedbackItems[feedbackIndex].status = status;
      feedbackItems[feedbackIndex].updatedAt = new Date();

      res.json({ 
        message: 'Feedback updated successfully',
        feedback: feedbackItems[feedbackIndex]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteFeedback(req, res) {
    try {
      const { id } = req.params;
      const feedbackIndex = feedbackItems.findIndex(f => f.id === parseInt(id));

      if (feedbackIndex === -1) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      // Check authorization - users can only delete their own feedback
      if (feedbackItems[feedbackIndex].userId !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      feedbackItems.splice(feedbackIndex, 1);
      res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = feedbackController;
