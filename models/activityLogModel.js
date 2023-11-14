const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activityLogSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    resource: String,
  },
  { timestamps: true }

);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;


