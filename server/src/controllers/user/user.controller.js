const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getAllUsers = async (req, res) => {
  try {
    const { id, schoolId } = req.user;
    const {
      role,
      searchQuery = '',
      startDate,
      endDate,
      dateOption = 'latest', // earliest | latest | custom
      faculty,
      department,
      level,
      page = 1,
      limit = 10,
    } = req.query;

    // Base filter
    const filter = {
      _id: { $ne: id }, // exclude current user
      schoolId, // get only users for the school
    };

    // optional filter
    if (role) filter.role = role;
    if (level) filter.level = level;
    if (faculty) filter.faculty = faculty;
    if (department) filter.department = department;
    if (searchQuery) {
      // Search by fullName, email, or matricNo (case-insensitive)
      filter.$or = [
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { matricNo: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // sorting
    let sortOption = { createdAt: -1 }; // default - latest

    if (dateOption === 'earliest') {
      sortOption = { createdAt: 1 };
    } else if (dateOption === 'custom' && (startDate || endDate)) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate).toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // end of the day in UTC
        filter.createdAt.$lte = end.toISOString();
      }
    }

    const users = await User.find(filter)
      .populate('faculty', 'name')
      .populate('department', 'name')
      .populate('schoolId', 'schoolName')
      .sort(sortOption)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // return total count for pagination
    const total = await User.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    return res.status(200).json({ users, total, pages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
