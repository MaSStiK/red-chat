"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"
import USER_LIMITS from "@/lib/validation/userLimits"
import { Send, Mail, Lock, Chrome } from "lucide-react"

export default function Login({ setForm }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")

        const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrors({})
        setFormError("")

        // Получаем данные из формы
        const form = event.target
        const formData = {
            email: form.email.value,
            password: form.password.value
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
    
            const data = await response.json()
            
            // Если ошибка
            if (!response.ok) {
                if (Array.isArray(data.errors)) {
                    const errorMap = {}

                    data.errors.forEach((e) => {
                        errorMap[e.field] = e.message
                    })

                    setErrors(errorMap)
                } else {
                    setFormError(data.message || "Что-то пошло не так")
                }
                return
            }
    
            router.push("/")
        } catch (error) {
            console.error(error)
            setFormError("Ошибка соединения с сервером")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth">
            <div className="auth__top text-center">
                <div className="auth__icon">
                    <Send size={48} />
                </div>
                <h1>Добро пожаловать</h1>
                <span className="text-gray">Войдите в свой аккаунт</span>
            </div>

            <form className="flex-col gap-4" onSubmit={handleSubmit}>
                <TextInput
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    icon={Mail} color="#7E6f6E"
                    placeholder="your@email.com"
                    maxLength={USER_LIMITS.email.max}
                    error={errors.email}
                    onChange={() => { setErrors((prev) => ({ ...prev, email: undefined })) }}
                    required
                    big
                />
                <TextInput
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    icon={Lock} color="#7E6f6E"
                    placeholder="•••••••••"
                    minLength={USER_LIMITS.password.min}
                    maxLength={USER_LIMITS.password.max}
                    error={errors.password}
                    onChange={() => { setErrors((prev) => ({ ...prev, password: undefined })) }}
                    required
                    big
                />
                {formError && <span className="form-error">{formError }</span>}
                <Button
                    text={loading ? "Загрузка..." : "Войти"}
                    className="red"
                    type="submit"
                    loading={loading}
                    width100
                    big
                />
            </form>
            <div className="auth__hr">
                <span className="fs-small text-gray">или</span>
            </div>
            <Button
                text="Войти через Google"
                className="outlined"
                icon={Chrome}
                width100
                big
            />
            {/* <a href="/api/auth/google">Войти через Google</a> */}
            
            <div className="auth__change-form">
                <button className="button text" onClick={() => setForm("registration")}>Нет аккаунта? Зарегистрируйтесь</button>
            </div>
        </div>
    )
}
