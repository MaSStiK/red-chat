import { Montserrat } from "next/font/google"

const THEME_COLOR = "#24182C"
const SITE_TITLE = "Red Chat"
const SITE_DESCRIPTION = "Red Chat — современный мессенджер, вдохновлённый Telegram, с поддержкой чатов в реальном времени, удобной архитектурой и высокой производительностью."
const SITE_URL = "https://hedgehog-rp.ru"

export const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    weight: ["100","200","300","400","500","600","700","800","900"],
    style: ["normal","italic"],
    display: "swap"
})

export const _metadata = {
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_TITLE}`
    },
    description: SITE_DESCRIPTION,
    icons: {
        icon: [ // Основные .ico
            { url: "/favicon.ico", rel: "icon" },
            { url: "/favicons/favicon-16x16.png", sizes: "16x16", rel: "icon" },
            { url: "/favicons/favicon-32x32.png", sizes: "32x32", rel: "icon" }
        ],
        apple: [ // iOS
            { url: "/favicons/favicon-120x120.png", sizes: "120x120", rel: "apple-touch-icon" },
            { url: "/favicons/favicon-152x152.png", sizes: "152x152", rel: "apple-touch-icon" },
            { url: "/favicons/favicon-180x180.png", sizes: "180x180", rel: "apple-touch-icon" }
        ],
        other: [ // PWA/Android maskable
            { url: "/favicons/favicon-192x192.png", rel: "mask-icon", color: THEME_COLOR }
        ]
    },
    manifest: "/site.webmanifest",
    metadataBase: new URL(SITE_URL),
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: SITE_TITLE,
        images: [{
            url: "/favicons/favicon-og-1200x630.png",
            width: 1200,
            height: 630
        }],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: ["/favicons/favicon-og-1200x630.png"],
        site: "@MaS2tiK",
        creator: "@MaS2tiK"
    },
    alternates: { // Канонический URL
        canonical: SITE_URL,
    },
    robots: {
        index: true,
        follow: true,
        nocache: true
    },
    authors: [{ name: "MaSStiK", url: "https://hedgehog-rp.ru/about" }],
    keywords: [
        "Ред Чат",
        "Ред чат",
        "ред чат",
        "Red Chat",
        "Red chat",
        "red chat",
        "мессенджер",
        "чат приложение",
        "онлайн чат",
        "реалтайм чат",
        "платформа для общения",
        "аналог telegram",
        "социальная сеть чат",
        "приватные сообщения",
        "групповые чаты",
        "веб мессенджер",
        "чат для ролевой игры",
        "чат платформа",
        "современный мессенджер"
    ]
}

export const _viewport = {
    themeColor: THEME_COLOR
}