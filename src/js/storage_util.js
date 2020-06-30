export default function persistentStateLoader(primaryKey, defaultValue, ...legacyKeys) {
    let value = window.localStorage.getItem(primaryKey)
    if (value != null) {
        return value
    }

    legacyKeys.forEach(key => {
        let value = window.localStorage.getItem(key)
        if (value != null) {
            window.localStorage.setItem(primaryKey, value)
            window.localStorage.removeItem(key)
            return value
        }
    })
    return defaultValue
}
