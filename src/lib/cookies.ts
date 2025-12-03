export interface CookieOptions {
    expires?: number; // days
    path?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
}

const DEFAULT_OPTIONS: CookieOptions = {
    expires: 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};

export const setCookie = (
    name: string,
    value: string,
    options: CookieOptions = {},
): void => {
    if (typeof document === "undefined") return;

    const opts = { ...DEFAULT_OPTIONS, ...options };

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (opts.expires) {
        const date = new Date();
        date.setTime(date.getTime() + opts.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
    }

    if (opts.path) {
        cookieString += `; path=${opts.path}`;
    }

    if (opts.secure) {
        cookieString += "; secure";
    }

    if (opts.sameSite) {
        cookieString += `; samesite=${opts.sameSite}`;
    }

    document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }

    return null;
};

export const deleteCookie = (name: string, path: string = "/"): void => {
    if (typeof document === "undefined") return;

    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
};

export const hasCookie = (name: string): boolean => {
    return getCookie(name) !== null;
};

export const AUTH_COOKIE_NAME = "kostlife_auth";
export const AUTH_COOKIE_EXPIRY_DAYS = 7;

/**
 * User session data stored in cookie
 */
export interface UserSession {
    id: string;
    username: string;
    amount_budget: number;
}

export const setAuthCookie = (user: UserSession): void => {
    setCookie(AUTH_COOKIE_NAME, JSON.stringify(user), {
        expires: AUTH_COOKIE_EXPIRY_DAYS,
    });
};

export const getAuthCookie = (): UserSession | null => {
    const cookieValue = getCookie(AUTH_COOKIE_NAME);
    if (!cookieValue) return null;

    try {
        return JSON.parse(cookieValue) as UserSession;
    } catch {
        return null;
    }
};

export const removeAuthCookie = (): void => {
    deleteCookie(AUTH_COOKIE_NAME);
};

export const isAuthenticated = (): boolean => {
    return getAuthCookie() !== null;
};
