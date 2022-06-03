export const handleNewDateToUTC = () => {
    return Date.parse(new Date().toUTCString())
}

export const handleUTCToDate = (utc: string) => {
    return new Date(utc)
}