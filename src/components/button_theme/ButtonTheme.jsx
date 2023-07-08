import React from 'react';
import PropTypes from 'prop-types';

import globalProps, { utilsGlobalStyles } from '../../styles';

/*
* A customisable button component which by default implements the app's global theme.

* Props:
    > themeName: the name of the theme. This should correspond to a theme from globalThemes (defined in styles_global).
    > onPress: the function that is called when the button is pressed.
    > height: the component's height
    > width: the component's width.
    > isSelected: whether the component is selected (this should be done using the onPress prop).
*/
function ButtonTheme({ themeName, onPress, height, width, isSelected })
{
    let theme = globalProps.themes[themeName];

    if (!theme)
        theme = globalProps.themes[globalProps.themeDefault];

    return (
        <div
            onClick = { onPress }
            style = {{ 
                backgroundColor: theme.buttonContent,
                borderColor: theme.selected,
                height: height,
                width: width,
                borderWidth: isSelected ? 3 : 0,
                borderStyle: "solid",
                ...styles.container,
            }}
            // activeOpacity = { 0.8 } // Changes the component's opacity when pressed.
        >

            <div 
                style = {{ 
                    ...styles.headerOrNavBar, ...styles.header, backgroundColor: theme.header, 
                    borderColor: theme.borders  
                }}
            >
            </div>

            <div style = {{ ...styles.content, backgroundColor: theme.content }}>
            </div>

            <div 
                style = {{ 
                    ...styles.headerOrNavBar, ...styles.navBar, backgroundColor: theme.navBar, 
                    borderColor: theme.borders 
                }}
            >
            </div>

        </div>
    );
}

ButtonTheme.propTypes =
{
    themeName: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    height: PropTypes.number,
    width: PropTypes.number,
};

ButtonTheme.defaultProps =
{
    height: 100,
    width: 45,
}

const styles = 
{
    container:
    {
        flexDirection: "column",
        borderRadius: globalProps.borderRadiusStandard,
        overflow: "hidden",
        // alignItems: "center",
        // justifyContent: "center"
    },
    content: 
    {
        flexGrow: 70
    },
    headerOrNavBar:
    {
        flexGrow: 15
    },
    header:
    {
        borderBottom: "1px solid"
    },
    navBar:
    {
        borderTop: "1px solid"
    }   
};

export default ButtonTheme;