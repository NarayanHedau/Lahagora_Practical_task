const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    permissions: { type: Object },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
}, {
    timestamps: true
})

const roleModel = mongoose.model("roleModel", roleSchema)

module.exports = roleModel