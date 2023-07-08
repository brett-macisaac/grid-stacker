import PropTypes from 'prop-types';
import React, { useContext } from "react";

import ButtonStandard from '../button_standard/ButtonStandard';
import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';

/*
* A button that is designed to be displayed in a page's Header component. As with most apps, the header button is simply
  an icon (i.e. no text).

* Props:
    > icon: a function that takes a parameter list of (size, colour) and returns a vector icon (such as from Ionicons) 
      that uses the size and colour arguments for its corresponding props.
    > onPress: onPress prop is a function that's called when the icon is clicked.
*/
function HeaderButton({ icon, onPress })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return (
        <ButtonStandard 
            icon = { icon(globalProps.sizeIconHeaderFooter, theme.iconHeader) }
            onPress = { onPress }
            style = { styles.button }
        />
    )
};

HeaderButton.propTypes =
{
    icon: PropTypes.func.isRequired,
    onPress: PropTypes.func.isRequired,
};

const styles = 
{
    button:
    {
        backgroundColor: 'transparent',
        paddingTop: (globalProps.heightHeader - globalProps.sizeIconHeaderFooter) / 2,
        paddingBottom: (globalProps.heightHeader - globalProps.sizeIconHeaderFooter) / 2,
        paddingLeft: (globalProps.heightHeader - globalProps.sizeIconHeaderFooter) / 3,
        paddingRight: (globalProps.heightHeader - globalProps.sizeIconHeaderFooter) / 3
    }
}

export default HeaderButton;