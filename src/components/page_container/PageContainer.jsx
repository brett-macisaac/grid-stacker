import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';

import globalProps, { utilsGlobalStyles } from "../../styles.js";
import ThemeContext from "../../contexts/ThemeContext.js";
import Header from '../header/Header.jsx';
import NavBar from '../nav_bar/NavBar.jsx';
import PopUpStandard from '../pop_up_standard/PopUpStandard.jsx';
//import PopUpStandard from './PopUpStandard.js';

/* 
* This is the parent component of every page, meaning that it should wrap every page of the application.
* Expected Behaviour: if the supplied children elements do not fill the entire vertical space between the header and 
  footer, the container is expected to take 100% of this space. This is ideal because one may want to center the content
  vertically, such as on a log-in screen, where the input fields are typically centered.
* Note: padding is applied both vertically and horizontally by default, but this can be overridden by the style prop.

* Props:
    > children: any children components.
    > navigate: the navigate object.
    > buttonNavBarText: the text of the NavBar button.
    > buttonNavBarHandler: the onPress function of the NavBar button.
    > headerBtnsLeft: this prop is passed as the btnsLeft of the page's Header component.
    > headerBtnsRight: this prop is passed as the btnsRight of the page's Header component.
    > optionsPopUpMsg: an object which defines the content of the pop-up message. If undefined/falsy (which it is by 
      default), a pop-up message isn't displayed. The properties of this object that are used are the props of the 
      PopUpStandard component.
    > style: an optional styling object for the container of the content.
*/
function PageContainer({ children, navigate, showHeader, buttonNavBarText, buttonNavBarHandler, headerBtnsLeft, 
                         headerBtnsRight, optionsPopUpMsg, style })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg ] = useState(undefined);

    // Whether the (onscreen) keyboard is displayed.
    const [ stIsKeyboardActive, setIsKeyboardActive ] = useState(false);

    /*
    * Setup the event listeners that are responsible for setting stIsKeyboardActive.
    */
    // useEffect(
    //     () => 
    //     {
    //         const showSubscription = Keyboard.addListener(
    //             'keyboardDidShow', 
    //             () => 
    //             {
    //                 setIsKeyboardActive(true);
    //             }
    //         );

    //         const hideSubscription = Keyboard.addListener(
    //             'keyboardDidHide', 
    //             () => 
    //             {
    //                 setIsKeyboardActive(false);
    //             }
    //         );

    //         return () => 
    //         {
    //             showSubscription.remove();
    //             hideSubscription.remove();
    //         };
    //     }, 
    //     []
    // );

    useEffect(
        () =>
        {
            if (!optionsPopUpMsg)
                setOptionsPopUpMsg(undefined);
            else
                setOptionsPopUpMsg(optionsPopUpMsg);
        },
        [ optionsPopUpMsg ]
    );

    return ( 
        <div style = {{ ...styles.container, backgroundColor: theme.content }}>

            {
                (stOptionsPopUpMsg) && 
                    <PopUpStandard 
                        { ...stOptionsPopUpMsg } 
                        removePopUp = { () => setOptionsPopUpMsg(undefined) } 
                    />
            }

            {
                showHeader && (
                    <Header 
                        navigate = { navigate }
                        btnsLeft = { headerBtnsLeft }
                        btnsRight = { headerBtnsRight }
                        setOptionsPopUpMsg = { setOptionsPopUpMsg }
                    />
                )
            }

            <div 
                className = "hideScrollBar"
                style = {{ ...styles.content, ...style, }}
            > 
                { children }
            </div>

            {
                ((buttonNavBarText && buttonNavBarHandler) && !stIsKeyboardActive) && (
                    <NavBar
                        text = { buttonNavBarText }
                        onPress = { buttonNavBarHandler }
                    />
                )
            }

        </div>
    );
}

PageContainer.propTypes =
{
    children: PropTypes.node,
    navigate: PropTypes.func.isRequired,
    showHeader: PropTypes.bool,
    buttonNavBarText: PropTypes.string,
    buttonNavBarHandler: PropTypes.func,
    headerBtnsLeft: PropTypes.arrayOf(
        PropTypes.elementType
    ),
    headerBtnsRight:  PropTypes.arrayOf(
        PropTypes.elementType
    ),
    optionsPopUpMsg: PropTypes.object,
    style: PropTypes.object,
};

PageContainer.defaultProps =
{
    showHeader: true,
    buttonNavBarText: "",
    buttonNavBarHandler: undefined,
    optionsPopUpMsg: undefined,
    style: {}
}

const styles = 
{
    container:
    {
        flex: 1,
        overflow: 'hidden',
        flexDirection: "column",
        alignItems: "center"
    },
    content: 
    {
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
        overflowY: "scroll",
        paddingTop: utilsGlobalStyles.spacingVertN(),
        paddingBottom: utilsGlobalStyles.spacingVertN(),
        paddingLeft: utilsGlobalStyles.spacingVertN(-1),
        paddingRight: utilsGlobalStyles.spacingVertN(-1),
        width: "100%"
    }
}


export default PageContainer;