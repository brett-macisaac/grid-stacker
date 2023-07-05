//import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React, { useContext, useState } from "react";

import TextStandard from '../text_standard/TextStandard';
import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';

/*
* A customisable button component which by default implements the app's global theme.

* Props:
    > icon: a component such as a vector image from a library like MaterialCommunityIcons. For more icons, see the
            following link: https://oblador.github.io/react-native-vector-icons/.
    > text: the text that is displayed on the button.
    > sizeText: the size of the text. IMPORTANT: this is not fontSize, but rather the 'rank' of the fontSize (see 
                styles_global.js for more info).
    > isBold: whether the text is bold.
    > activeOpacity: how opaque the button is when it's pressed, where 1.0 is completely opaque (i.e. no change) and 0.0
      is completely transparent.
    > onPress: the function that is called when the button is pressed.
    > onSinglePress: when the doubleClick prop is set to true, this function is called if the user doesn't execute a 
                     'double-click': i.e. when they press once but don't press again within the allocated time.
    > doubleClick: whether a 'double click' is required to activate the button's onPress.
    > isOnDown: whether the onPress function should be called immediately when the user presses it, or if it should only
      be called once the user has released their finger/mouse.
    > style: the style of the component's container.
    > styleText: the style of the text within the container. The TextStandard component is used here, so refer to that
                 component's code for information regarding how styling is applied.
*/
function ButtonStandard({ children, icon, text, sizeText, isBold, onPress, onSinglePress, doubleClick, 
                          isOnDown, style, styleText })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const [ pressTimes, setPressTimes ] = useState([ 0, 0, 0 ]);

    const [indexPressPrevious, setIndexPressPrevious ] = useState(0);

    const handlePress = () => 
    {
        if (!doubleClick)
        {
            onPress();
            return;
        }

        const timeCurrent = new Date().getTime();

        const indexPress = pressTimes.indexOf(0);

        console.log(indexPress);

        if (indexPress != 0)
        {
            const timeBetweenPresses = timeCurrent - pressTimes[indexPress - 1];

            if (timeBetweenPresses <= 1500)
            {
                onPress();

                setPressTimes([ 0, 0, 0 ]);
            }
            else
            {
                setPressTimes(prev => { return [ prev[0], timeCurrent, 0 ] });

                if (onSinglePress && timeBetweenPresses <= 6000 && indexPressPrevious == 0)
                {
                    onSinglePress();
                }
            }
        }
        else
        {
            setPressTimes([ timeCurrent, 0, 0 ]);
        }

        setIndexPressPrevious(indexPress);
    }

    let lPressFunctions = { };
    if (isOnDown)
    {
        lPressFunctions.onMouseDown = handlePress;
        lPressFunctions.onTouchStart = (e) => { e.preventDefault(); handlePress() };
    }
    else
    {
        lPressFunctions.onClick = handlePress;
    }

    return (
        <div
            { ...lPressFunctions }
            //onClick = { handlePress }
            style = {{ 
                backgroundColor: theme.buttonContent,
                borderColor: theme.borders,
                ...styles.button, 
                ...style 
            }}
            //activeOpacity = { activeOpacity} // Changes the component's opacity when pressed.
        >
            {/* The button's icon. If present, the icon is placed above text. */}
            { icon }

            {/* The button's text. */}
            {
                text && (
                    <TextStandard 
                        text = { text } 
                        size = { sizeText } 
                        isBold = { isBold } 
                        style = {{ 
                            color: theme.fontButtonContent, ...styleText, textAlign: "center" 
                        }}
                    />
                )
            }

            { children }

        </div>
    );
}

ButtonStandard.propTypes =
{
    icon: PropTypes.node,
    text: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    sizeText: PropTypes.number,
    isBold: PropTypes.bool,
    opacity: PropTypes.number,
    onPress: PropTypes.func,
    onSinglePress: PropTypes.func,
    doubleClick: PropTypes.bool,
    isOnDown: PropTypes.bool,
    style: PropTypes.object,
    styleText: PropTypes.object,
};

ButtonStandard.defaultProps =
{
    text: "",
    sizeText: 0,
    isBold: false,
    activeOpacity: 0.7,
    doubleClick: false,
    isOnDown: false,
    style: {},
    styleText: {}
}

const styles =
{
    button:
    {
        alignItems: "center",
        justifyContent: "center"
    }
};

export default ButtonStandard;