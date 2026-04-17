import Profile from "@/components/Profile/Profile"
import Searchbar from "./Searchbar/Searchbar"
import Chats from "@/components/Chats/Chats"
import "./Sidebar.css"

export default function Sidebar() {
    return (
        <div className="sidebar">
            <Profile />
            <Searchbar />

            {/* if messages > messages else not found */}
            <Chats />
        </div>
    )
}
