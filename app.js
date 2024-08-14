import HyperExpress from 'hyper-express';
import pug from 'pug'
import fileExists from './utils/fileExists.js'
import readFile from './utils/readFile.js'
import PostManager from './utils/postManager.js';
import PageManager from './utils/pageManager.js'
import getComponent from './utils/getComponent.js'
import getIcon from './utils/getIcon.js'

import packageDetails from './utils/getPackageDetails.js'
const { name, version } = packageDetails

import Lang from './utils/lang.js'
const lang = new Lang()

const getString = lang.getString.bind(lang);
const getProperty = lang.getProperty.bind(lang);
const getFeedProperty = lang.getFeedProperty.bind(lang);
const formatDate = lang.formatDate.bind(lang);

const webserver = new HyperExpress.Server();

const postManager = new PostManager()
await postManager.init()

const pageManager = new PageManager()
await pageManager.init()

webserver.get('/assets/*', async (request, response) => {
    if (!(await fileExists(`assets/${request.path.replace('/assets/', '')}`))) {
        const originalLang = request.cookies?.language || "english"
        let lang = request.cookies?.language || "english"

        const query = request.query_parameters

        if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
            return response
                .status(404)
                .type('html')
                .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
        } else if ((await fileExists(`views/english/errors/404.pug`))) {
            lang = "english"
            return response
                .status(404)
                .type('html')
                .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
        } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')
    }

    response.send(await readFile(`assets/${request.path.replace('/assets/', '')}`))
})

webserver.get(`/`, async (request, response) => {
    const originalLang = request.cookies?.language || "english"
    let lang = request.cookies?.language || "english"

    const query = request.query_parameters

    let pageTemplate = ""

    if ((await fileExists(`views/${originalLang}/index.pug`))) pageTemplate = `views/${originalLang}/index.pug`
    else if ((await fileExists(`views/english/index.pug`))) {
        lang = "english"
        pageTemplate = `views/english/index.pug`
    } else if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else if ((await fileExists(`views/english/errors/404.pug`))) {
        lang = "english"
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')

    response
        .type('html')
        .send(pug.renderFile(pageTemplate, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
})

webserver.get(`/settings`, async (request, response) => {
    const originalLang = request.cookies?.language || "english"
    let lang = request.cookies?.language || "english"
    const langFile = await readFile("assets/languages.json", "json");

    const query = request.query_parameters

    let pageTemplate = ""

    if ((await fileExists(`views/${originalLang}/settings.pug`))) pageTemplate = `views/${originalLang}/settings.pug`
    else if ((await fileExists(`views/english/settings.pug`))) {
        lang = "english"
        pageTemplate = `views/english/settings.pug`
    } else if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else if ((await fileExists(`views/english/errors/404.pug`))) {
        lang = "english"
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')

    response
        .type('html')
        .send(pug.renderFile(pageTemplate, { lang, originalLang, getComponent, getString, getProperty, langFile, query, getIcon, version, name }))
})

webserver.get(`/settings/change`, async (request, response) => {
    const query = request.query_parameters

    response.cookie('language', query?.language)
    response.redirect("/settings?success=true")
})

webserver.get(`/:path`, async (request, response) => {
    const originalLang = request.cookies?.language || "english"
    let lang = request.cookies?.language || "english"

    const query = request.query_parameters
    const path = request.path_parameters?.path

    let pageTemplate = ""

    const page = await pageManager.get(originalLang, path, getString(originalLang, "pageNotTranslated").replace(' {{ language }} ', ` ${getProperty(originalLang, "name")} `))
    if (!page) {
        if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
            return response
                .status(404)
                .type('html')
                .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
        } else if ((await fileExists(`views/english/errors/404.pug`))) {
            lang = "english"
            return response
                .status(404)
                .type('html')
                .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
        } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')
    }

    if ((await fileExists(`views/${originalLang}/page.pug`))) {
        pageTemplate = `views/${originalLang}/page.pug`
    } else if ((await fileExists(`views/english/page.pug`))) {
        lang = "english"
        pageTemplate = `views/english/page.pug`
    } else if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else if ((await fileExists(`views/english/errors/404.pug`))) {
        lang = "english"
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')

    response
        .type('html')
        .send(pug.renderFile(pageTemplate, { ...page, lang, originalLang, getComponent, getString, getProperty, formatDate, query, getIcon, version, name }))
})

webserver.get(`/blog`, async (request, response) => {
    const originalLang = request.cookies?.language || "english"
    let lang = request.cookies?.language || "english"

    const query = request.query_parameters
    
    const allPosts = postManager.getAll(originalLang)

    let pageTemplate = ""

    if ((await fileExists(`views/${originalLang}/blog/index.pug`))) pageTemplate = `views/${originalLang}/blog/index.pug`
    else if ((await fileExists(`views/english/blog/index.pug`))) {
        lang = "english"
        pageTemplate = `views/english/blog/index.pug`
    } else if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else if ((await fileExists(`views/english/errors/404.pug`))) {
        lang = "english"
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')

    response
        .type('html')
        .send(pug.renderFile(pageTemplate, { lang, originalLang, getComponent, getString, getProperty, formatDate, allPosts, query, getIcon, version, name }))
})

webserver.get('/blog/feed/:path', async (request, response) => {
    const path = request.path_parameters?.path
    response.send(postManager.getRSS(path.split('.')[0], path.endsWith('.json'), getFeedProperty))
})

webserver.get(`/blog/:path`, async (request, response) => {
    const originalLang = request.cookies?.language || "english"
    let lang = request.cookies?.language || "english"

    const query = request.query_parameters
    const path = request.path_parameters?.path

    let pageTemplate = ""

    const post = await postManager.get(originalLang, path, getString(originalLang, "postNotTranslated").replace(' {{ language }} ', ` ${getProperty(originalLang, "name")} `))
    if (!post) {
        if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
            return response
                .status(404)
                .type('html')
                .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
        } else if ((await fileExists(`views/english/errors/404.pug`))) {
            lang = "english"
            return response
                .status(404)
                .type('html')
                .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
        } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')
    }

    if ((await fileExists(`views/${originalLang}/blog/post.pug`))) pageTemplate = `views/${originalLang}/blog/post.pug`
    else if ((await fileExists(`views/english/blog/post.pug`))) {
        lang = "english"
        pageTemplate = `views/english/blog/post.pug`
    } else if ((await fileExists(`views/${originalLang}/errors/404.pug`))) {
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/${originalLang}/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else if ((await fileExists(`views/english/errors/404.pug`))) {
        lang = "english"
        return response
            .status(404)
            .type('html')
            .send(pug.renderFile(`views/english/errors/404.pug`, { lang, originalLang, getComponent, getString, getProperty, query, getIcon, version, name }))
    } else return response.status(404).type('json').send('{ "error": true, "message": "Not Found" }')

    response
        .type('html')
        .send(pug.renderFile(pageTemplate, { ...post, lang, originalLang, getComponent, getString, getProperty, formatDate, query, getIcon, version, name }))
})

webserver.listen(3000, () => console.log('Running on port 3000...'))

export { pageManager }