import ColorHash from "color-hash"
import tinycolor from "tinycolor2"

import "./ProfileAvatar.css"

    export default function ProfileAvatar({ name }) {
    const colorHash = new ColorHash()
    const bgColor = colorHash.hex(name) 
    const textColor = tinycolor(bgColor).isLight() ? "#000000" : "#ffffff"

    return (
        <div className="profile-avatar"
            style={{
                "--bg-color": bgColor,
                "--text-color": textColor
            }}
        >
            <span className="fs-large fw-semibold">{name[0]}</span>
        </div>
    )
}
