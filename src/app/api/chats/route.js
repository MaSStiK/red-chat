import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"
import Chat from "@/lib/mongodb/models/Chat"
import Message from "@/lib/mongodb/models/Message"
import isValidObjectId from "@/lib/validation/isValidObjectId"

export async function GET() {
    try {
        const { user, error } = await getUserFromRequest()
        if (error) return error

        await MongoConnect()

        // Ищем все чаты, в которых состоит текущий пользователь
        const chats = await Chat.find({
            members: user.userId,
        })
            // Подтягиваем участников без пароля
            .populate("members", "name email avatar")
            // Подтягиваем последнее сообщение
            .populate("lastMessageId", "text senderId createdAt")
            // Новые / обновлённые чаты сверху
            .sort({ updatedAt: -1 })
            .lean()

        // Форматируем ответ под UI
        const formattedChats = chats.map((chat) => {
            // Для приватного чата ищем второго участника
            const companion =
                chat.type === "private"
                    ? chat.members.find(
                          (member) => member._id.toString() !== user.userId
                      )
                    : null

            return {
                id: chat._id.toString(),
                type: chat.type,

                // Для private можно сразу вернуть данные собеседника
                user:
                    chat.type === "private" && companion
                        ? {
                              id: companion._id.toString(),
                              name: companion.name,
                              email: companion.email,
                              avatar: companion.avatar,
                          }
                        : null,

                // Для group можно использовать title
                title:
                    chat.type === "group"
                        ? chat.title
                        : companion?.name || "Неизвестный пользователь",

                members: chat.members.map((member) => ({
                    id: member._id.toString(),
                    name: member.name,
                    email: member.email,
                    avatar: member.avatar,
                })),

                lastMessage: chat.lastMessageId
                    ? {
                          id: chat.lastMessageId._id.toString(),
                          text: chat.lastMessageId.text,
                          senderId: chat.lastMessageId.senderId.toString(),
                          createdAt: chat.lastMessageId.createdAt.toISOString(),
                      }
                    : null,

                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt.toISOString()
            }
        })

        return NextResponse.json(
            { chats: formattedChats },
            { status: 200 }
        )
    } catch (error) {
        console.error("Get chats error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { memberId } = body

        if (!memberId) {
            return NextResponse.json(
                { message: "Не указан участник чата" },
                { status: 400 }
            )
        }

        if (!isValidObjectId(memberId)) {
            return NextResponse.json(
                { message: "Некорректный ID пользователя" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error

        const currentUserId = user.userId

        if (currentUserId === memberId) {
            return NextResponse.json(
                { message: "Нельзя создать чат с самим собой" },
                { status: 400 }
            )
        }

        await MongoConnect()

        // Проверяем, существует ли второй пользователь
        const member = await User.findById(memberId).select("_id").lean()

        if (!member) {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        // Ищем уже существующий приватный чат между двумя пользователями
        const existingChat = await Chat.findOne({
            type: "private",
            members: { $all: [currentUserId, memberId] }
        }).lean()

        if (existingChat) {
            return NextResponse.json(
                {   
                    isNew: false,
                    chat: {
                        id: existingChat._id.toString(),
                        type: existingChat.type,
                        members: existingChat.members.map((id) => id.toString()),
                        title: existingChat.title,
                        lastMessageId: existingChat.lastMessageId?.toString() || null,
                        createdAt: existingChat.createdAt.toISOString(),
                        updatedAt: existingChat.updatedAt.toISOString(),
                    }
                },
                { status: 200 }
            )
        }

        // Создаём новый чат
        const chat = await Chat.create({
            type: "private",
            members: [currentUserId, memberId]
        })

        return NextResponse.json(
            {   
                isNew: true,
                chat: {
                    id: chat._id.toString(),
                    type: chat.type,
                    members: chat.members.map((id) => id.toString()),
                    title: chat.title,
                    lastMessageId: null,
                    createdAt: chat.createdAt.toISOString(),
                    updatedAt: chat.updatedAt.toISOString(),
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