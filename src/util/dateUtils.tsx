export const handleNewDateToUTC = () => {
    return Date.parse(new Date().toUTCString())
}

export const handleUTCToDate = (utc: string) => {
    return new Date(utc)
}
export const handleUTCToDateShow = (utc: string) => {
    const date = new Date(parseInt(utc))
    const month = (date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    const day = date.getUTCDate().toString().length === 1 ? "0" + date.getUTCDate() : date.getUTCDate()
    return day + "/" + month + "/" + date.getFullYear()
}