import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Kostlife - Teman Setia Anak Kost!",
        short_name: "KostLife",
        description: "Teman setia anak kost!",
        start_url: "/",
        display: "standalone",
        background_color: "#1F4529",
        theme_color: "#1F4529",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
