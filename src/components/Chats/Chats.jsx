"use client"
import { useEffect, useState } from "react"
import ChatsNotFound from "./ChatsNotFound/ChatsNotFound"
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar"

import "./Chats.css"

export default function Chats() {
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true)
                setError("")

                const res = await fetch("/api/chats")
                const data = await res.json()

                if (!res.ok) {
                    setError(data.message || "Не удалось загрузить чаты")
                    return
                }

                setChats(data.chats)
            } catch (error) {
                console.error("Fetch chats error:", error)
                setError("Ошибка сети")
            } finally {
                setLoading(false)
            }
        }

        fetchChats()
    }, [])

    if (loading) {
        return <div>Загрузка чатов...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    if (!chats.length) {
        return <ChatsNotFound />
    }


    return (
        <div className="flex-col gap-2 chats">
            {chats.map((chat) => (
                <div key={chat.id}>
                    <div className="flex-row gap-3">
                        <ProfileAvatar name={chat.title || ""} />
                        <div className="flex-col">
                            <h3>{chat.title}</h3>
                            <span className="fs-small text-gray">
                                {chat.lastMessage
                                    ? chat.lastMessage.text
                                    : "Нет сообщений"
                                }
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
