// Mock user storage (replace with database in production)
// In production, this would import from the database model
const users = [];

const userController = {
  async getAllUsers(req, res) {
    try {
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = users.find(u => u.id === parseInt(id));

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      
      const userIndex = users.findIndex(u => u.id === parseInt(id));

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check authorization - users can only update their own profile
      if (users[userIndex].id !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Update user
      if (name) users[userIndex].name = name;
      if (email) users[userIndex].email = email;
      users[userIndex].updatedAt = new Date();

      const { password, ...userWithoutPassword } = users[userIndex];
      res.json({ 
        message: 'User updated successfully',
        user: userWithoutPassword 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const userIndex = users.findIndex(u => u.id === parseInt(id));

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check authorization - users can only delete their own account
      if (users[userIndex].id !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      users.splice(userIndex, 1);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;
