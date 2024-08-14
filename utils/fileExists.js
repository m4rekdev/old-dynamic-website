import fs from 'fs/promises'

export default async function fileExists(path) {
    try {
        await fs.stat(path);
        return true;
    } catch {
        return false;
    }
}