import { useSetAtom } from "jotai"
import { userAtom } from "@/atoms/app"
import { useRouter } from "next/navigation"

export default function useLogout() {
    const setUser = useSetAtom(userAtom)
    const router = useRouter()

    return async function logout() {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            })

            // Очищаем пользователя в UI
            setUser(null)

            // Редирект
            router.push("/auth")
        } catch (error) {
            console.error(error)
        }
    }
}