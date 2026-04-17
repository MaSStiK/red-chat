import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import Chat from "@/lib/mongodb/models/Chat"
import Message from "@/lib/mongodb/models/Message"

export async function POST(req) {
    try {
        const body = await req.json()
        const { chatId, text } = body

        if (!chatId || !text?.trim()) {
            return NextResponse.json(
                { message: "Некорректные данные" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error

        await MongoConnect()

        const chat = await Chat.findById(chatId)

        if (!chat) {
            return NextResponse.json(
                { message: "Чат не найден" },
                { status: 404 }
            )
        }

        const isMember = chat.members.some(
            (memberId) => memberId.toString() === user.userId
        )

        if (!isMember) {
            return NextResponse.json(
                { message: "Нет доступа к чату" },
                { status: 403 }
            )
        }

        const message = await Message.create({
            chatId,
            senderId: user.userId,
            text: text.trim(),
            readBy: [user.userId]
        })

        chat.lastMessageId = message._id
        await chat.save()

        return NextResponse.json(
            {
                message: "Сообщение отправлено",
                data: {
                    id: message._id.toString(),
                    chatId: message.chatId.toString(),
                    senderId: message.senderId.toString(),
                    text: message.text,
                    readBy: message.readBy.map((id) => id.toString()),
                    createdAt: message.createdAt.toISOString()
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}