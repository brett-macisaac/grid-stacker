import React, { useContext } from "react";
import PropTypes from 'prop-types';

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from "../../styles.js";
import TextStandard from '../text_standard/TextStandard.jsx';

function CountLabel({ text, count, size, style })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const lSizeFont = utilsGlobalStyles.fontSizeN(size);

    return (
        <div style = {{ 
                ...styles.conOuter, ...style, columnGap: lSizeFont, backgroundColor: theme.header, borderColor: theme.borders
            }}
        >

            <div style = {{ marginLeft: lSizeFont }}>
                <TextStandard text = { text } size = { size } isBold />
            </div>

            <div style = {{ 
                    ...styles.conCount, backgroundColor: theme.header, 
                    borderLeftColor: theme.borders, paddingRight: lSizeFont / 2, paddingLeft: lSizeFont / 2, 
                    minWidth: 3 * lSizeFont
                }}
            >
                <TextStandard text = { count } size = { size } isBold />
            </div>

        </div>
    );
}

CountLabel.propTypes =
{
    text: PropTypes.string.isRequired,
    count: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
    size: PropTypes.number,
    style: PropTypes.object
};

CountLabel.defaultProps =
{
    size: 0
}

const styles =
{
    conOuter:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderBottom: "1px solid",
    },

    conCount:
    {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 0.6 * utilsGlobalStyles.fontSizeN(1),
        paddingBottom: 0.6 * utilsGlobalStyles.fontSizeN(1),
        borderLeft: "1px solid",
        flexShrink: 0
    },

};

export default CountLabel;