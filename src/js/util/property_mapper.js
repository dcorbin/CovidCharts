export default function propertyMapper(propertyName) {
    return (record) => {
        let propertyNames = propertyName.split('.')
        return propertyNames.reduce((total, element) => total[element], record)
    };
}