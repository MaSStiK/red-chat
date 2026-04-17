import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"

export async function GET() {
    try {
        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Подключаемся к базе данных
        await MongoConnect()

        // Ищем пользователя по id из токена, .select("-password") - исключаем пароль из ответа
        const dbUser = await User.findById(user.userId).select("-password")

        // Если пользователь не найден
        if (!dbUser) {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        // Успешный ответ - возвращаем пользователя
        return NextResponse.json(
            { dbUser },
            { status: 200 }
        )

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}