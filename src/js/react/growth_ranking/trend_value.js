import PropTypes from "prop-types";

TrendValue.defaultProps = {
    precision: 0
}
TrendValue.propTypes = {
    value: PropTypes.number.isRequired,
    infinity: PropTypes.string,
    NaN: PropTypes.string,
    precision: PropTypes.number
}
export default function TrendValue(props) {
    if (props.value === null) {
        return "-"
    }
    if (isNaN(props.value) && props.NaN)  {
        return props.NaN
    }
    if (props.value === Infinity && props.infinity) {
        return props.infinity
    }

    return props.value.toFixed(props.precision)
}