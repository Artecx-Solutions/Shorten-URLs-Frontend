// controllers/adminController.js
const User = require('../models/User');
const Link = require('../models/Link');
const { validationResult } = require('express-validator');

class AdminController {
  
  // Get admin dashboard statistics
  async getAdminDashboard(req: { user: { role: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; }): void; new(): any; }; }; json: (arg0: { success: boolean; data: { statistics: { totalUsers: any; totalLinks: any; totalClicks: any; recentUsers: any; recentLinks: any; }; topLinks: any; userGrowth: any; }; }) => void; }) {
    try {
      // Verify user is admin (middleware should handle this, but double check)
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      // Get total statistics
      const totalUsers = await User.countDocuments();
      const totalLinks = await Link.countDocuments();
      const totalClicks = await Link.aggregate([
        {
          $group: {
            _id: null,
            totalClicks: { $sum: '$clicks' }
          }
        }
      ]);

      // Get recent users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentUsers = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });

      // Get recent links (last 7 days)
      const recentLinks = await Link.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });

      // Get top performing links
      const topLinks = await Link.find()
        .sort({ clicks: -1 })
        .limit(10)
        .select('shortCode originalUrl clicks createdAt')
        .populate('createdBy', 'name email');

      // Get user growth data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const userGrowth = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      res.json({
        success: true,
        data: {
          statistics: {
            totalUsers,
            totalLinks,
            totalClicks: totalClicks[0]?.totalClicks || 0,
            recentUsers,
            recentLinks
          },
          topLinks,
          userGrowth
        }
      });

    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching admin dashboard data'
      });
    }
  }

  // Get all users with pagination
  async getAllUsers(req: { query: { page: string; limit: string; search: string; }; }, res: { json: (arg0: { success: boolean; data: { users: any; pagination: { page: number; limit: number; total: any; pages: number; }; }; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: string; }): void; new(): any; }; }; }) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;

      // Build search query
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }

      // Get users with pagination
      const users = await User.find(searchQuery)
        .select('-password') // Exclude password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const totalUsers = await User.countDocuments(searchQuery);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total: totalUsers,
            pages: Math.ceil(totalUsers / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching users'
      });
    }
  }
}

module.exports = new AdminController();