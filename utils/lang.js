import fsSync from 'node:fs'
import { DateTime } from "luxon";

class Lang {
    getString(lang, name) {
        const langFile = JSON.parse(fsSync.readFileSync("assets/languages.json", "utf-8"));
        return langFile?.[lang]?.strings?.[name] || langFile?.english?.strings?.[name] || '';
    }
    
    getProperty(lang, name) {
        const langFile = JSON.parse(fsSync.readFileSync("assets/languages.json", "utf-8"));
        return langFile?.[lang]?.[name] || null;
    }
    
    getFeedProperty(lang, name) {
        const langFile = JSON.parse(fsSync.readFileSync("assets/languages.json", "utf-8"));
        return langFile?.[lang]?.feed?.[name] || langFile?.english?.feed?.[name] || '';
    }

    formatDate(lang, date) {
        return DateTime.fromJSDate(date).toFormat(this.getProperty(lang, 'dateFormat'))
    }
}

export default Lang