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