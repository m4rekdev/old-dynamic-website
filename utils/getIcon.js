import fsSync from 'node:fs'

export default function getIcon(name) {
    return fsSync.existsSync(`assets/icons/${name}.svg`) ? fsSync.readFileSync(`assets/icons/${name}.svg`, 'utf-8') : null
}