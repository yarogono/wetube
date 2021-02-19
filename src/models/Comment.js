import mongoose from "mongoose";
import moment from "moment";

const CommentSchema = new mongoose.Schema({
  name: String,
  text: {
    type: String,
    required: "Text is required",
  },
  createdAt: {
    type: String,
    default: moment(Date.now()).format("MMM, Do YY, HH:mm"),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const model = mongoose.model("Comment", CommentSchema);
export default model;
