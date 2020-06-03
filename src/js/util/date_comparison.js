export function compare_records_by_date(a, b) {
    if (a.date.getTime() < b.date.getTime())
        return -1
    if (a.date.getTime() > b.date.getTime())
        return 1
    return 0
}
export function compare_dates(a, b) {
    if (a.getTime() < b.getTime())
        return -1
    if (a.getTime() > b.getTime())
        return 1
    return 0
}


export function datesAreEqual(a, b) {
    return a.getTime() === b.getTime()
}

