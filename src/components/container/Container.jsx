
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import globalProps, { utilsGlobalStyles } from "../../styles.js";
import TextStandard from '../text_standard/TextStandard.jsx';
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
function Container({ children, styleOuter, style, title })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return ( 
        <div 
            style = {{ 
                ...styles.container, width: globalProps.widthCon, backgroundColor: theme.content,
                borderColor: theme.borders, ...styleOuter
            }}
        >
            {
                title && (
                    <TextStandard 
                        text = { title } size = { 1 } isBold
                        style = {{ ...styles.title, backgroundColor: theme.header }}
                    />
                )
            }

            <div style = { { ...styles.conInner, ...style, } }>
                { children }
            </div>

        </div>
    );
}

Container.propTypes =
{
    children: PropTypes.node,
    styleOuter: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string
};

Container.defaultProps =
{
    title: ""
}

const styles =
{
    container:
    {
        flexShrink: 0,
        flexDirection: "column",
        width: globalProps.widthCon,
        borderRadius: 2 * globalProps.borderRadiusStandard,
        border: "1px solid",
        overflow: "hidden"
    },
    conInner:
    {
        padding: utilsGlobalStyles.spacingVertN(-1),
        flexDirection: "column",
    },
    title:
    {
        width: "100%",
        padding: "12px 15px",
        borderBottom: "1px solid"
    }
};


export default Container;