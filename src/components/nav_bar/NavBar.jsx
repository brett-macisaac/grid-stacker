import React, { useContext } from "react";

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';
import ButtonBlocks from "../button_blocks/ButtonBlocks.jsx"

function NavBar({ text, onPress })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return (
        <div style = {{ ...styles.container, backgroundColor: theme.navBar, borderTopColor: theme.borders }}>
            <ButtonBlocks 
                text = { text }
                onPress = { onPress }
                style = {{ ...styles.button, backgroundColor: theme.buttonNavBar, borderColor: theme.borders }}
                prColourBackground = { theme.buttonNavBar }
                prColourEmptyCell = { theme.buttonNavBar }
            />
        </div>
    );
}

const styles =
{
    container:
    {
        alignItems: "center",
        justifyContent: "center",
        //height: globalProps.heightNavBar,
        borderTop: "1px solid",
        width: "100%"
    },
    button:
    {
        width: "80%",
        maxWidth: 500,
        alignItems: "center",
        padding: 10,
        marginTop: utilsGlobalStyles.spacingVertN(-2),
        marginBottom: utilsGlobalStyles.spacingVertN(-2),
        borderRadius: globalProps.borderRadiusStandard,
    },
};

export default NavBar;