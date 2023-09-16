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
                style = {{ ...styles.button, backgroundColor: theme.header, borderColor: theme.borders, border: `1px solid ${theme.borders}` }}
                prColourBackground = { theme.header }
                prColourEmptyCell = { theme.header }
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
        width: "100%",
        paddingTop: 20,
        paddingBottom: 20,
    },
    button:
    {
        width: "80%",
        maxWidth: 500,
        alignItems: "center",
        padding: 15,
        // marginTop: utilsGlobalStyles.spacingVertN(-2),
        // marginBottom: utilsGlobalStyles.spacingVertN(-2),
        borderRadius: globalProps.borderRadiusStandard,
    },
};

export default NavBar;