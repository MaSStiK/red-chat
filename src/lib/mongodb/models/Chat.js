import mongoose, { Schema } from "mongoose"

const ChatSchema = new Schema({
    type: {
        type: String,
        enum: ["private", "group"],
        default: "private"
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    title: {
        type: String,
        trim: true,
        maxlength: 128,
        default: null
    },
    lastMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    }
}, {
    timestamps: true
})


ChatSchema.index({ members: 1 })

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);