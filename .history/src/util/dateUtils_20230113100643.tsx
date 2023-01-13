import { ONLY_NUMBERS_PATTERN_TWO } from "./patternValidationUtil";

export const handleOnlyDate = (date: string) => {
    let dateFinal = date
    console.log(date)
    const arrayDate = date?.split("T")[0] ?? ""
    if (arrayDate.length > 0) {
        const array = arrayDate.split("-")
        dateFinal = array[2] + "/" + array[1] + "/" + array[0]
    }
    return dateFinal
}

export const handleDateToShow = (date: string) => {
    let dateFinal = date
    console.log(date)
    const arrayDate = date?.split("T")[0] ?? ""
    if (arrayDate.length > 0) {
        const array = arrayDate.split("-")
        dateFinal = array[2] + "/" + array[1] + "/" + array[0]
    }
    return dateFinal
}

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
        try {
            text = text?.replaceAll("/", "")
            text = text?.replace(new RegExp(ONLY_NUMBERS_PATTERN_TWO), "")
        } catch (err) {
            console.error(err)
        }
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
    let dateShow = "n/a"
    {/*
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    date.toLocaleString("en-US", { timeZone: tz })
*/}
    if (utc && utc !== "0") {
        const date = new Date(parseInt(utc))
        const month = (date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
        const day = date.getUTCDate().toString().length === 1 ? "0" + date.getUTCDate() : date.getUTCDate()
        dateShow = day + "/" + month + "/" + date.getFullYear()
    }
    return dateShow
}

export const handleUTCToDateFullShow = (utc: string) => {
    let dateShow = "n/a"
    {/*
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    date.toLocaleString("en-US", { timeZone: tz })
*/}
    if (utc && utc !== "0") {
        const date = new Date(parseInt(utc))
        const month = (date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
        const day = date.getUTCDate().toString().length === 1 ? "0" + date.getUTCDate() : date.getUTCDate()
        const hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours()
        const minute = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes()
        dateShow = hour + ":" + minute + " de " + day + "/" + month + "/" + date.getFullYear()
    }
    return dateShow
}