import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    apiKey: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// We define a pre-remove hook to properly clean up submissions if necessary, 
// or simply handle it explicitly on the backend API deletion logic.

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
