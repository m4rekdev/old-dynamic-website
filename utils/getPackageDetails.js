import fs from 'fs/promises'

const pkgJson = JSON.parse(await fs.readFile(`./package.json`, 'utf-8'))
export default pkgJson