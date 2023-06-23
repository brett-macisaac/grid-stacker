
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import globalProps, { utilsGlobalStyles } from "../../styles.js";
import ThemeContext from "../../contexts/ThemeContext.js";

/* 
* This is the parent component of every page, meaning that it should wrap every page of the application.
* Expected Behaviour: if the supplied children elements do not fill the entire vertical space between the header and 
  footer, the container is expected to take 100% of this space. This is ideal because one may want to center the content
  vertically, such as on a log-in screen, where the input fields are typically centered.
* Note: padding is applied both vertically and horizontally by default, but this can be overridden by the style prop.

* Props:
    > children: any children components.
    > navigation: the navigation object.
    > nameHeaderLeft: the name of the button to be displayed on the left portion of the header. This should correspond
      to a value of Header.buttonNames.
    > nameHeaderRight: the name of the button to be displayed on the right portion of the header. This should 
      correspond to a value of Header.buttonNames.
    > style: an optional styling object for the container of the content.
*/
function Container({ children, style })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return ( 
        <div 
            style = {{ 
                ...style, ...styles.container, width: globalProps.widthCon, backgroundColor: theme.content,
                borderColor: theme.borders 
            }}
        >

            { children }

        </div>
    );
}

Container.propTypes =
{
    children: PropTypes.node,
    style: PropTypes.object,
};

Container.defaultProps =
{
    style: {}
}

const styles =
{
    container:
    {
        width: globalProps.widthCon,
        padding: utilsGlobalStyles.spacingVertN(-1),
        borderRadius: 2 * globalProps.borderRadiusStandard,
        border: "1px solid"
    }
};


export default Container;