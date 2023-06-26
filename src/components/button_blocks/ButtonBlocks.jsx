//import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React, { useContext, useState } from "react";

import GridChar from '../../classes/GridChar';
import GridDisplayer from '../grid_displayer/GridDisplayer';
import TextBlocks from '../text_blocks/TextBlocks';
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
    > style: the style of the component's container.
    > styleText: the style of the text within the container. The TextStandard component is used here, so refer to that
                 component's code for information regarding how styling is applied.
*/
function ButtonBlocks({ text, prSizeText, onPress, onSinglePress, doubleClick, style, prColourBackground, prColourEmptyCell, prColourText, prColourBorder, prIsHorizontal })
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
    };

    return (
        <div
            onClick = { handlePress }
            style = {{ 
                backgroundColor: theme.buttonContent,
                borderColor: theme.borders,
                ...styles.button, 
                ...style 
            }}
        >

            <TextBlocks 
                prText = { text } 
                prSizeText = { prSizeText }
                prColourText = { prColourText } 
                prColourBackground = { prColourBackground } 
                prColourEmptyCell = { prColourEmptyCell } 
                prColourBorder = { prColourBorder }
                prIsHorizontal = { prIsHorizontal }
            />

        </div>
    );
}

ButtonBlocks.propTypes =
{
    text: PropTypes.string,
    prSizeText: PropTypes.number,
    onPress: PropTypes.func,
    onSinglePress: PropTypes.func,
    doubleClick: PropTypes.bool,
    style: PropTypes.object,
    prIsHorizontal: PropTypes.bool
};

ButtonBlocks.defaultProps =
{
    text: "",
    doubleClick: false,
    style: {},
    prIsHorizontal: true
}

const styles =
{
    button:
    {
        // flexDirection: "row",
        // flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        // columnGap: 25, 
        // rowGap: 12
    }
};

export default ButtonBlocks;