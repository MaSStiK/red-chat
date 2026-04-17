import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"

export async function GET(req) {
    try {
        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Подключаемся к базе данных
        await MongoConnect()

        // Получаем query параметры из URL
        const { searchParams } = new URL(req.url)

        // Берем email из ?q=
        const query = searchParams.get("q")

        // Проверяем, что email передан
        if (!query || !query.trim()) {
            return NextResponse.json(
                { message: "Email не указан" },
                { status: 400 }
            )
        }

        // Приводим email к нормальному виду
        const email = query.trim().toLowerCase()

        // Запрещаем искать самого себя
        if (email === user.email) {
            return NextResponse.json(
                { message: "Нельзя искать самого себя" },
                { status: 400 }
            )
        }

        // Ищем пользователя по точному совпадению email
        const dbUser = await User.findOne({ email })
            .select("-password") // убираем пароль из ответа
            .lean()             // превращаем в обычный объект (важно для Next.js)

        // Если пользователь не найден
        if (!dbUser) {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        // Успешный ответ
        return NextResponse.json(dbUser, { status: 200 })

    } catch (error) {
        console.error("Search user error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}