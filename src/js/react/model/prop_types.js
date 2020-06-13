import PropTypes from "prop-types";
export const QUICK_PICK_PROP_TYPES =
    PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        regions: PropTypes.arrayOf(PropTypes.string),
        regionsFilter: PropTypes.func
    })
