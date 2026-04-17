import mongoose from "mongoose"

// Проверка является ли строка ObjectId
export default function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}