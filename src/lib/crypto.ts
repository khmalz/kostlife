/**
 * Hash a password using SHA-256
 * @param password - Plain text password to hash
 * @returns Hashed password as hex string
 */
export async function hashPassword(password: string): Promise<string> {
    // Encode password as UTF-8
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return hashHex;
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @returns True if password matches hash
 */
export async function verifyPassword(
    password: string,
    hash: string,
): Promise<boolean> {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

/**
 * Hash password with salt for extra security
 * @param password - Plain text password to hash
 * @param salt - Optional salt (will be generated if not provided)
 * @returns Object containing the hash and salt
 */
export async function hashPasswordWithSalt(
    password: string,
    salt?: string,
): Promise<{ hash: string; salt: string }> {
    const useSalt = salt || generateSalt();

    const saltedPassword = password + useSalt;

    const hash = await hashPassword(saltedPassword);

    return { hash, salt: useSalt };
}

/**
 * Verify a password against a salted hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @param salt - Salt used when hashing
 * @returns True if password matches hash
 */
export async function verifyPasswordWithSalt(
    password: string,
    hash: string,
    salt: string,
): Promise<boolean> {
    const { hash: passwordHash } = await hashPasswordWithSalt(password, salt);
    return passwordHash === hash;
}

/**
 * Generate a random salt
 * @param length - Length of salt in bytes (default: 16)
 * @returns Salt as hex string
 */
export function generateSalt(length: number = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
