import readFile from "./readFile.js";
import frontmatter from 'front-matter'
import markdownit from 'markdown-it'

const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,

    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
})

import chokidar from 'chokidar'
import mergeArrays from "./mergeArrays.js";
import { full as emoji } from 'markdown-it-emoji'
import hljs from 'highlight.js'

import markdownitSub from 'markdown-it-sub'
import markdownitSup from 'markdown-it-sup'
import markdownitFootnote from 'markdown-it-footnote'
import markdownitAbbr from 'markdown-it-abbr'
import markdownitIns from 'markdown-it-ins'
import markdownitMark from 'markdown-it-mark'

md.use(markdownitSub)
md.use(markdownitSup)
md.use(markdownitFootnote)
md.use(markdownitAbbr)
md.use(emoji)
md.use(markdownitIns)
md.use(markdownitMark)

class PageManager {
    constructor() {
        this.pages = {}
    }

    async init() {
        const watcher = chokidar.watch('assets/pages', {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        })

        watcher.on('ready', () => {
            console.log(`PageManager | Initial scan complete. Ready for changes`)
        })

        watcher.on('error', (error) => {
            console.log(`PageManager | Error: ${error}`)
        })

        watcher.on('add', async (filename, details) => {
            if (!filename.endsWith('.md')) return;

            const [lang, name] = filename.replace('assets/pages/', '').split('/')
            await this.refresh(lang, name, details)

            console.log(`PageManager | Added page: ${lang} ${name}`)
        })

        watcher.on('change', async (filename, details) => {
            if (!filename.endsWith('.md')) return;

            const [lang, name] = filename.replace('assets/pages/', '').split('/')
            await this.refresh(lang, name, details)

            console.log(`PageManager | Changed page: ${lang} ${name}`)
        })

        watcher.on('unlink', async (filename) => {
            if (!filename.endsWith('.md')) return;

            const [lang, name] = filename.replace('assets/pages/', '').split('/')
            await this.delete(lang, name)

            console.log(`PageManager | Removed page: ${lang} ${name}`)
        })

        watcher.on('unlinkDir', async (path) => {
            const lang = path.replace('assets/pages/', '')
            await this.deleteAll(lang)

            console.log(`PageManager | Deleted lang: ${lang}`)
        })

        process.on("SIGINT", async () => {
            // close watcher when Ctrl-C is pressed
            console.log("\b\bClosing page watcher...");
            await watcher.close();

            process.exit(0);
        });
    }

    get(lang, name, notTranslatedMsg) {
        const page = structuredClone(this.pages?.[lang]?.[name + '.md'] ?? this.pages?.english?.[name + '.md'])

        if (page && page.lang !== lang)
            page.content = `<div class="message"><span class="message warning">${notTranslatedMsg}</span></div>\n` + page.content

        return page
    }

    getAll(lang) {
        const langPages = [...Object.values(this.pages?.[lang] || {})]
        const englishPages = [...Object.values(this.pages?.english || {})]

        const filteredEnglishPages = englishPages.filter(page => !langPages.find(langPage => langPage.id === page.id))

        return mergeArrays(langPages, filteredEnglishPages).filter(page => !page.attributes.hidden)
    }

    async delete(lang, name) {
        return delete this.pages?.[lang]?.[name]
    }

    async deleteAll(lang) {
        return delete this.pages?.[lang]
    }

    async refresh(lang, name, details) {
        const text = await readFile(`assets/pages/${lang}/${name}`)

        const parsed = frontmatter(text)
        const content = md.render(parsed.body)

        if (!Object.keys(parsed.attributes).length || !content || parsed.attributes.draft) return

        if (!this.pages?.[lang]) this.pages[lang] = {}

        this.pages[lang][name] = {
            id: name.slice(0, -3),
            created: details.birthtime,
            updated: details.mtime,
            lang,
            attributes: parsed.attributes,
            content
        }

        return this.pages?.[lang]?.[name]
    }
}

export default PageManager