
import PropTypes from 'prop-types';
import React, { useContext } from "react";
import ChevronRight from '@mui/icons-material/ChevronRight';

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
    > backgroundColorIcon: the backgroundColor of the icon.
    > onPress: the function that is called when the button is pressed.
    > style: the style of the component's container.
    > styleText: the style of the text within the container. The TextStandard component is used here, so refer to that
                 component's code for information regarding how styling is applied.
*/
function ButtonNextPage({ icon, text, sizeText, isBold, backgroundColorIcon, onPress, style, styleText })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return (
        <div
            onClick = { onPress }
            style = {{ 
                backgroundColor: theme.buttonContent,
                borderColor: theme.borders,
                ...styles.container, 
                ...style,
                padding: utilsGlobalStyles.fontSizeN(sizeText) / 2
            }}
            //activeOpacity = { 0.8 } // Changes the component's opacity when pressed.
        >
            <div style = { styles.conTextAndIcon }>

                <div style = {{ backgroundColor: backgroundColorIcon }}>
                    { icon }
                </div>

                {/* The button's text. */}
                {
                    text && (
                        <TextStandard 
                            text = { text } 
                            size = { sizeText } 
                            isBold = { isBold } 
                            style = {{ 
                                color: theme.fontButtonContent, ...styleText, textAlign: "center", 
                                marginLeft: utilsGlobalStyles.fontSizeN(sizeText)
                            }}
                        />
                    )
                }
            </div>

            <ChevronRight 
                sx = {{ color: theme.fontButtonContent, fontSize: globalProps.sizeIconHeaderFooter }}
            />
        </div>
    );
}

ButtonNextPage.propTypes =
{
    icon: PropTypes.node,
    text: PropTypes.string.isRequired,
    sizeText: PropTypes.number,
    isBold: PropTypes.bool,
    backgroundColorIcon: PropTypes.string,
    onPress: PropTypes.func,
    style: PropTypes.object,
    styleText: PropTypes.object,
};

ButtonNextPage.defaultProps =
{
    sizeText: 0,
    isBold: false,
    backgroundColorIcon: "transparent",
    style: {},
    styleText: {}
}

const styles = 
{
    container:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderStyle: "solid",
        // borderRadius: 10,
        width: "100%",
        maxWidth: 700
    },
    conTextAndIcon: 
    {
        alignItems: "center",
        flexDirection: "row"
    }
};

export default ButtonNextPage;