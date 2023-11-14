const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const moviesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      // required: true,
    },
    // userId:{
    //   type: mongoose.Types.ObjectId, ref:"Users"
    // }
  },
  { timestamps: true }

);

const Movies = mongoose.model("Movies", moviesSchema);
module.exports = Movies;


