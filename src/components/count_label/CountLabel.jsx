import React, { useContext } from "react";

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from "../../styles.js";
import TextStandard from '../text_standard/TextStandard.jsx';

function CountLabel({ text, count, size })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return (
        <div style = {{ 
                ...styles.conOuter,  backgroundColor: theme.header, borderColor: theme.borders
            }}
        >

            <div style = {{ marginLeft: utilsGlobalStyles.fontSizeN(size) }}>
                <TextStandard text = { text } size = { size } isBold />
            </div>

            <div style = {{ 
                    ...styles.conCount, width: 3 * utilsGlobalStyles.fontSizeN(size), backgroundColor: theme.header, 
                    borderLeftColor: theme.borders
                }}
            >
                <TextStandard text = { count } size = { size } isBold />
            </div>

        </div>
    );
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
        marginBottom: Math.floor(utilsGlobalStyles.spacingVertN(-1)),
    },

    conCount:
    {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 0.6 * utilsGlobalStyles.fontSizeN(1),
        paddingBottom: 0.6 * utilsGlobalStyles.fontSizeN(1),
        borderLeft: "1px solid"
    },

};

export default CountLabel;