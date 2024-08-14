import fsSync from 'node:fs'
import pug from 'pug'
import { pageManager } from '../app.js'

import packageDetails from './getPackageDetails.js'
const { name: pkgName, version, repository } = packageDetails

import Lang from './lang.js'
const lang = new Lang()

const getString = lang.getString.bind(lang);
const getProperty = lang.getProperty.bind(lang);

export default function getComponent (lang, name, options = {}) {
    options.originalLang = lang
    options.lang = lang
    options.getString = getString
    options.getProperty = getProperty
    options.allPages = pageManager.getAll(lang)
    options.name = pkgName
    options.version = version
    options.repository = repository

    if (fsSync.existsSync(`views/${lang}/components/${name}.pug`)) return pug.renderFile(`views/${lang}/components/${name}.pug`, options)
    else if (fsSync.existsSync(`views/english/components/${name}.pug`)) {
        options.lang = "english"
        return pug.renderFile(`views/english/components/${name}.pug`, options)
    } else return null
}