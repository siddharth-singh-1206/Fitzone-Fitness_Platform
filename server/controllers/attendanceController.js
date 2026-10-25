const Attendance = require('../models/Attendance');

/**
 * @desc   Check in to gym
 * @route  POST /api/attendance/checkin
 * @access Private
 */
const checkIn = async (req, res, next) => {
  try {
    const { activity, durationMinutes } = req.body;

    // Check if already checked in in the last 4 hours
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const recentCheckIn = await Attendance.findOne({
      user: req.user._id,
      checkInTime: { $gte: fourHoursAgo },
    });

    if (recentCheckIn) {
      return res.status(400).json({
        success: false,
        message: 'You already checked in recently today!',
      });
    }

    const record = await Attendance.create({
      user: req.user._id,
      activity: activity || 'Gym Floor',
      durationMinutes: durationMinutes || 60,
      checkInTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Successfully checked in to FitZone!',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get authenticated user's attendance history and stats
 * @route  GET /api/attendance/my
 * @access Private
 */
const getMyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .sort({ checkInTime: -1 })
      .limit(30);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = await Attendance.countDocuments({
      user: req.user._id,
      checkInTime: { $gte: startOfMonth },
    });

    // Calculate streak (consecutive days with at least one check-in)
    const allRecent = await Attendance.find({ user: req.user._id })
      .sort({ checkInTime: -1 })
      .select('checkInTime');

    let streak = 0;
    if (allRecent.length > 0) {
      const dates = [
        ...new Set(
          allRecent.map((r) =>
            new Date(r.checkInTime).toISOString().split('T')[0]
          )
        ),
      ];

      const todayStr = now.toISOString().split('T')[0];
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let currentDate = dates[0] === todayStr ? todayStr : (dates[0] === yesterdayStr ? yesterdayStr : null);

      if (currentDate) {
        let checkDate = new Date(currentDate);
        for (let i = 0; i < dates.length; i++) {
          const expected = checkDate.toISOString().split('T')[0];
          if (dates.includes(expected)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        records,
        stats: {
          thisMonthCount,
          streak,
          totalCheckIns: records.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  getMyAttendance,
};
