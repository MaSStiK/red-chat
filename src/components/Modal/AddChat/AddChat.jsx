"use client"

import { useState } from "react"
import { useDebounceAsync } from "@/lib/hooks/useDebounceAsync"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"
import { AtSign, UserPlus } from "lucide-react"

import "./AddChat.css"

export default function AddChat({ onClose }) {
    const [email, setEmail] = useState("")
    const [user, setUser] = useState(null)
    const [createError, setCreateError] = useState("")
    const [createLoading, setCreateLoading] = useState(false)

    // Поиск по юзерам
    const {
        run: searchUser,         // Функция запуска debounce-поиска
        loading: searchLoading,  // Состояние загрузки поиска
        error: searchError,      // Ошибка, возникшая во время поиска
        setError: setSearchError // Ручная установка ошибки поиска
    } = useDebounceAsync(async (value, signal) => {
        const trimmedValue = value.trim()
        if (!trimmedValue) {
            setUser(null)
            return
        }

        // signal прерывает поиск
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(trimmedValue)}`, { signal })
        const data = await res.json()

        if (!res.ok) {
            setUser(null)
            throw new Error(data.message || "Ошибка поиска")
        }

        // Устанавливаем информацию о пользователе и далее отобразится его имя
        setUser(data)
    }, 500)

    // Функция вызываемая при обновлении инпута
    const handleChange = (event) => {
        const value = event.target.value

        setEmail(value)
        setCreateError("")
        setSearchError("")
        setUser(null)

        if (!value.trim()) {
            return
        }

        searchUser(value)
    }

    // Функция создания чата
    const createChat = async () => {
        if (!user?._id || createLoading || searchLoading) return
        setCreateLoading(true)
        setCreateError("")

        try {
            // Создание чата
            const res = await fetch("/api/chats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    memberId: user._id
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setCreateError(data.message || "Не удалось создать чат")
                return
            }

            console.log("Chat created:", data)

            // Чат создан или найден - закрытые модального окна
            onClose()
        } catch (error) {
            console.error("Create chat error:", error)
            setCreateError("Не удалось создать чат")
        } finally {
            setCreateLoading(false)
        }
    }

    return (
        <div className="flex-col gap-5 add-chat">
            <span className="text-center fs-xlarge fw-bold">Создать чат</span>
            <div>
                <div className="add-chat__icon">
                    <UserPlus size={48} color="#EE3F48" />
                </div>
                <span className="text-center text-gray">Введите username пользователя, с которым хотите начать чат</span>
            </div>

            <div className="flex-col gap-5">
                <div className="flex-col gap-2">
                    <TextInput
                        label="Email пользователя"
                        type="text"
                        placeholder="example@mail.com"
                        icon={AtSign}
                        color="#7E6f6E"
                        value={email}
                        onChange={handleChange}
                        error={searchError || createError}
                        width100
                        big
                    />
                    <span className="fs-small text-gray">Без символа @</span>

                    {(user && !searchError) && <span className="fs-small text-green">Пользователь: {user.name}</span>}
                </div>

                <div className="flex-row gap-5">
                    <Button
                        text="Отмена"
                        title="Отмена"
                        className="outlined"
                        onClick={onClose}
                        disabled={createLoading}
                        width100
                        big
                    />

                    <Button
                        text="Создать"
                        title="Создать"
                        className="red"
                        type="button"
                        disabled={!user || searchLoading || createLoading}
                        loading={createLoading}
                        onClick={createChat}
                        width100
                        big
                    />
                </div>
            </div>
        </div>
    )
}