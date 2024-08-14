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
import { Feed } from 'feed'

import packageDetails from './getPackageDetails.js'
const { name, version } = packageDetails

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

class PostManager {
    constructor() {
        this.posts = {}
        this.rss = {}
    }

    async init() {
        const watcher = chokidar.watch('assets/posts', {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        })

        watcher.on('ready', () => {
            console.log(`PostManager | Initial scan complete. Ready for changes`)
        })

        watcher.on('error', (error) => {
            console.log(`PostManager | Error: ${error}`)
        })

        watcher.on('add', async (filename, details) => {
            if (!filename.endsWith('.md')) return;

            const [lang, name] = filename.replace('assets/posts/', '').split('/')
            await this.refresh(lang, name, details)

            console.log(`PostManager | Added post: ${lang} ${name}`)
        })

        watcher.on('change', async (filename, details) => {
            if (!filename.endsWith('.md')) return;

            const [lang, name] = filename.replace('assets/posts/', '').split('/')
            await this.refresh(lang, name, details)

            console.log(`PostManager | Changed post: ${lang} ${name}`)
        })

        watcher.on('unlink', async (filename) => {
            if (!filename.endsWith('.md')) return;

            const [lang, name] = filename.replace('assets/posts/', '').split('/')
            await this.delete(lang, name)

            console.log(`PostManager | Removed post: ${lang} ${name}`)
        })

        watcher.on('unlinkDir', async (path) => {
            const lang = path.replace('assets/posts/', '')
            await this.deleteAll(lang)

            console.log(`PostManager | Deleted lang: ${lang}`)
        })

        process.on("SIGINT", async () => {
            // close watcher when Ctrl-C is pressed
            console.log("\b\bClosing post watcher...");
            await watcher.close();

            process.exit(0);
        });
    }

    get(lang, name, notTranslatedMsg) {
        const post = structuredClone(this.posts?.[lang]?.[name + '.md'] ?? this.posts?.english?.[name + '.md'])

        if (post && post.lang !== lang)
            post.content = `<div class="message"><span class="message warning">${notTranslatedMsg}</span></div>\n` + post.content

        return post
    }

    getAll(lang) {
        const langPosts = [...Object.values(this.posts?.[lang] || {})]
        const englishPosts = [...Object.values(this.posts?.english || {})]

        const filteredEnglishPosts = englishPosts.filter((post) => !langPosts.find((langPost) => langPost.id === post.id))

        return mergeArrays(langPosts, filteredEnglishPosts).filter((post) => !post.attributes.hidden)
    }

    getRSS(lang, json, getLangFeedProperty) {
        const rss = new Feed({
            title: getLangFeedProperty(lang, 'title').replaceAll('{{ name }}', name),
            description: getLangFeedProperty(lang, 'description'),
            id: `https://${name}/blog`,
            link: `https://${name}/blog`,
            language: getLangFeedProperty(lang, 'language'), // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            // image: "http://example.com/image.png",
            // favicon: "http://example.com/favicon.ico",
            copyright: `Uncopyright ${name} ${new Date().getFullYear()}`,
            generator: `${name} ${version}`, // optional, default = 'Feed for Node.js'
            feedLinks: {
                json: `https://${name}/blog/feed/${lang}.json`,
                atom: `https://${name}/blog/feed/${lang}.rss`
            },
            author: {
                name,
                email: "marek@ostrolucki.eu",
                link: `https://${name}/blog`
            }
        })

        for (const post of this.getAll(lang)) {
            if (!post.attributes.hidden) rss.addItem({
                title: post.attributes.title,
                id: `https://${name}/blog/${post.id}`,
                link: `https://${name}/blog/${post.id}`,
                content: post.content,
                author: [
                    {
                        name: `${name}`,
                        email: "marek@ostrolucki.eu",
                        link: `https://${name}/blog`
                    }
                ],
                date: post.updated
            });
        }

        return json ? rss.json1() : rss.atom1()
    }

    async delete(lang, name) {
        return delete this.posts?.[lang]?.[name]
    }

    async deleteAll(lang) {
        return delete this.posts?.[lang]
    }

    async refresh(lang, name, details) {
        const text = await readFile(`assets/posts/${lang}/${name}`)

        const parsed = frontmatter(text)
        const content = md.render(parsed.body)

        if (!Object.keys(parsed.attributes).length || !content || parsed.attributes.draft) return

        if (!this.posts?.[lang]) this.posts[lang] = {}

        this.posts[lang][name] = {
            id: name.slice(0, -3),
            created: details.birthtime,
            updated: details.mtime,
            lang,
            attributes: parsed.attributes,
            content
        }

        return this.posts?.[lang]?.[name]
    }
}

export default PostManager