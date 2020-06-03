export default function copyData(data) {
    return data.map(r => Object.assign({}, r));
}
