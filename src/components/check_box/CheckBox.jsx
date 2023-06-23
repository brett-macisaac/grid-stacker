import Done from '@mui/icons-material/Done';
import PropTypes from 'prop-types';
import React, { useContext } from "react";

import TextStandard from '../text_standard/TextStandard.jsx';
import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps from "../../styles.js";

function CheckBox({ text, isChecked, onPress, monospaceFont, style })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return (
        <div style = {{ ...styles.conOuter, ...style, backgroundColor: theme.header }} onClick = { onPress }>

            <div className = "hideScrollBar" style = { styles.conText }>
                <TextStandard text = { text } isBold = { true } isMonospace = { monospaceFont } />
            </div>

            <div style = { { ...styles.check, backgroundColor: isChecked ? theme.selected : theme.font } }>
                {
                    isChecked && (
                        <Done 
                            sx = { { color: "#ffffff", fontSize: 2 * globalProps.fontSizeBase } }
                        />
                    )
                }
            </div>

        </div>
    );
}

CheckBox.propTypes =
{
    text: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    onPress: PropTypes.func,
    monospaceFont: PropTypes.bool,
    style: PropTypes.object
};

CheckBox.defaultProps =
{
    monospaceFont: false,
    style: {}
}

const styles =
{
    conOuter:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "#000",
        paddingTop: 0.4 * globalProps.fontSizeBase,
        paddingBottom: 0.4 * globalProps.fontSizeBase,
        paddingLeft: 0.75 * globalProps.fontSizeBase,
        paddingRight: 0.75 * globalProps.fontSizeBase,
        borderRadius: globalProps.borderRadiusStandard
    },

    conText:
    {
        marginRight: globalProps.fontSizeBase,
        overflowX: "scroll"
    },

    check:
    {
        flexShrink: 0,
        width: 2.3 * globalProps.fontSizeBase,
        height: 2.3 * globalProps.fontSizeBase,
        borderRadius: (2.3 * globalProps.fontSizeBase) / 2,
        alignItems: "center",
        justifyContent: "center"
    }

};

export default CheckBox;