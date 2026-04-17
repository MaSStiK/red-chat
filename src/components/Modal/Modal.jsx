"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import "./Modal.css"

export default function Modal({ isOpen, onClose, Content }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    if (!mounted || !isOpen) return null

    return createPortal(
        <div className="modal-wrapper" onClick={onClose} >
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                {Content && <Content onClose={onClose} />}
            </div>
        </div>,
        document.body
    )
}