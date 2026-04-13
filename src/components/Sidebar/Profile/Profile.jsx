"use client"
import Button from "@/components/UI/Button/Button"
import useLogout from "./Logout"
import { Settings, LogOut } from "lucide-react"
import { useAtomValue } from "jotai"
import { userAtom } from "@/atoms/auth"

import "./Profile.css"

export default function Profile() {
    const user = useAtomValue(userAtom)
    const logout = useLogout()

    return (
        <div className="profile flex-row">
            <div className="flex-row gap-3">
                <div className="profile__avatar">
                    <span className="fs-large fw-semibold">М</span>
                </div>
                <div className="flex-col">
                    <h3>{user?.name}</h3>
                    <span className="fs-small text-gray profile-tag">@{user?.email}</span>
                </div>
            </div>
            <div className="flex-row gap-2">
                <Button
                    icon={Settings}
                    title="Открыть настройки"
                    className="tp"
                />
                <Button
                    icon={LogOut}
                    title="Выйти из аккаунта"
                    className="tp"
                    onClick={logout}
                />
            </div>
        </div>
    )
}
