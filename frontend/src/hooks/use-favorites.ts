import { useState, useEffect } from "react";

export interface Favorite {
    symbol: string;
    name: string;
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        const load = () => {
            const saved = localStorage.getItem("favorites");
            if (saved) setFavorites(JSON.parse(saved));
        };
        load();
        window.addEventListener("favoritesChanged", load);
        return () => window.removeEventListener("favoritesChanged", load);
    }, []);

    const toggleFavorite = (fav: Favorite) => {
        const saved = localStorage.getItem("favorites");
        let current: Favorite[] = saved ? JSON.parse(saved) : [];

        const exists = current.some((f) => f.symbol === fav.symbol);
        if (exists) {
            current = current.filter((f) => f.symbol !== fav.symbol);
        } else {
            current.push(fav);
        }

        localStorage.setItem("favorites", JSON.stringify(current));
        window.dispatchEvent(new Event("favoritesChanged"));
    };

    const isFavorite = (symbol: string) => {
        return favorites.some((f) => f.symbol === symbol);
    };

    return { favorites, toggleFavorite, isFavorite };
}
