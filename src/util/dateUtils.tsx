import { ONLY_NUMBERS_PATTERN_TWO } from "./patternValidationUtil";

export const handleNewDateToUTCOld = () => {
    return Date.parse(new Date().toUTCString())
}

export const handleNewDateToUTC = () => {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds());
    return now_utc
}

export const handleRemoveDateMask = (text: string) => {
    if (text) {
        text = text.replaceAll("/", "")
        text = text.replace(new RegExp(ONLY_NUMBERS_PATTERN_TWO), "")
    }
    return text
}

export const handleGetDateFormatedToUTC = (date: string) => {
    let dateUTC = 0
    const dateText = handleRemoveDateMask(date)
    if (dateText?.length === 8) {
        const day = dateText.substring(0, 2)
        const month = dateText.substring(2, 4)
        const year = dateText.substring(4, dateText.length)
        const utcString = new Date(month + " " + day + " " + year).toUTCString()
        dateUTC = Date.parse(utcString)
    }
    return dateUTC
}

export const handleUTCToDate = (utc: string) => {
    return new Date(utc)
}

export const handleUTCToDateShow = (utc: string) => {
    {/*
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    date.toLocaleString("en-US", { timeZone: tz })
*/}
    const date = new Date(parseInt(utc))
    const month = (date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    const day = date.getUTCDate().toString().length === 1 ? "0" + date.getUTCDate() : date.getUTCDate()
    return day + "/" + month + "/" + date.getFullYear()
}

export const handleUTCToDateFullShow = (utc: string) => {
    {/*
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    date.toLocaleString("en-US", { timeZone: tz })
*/}
    const date = new Date(parseInt(utc))
    const month = (date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    const day = date.getUTCDate().toString().length === 1 ? "0" + date.getUTCDate() : date.getUTCDate()
    const hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours()
    const minute = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes()
    return hour + ":" + minute + " de " + day + "/" + month + "/" + date.getFullYear()
}