import fs from 'fs/promises'

export default async function readFile(path, type) {
    const file = await fs.readFile(path, 'utf-8')

    return type === 'json' ? JSON.parse(file) : file
}