export function compare_records_by_date(a, b) {
    if (a.date < b.date)
        return -1
    if (a.date > b.date)
        return 1
    return 0
}
