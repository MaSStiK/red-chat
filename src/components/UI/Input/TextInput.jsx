import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

import "./TextInput.css"

// Пример использования
/* <TextInput
    src="/assets/image.png"
    placeholder="text"
    id="text"
    name="title"
    minLength={4}
    maxLength={128}
/> */

// Кнопка с картинкой, но так же есть возможность отобразить текст после картинки
export default function TextInput({
    className="", style,
    type="text",
    label,

    // Пропсы для отображения картинки
    icon, alt="button-image", color="#FFFFFF",
    
    // Модификаторы
    big,
    width100,
    error,
    
    // Все остальное летит в инпут
    // id, name, placeholder, minLength, maxLength, onInput, onChange, required, disabled
    id, ...rest
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    const classes = clsx(
        "ui-text-input",
        {
            "input--big": big, // Большой инпут 50px
            "input--width100": width100, // Растяжение на всю ширину
        },
        className
    );

    const commonProps = { className: classes, style }

    const Icon = typeof icon === "object" ? icon : null // Если в icon передаем иконку из "lucide-react" - отображаем его как компонент
    const src = typeof icon === "string" ? icon : null // Если в icon передаем ссылку на картинку - отображаем как Image src
    const content = (
        <div className="input-image">
            {Icon && <Icon size={20} color={color} />}
            {src && <Image src={src} alt={alt} width={20} height={20} />}
        </div>
    )    

    return (
        <div {...commonProps}>
            {label && <label className="input-label" htmlFor={id}>{label}</label>}
            <div className="input-wrapper">
                {content}
                <input {...rest}
                    id={id}
                    className={error ? "error" : ""}
                    type={type}
                    aria-invalid={!!error}
                />
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    )
}