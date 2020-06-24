import PropTypes from "prop-types";

TrendValue.defaultProps = {
    precision: 0
}
TrendValue.propTypes = {
    value: PropTypes.number,
    precision: PropTypes.number
}
export default function TrendValue(props) {
    if (props.value === null) {
        return "-"
    }
    return props.value.toFixed(props.precision)
}