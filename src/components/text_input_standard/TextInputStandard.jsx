
import PropTypes from 'prop-types';
import React, { useContext, useState, useRef, useEffect } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';
import ButtonStandard from '../button_standard/ButtonStandard.jsx';

import "./TextInputStandard.css";

/*
* An element that returns a React Native TextInput element that adheres to the app's global styling, as defined in the 
  file 'styles_global.js'.

* Props:
    > text: The text to be rendered.
    > size: the size of the text. IMPORTANT: this is not fontSize, but rather the 'rank' of the fontSize (see 
      styles_global.js for more info).
    > isBold: whether the text is bold.
    > placeholder: the placeholder text (i.e. what is displayed when given an empty string).
    > maxLength: the maximum length of the text that can be inputted.
    > onChangeText: the function that's called when the user adds/removes text.
    > secureTextEntry: determines whether to hide the user's input. When true, the user's text is, by default hidden, 
      but an 'eye' button is rendered that allows the user to toggle this. Note that if multiline is true, this will not
      work.
    > multiline: whether the user can enter multiple lines.
    > maxHeight: the maximum height of the container before the component scrolls. This may be useful for creating a
      text-based messaging system, whereby the textbox starts at a normal single-line height, but expands to a set 
      maximum as the user enters more lines/characters.
    > style: any additional styling to apply to the TextInput element. Note that fontWeight, fontSize, 
      borderRadius, and borderColor attributes will be overridden.

* Problems:
    > The width doesn't automatically fit.
*/
function TextInputStandard({ text, size, isBold, placeholder, maxLength, onChangeText, secureTextEntry, multiline, 
                             maxHeight, style })
{
    // Whether text is visible (only relevant if the secureTextEntry flag has been set to true).
    const [ isTextVisible, setIsTextVisible ] = useState(false);

    // A reference to the text-area element.
    const refTextArea = useRef(null);

    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    /*
    * This allows the text-area element to automatically expand in height as the user enters text.
    */
    useEffect(
        () => 
        {
            const refCurrentTextArea = refTextArea.current;

            if (!refCurrentTextArea)
                return;

            // Reset the text-area's height momentarily to get the correct scrollHeight for the textarea.
            refCurrentTextArea.style.height = "0px";
            const scrollHeight = refCurrentTextArea.scrollHeight;

            // We then set the height directly, outside of the render loop
            // Trying to set this with state or a ref will product an incorrect value.
            refCurrentTextArea.style.height = scrollHeight + "px";
        }, 
        [refTextArea, text]
    );

    // The font size.
    const fontSize = utilsGlobalStyles.fontSizeN(size);

    // Whether the hide/unhide icon appears to the right of the text.
    const isEyeShown = (secureTextEntry && !multiline);

    // The text top display.
    const textDisplay = (secureTextEntry && !isTextVisible) ? '*'.repeat(text.length) : text;

    return (
        <div
            className = "textInputStandard hideScrollBar"
            style = {{
                ...styles.container,
                ...style,
                borderColor: theme.borders,
                borderRadius: fontSize / 2,
                paddingTop: fontSize / 2,
                paddingBottom: fontSize / 2,
                maxHeight: maxHeight,
                color: theme.font,
                fontWeight: isBold ? globalProps.fontWeightBold : 'normal', 
                fontSize: fontSize,
            }}
        >
            {
                (multiline) && (
                    <textarea
                        className = "hideScrollBar"
                        maxLength = { maxLength }
                        placeholder = { placeholder }
                        onChange = { (event) => onChangeText(event.target.value) }
                        rows = { 1 }
                        style = {{ 
                            marginLeft: fontSize,
                            marginRight: isEyeShown ? 0 : fontSize,
                            flex: 1,
                            fontSize: fontSize,
                            ...styles.textElement,
                            //textAlignVertical: numLines > 1 ? "top" : "auto"
                        }}
                        ref = { refTextArea }
                    >
                        { textDisplay }
                    </textarea>
                )
            }

            {
                (!multiline) && (
                    <input 
                        //type = "text" 
                        //value = { textDisplay } 
                        type = { (secureTextEntry && !isTextVisible) ? "password" : "text" }
                        value = { text } 
                        maxLength = { maxLength }
                        placeholder = { placeholder }
                        onChange = { (event) => onChangeText(event.target.value) }
                        style = {{ 
                            marginLeft: fontSize,
                            marginRight: isEyeShown ? 0 : fontSize,
                            flex: 1,
                            fontSize: fontSize,
                            ...styles.textElement,
                            //textAlignVertical: numLines > 1 ? "top" : "auto"
                        }}
                    />
                )
            }

            {/* <TextInput
                value = { text }
                placeholder = { placeholder }
                //placeholderTextColor = { theme.fontFaded }
                maxLength = { maxLength }
                onChangeText = { onChangeText }
                secureTextEntry = { secureTextEntry && !isTextVisible }
                multiline = { multiline }
                //numberOfLines = { numLines }
                //autoCorrect = { autoCorrect }
                style = {{ 
                    marginLeft: fontSize,
                    marginRight: isEyeShown ? 0 : fontSize,
                    flex: 1,
                    //textAlignVertical: numLines > 1 ? "top" : "auto"
                }}
            /> */}

            {
                isEyeShown && (
                    <ButtonStandard 
                        icon = { 
                            isTextVisible ? <VisibilityOff sx = {{ color: theme.font, fontSize: fontSize * 1.25 }} />
                                          : <Visibility    sx = {{ color: theme.font, fontSize: fontSize * 1.25 }} />
                        } 
                        onPress = { () => setIsTextVisible(!isTextVisible) }
                        style = {{ ...styles.btnVisibility, paddingLeft: fontSize, paddingRight: fontSize }}
                    />
                )
            }

        </div>
    );
}

TextInputStandard.propTypes =
{
    text: PropTypes.string.isRequired,
    size: PropTypes.number,
    isBold: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    onChangeText: PropTypes.func,
    secureTextEntry: PropTypes.bool,
    multiline: PropTypes.bool,
    maxHeight: PropTypes.number,
    numLines: PropTypes.number,
    autoCorrect: PropTypes.bool,
    style: PropTypes.object,
};

TextInputStandard.defaultProps =
{
    size: 0,
    isBold: false,
    placeholder: "",
    maxLength: undefined,
    onChangeText: undefined,
    secureTextEntry: false,
    multiline: false,
    maxHeight: undefined,
    numLines: undefined,
    autoCorrect: true,
    style: {},
}

const styles =
{
    container:
    {
        border: "1px solid",
        flexDirection: "row",
        justifyContent: "space-between",
        overflowY: "scroll",
        flexShrink: 0
    },
    textElement:
    {
        backgroundColor: "transparent",
        border: "none"
    },
    btnVisibility:
    {
        backgroundColor: "transparent",
    }
};

export default TextInputStandard;