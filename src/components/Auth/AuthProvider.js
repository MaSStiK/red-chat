"use client"
import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { userAtom } from "@/atoms/app"

export default function AuthProvider({ children, user }) {
    const setUser = useSetAtom(userAtom)

    useEffect(() => {
        setUser(user)
    }, [user, setUser])

    return children
}