"use client"
import { useState } from "react"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"
import Modal from "@/components/Modal/Modal"
import AddChat from "@/components/Modal/AddChat/AddChat"
import { Search, Plus } from "lucide-react"

import "./Searchbar.css"

export default function Searchbar() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div className="flex-row gap-3 searchbar">
                <TextInput
                    type="text"
                    placeholder="Поиск..."
                    icon={Search} color="#7E6f6E"
                    width100
                />
                <Button
                    icon={Plus}
                    title="Создать чат"
                    className="red"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                Content={AddChat}
            />
        </>
    )
}
