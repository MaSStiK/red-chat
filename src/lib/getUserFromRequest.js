import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Проверяет JWT токен из cookie и возвращает данные пользователя или ошибку
export async function getUserFromRequest() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return {
            error: NextResponse.json(
                { message: "Не авторизован" },
                { status: 401 }
            )
        }
    }

    const payload = verifyToken(token)

    if (!payload) {
        return {
            error: NextResponse.json(
                { message: "Неверный токен" },
                { status: 401 }
            )
        }
    }

    return {
        user: payload
    }
}