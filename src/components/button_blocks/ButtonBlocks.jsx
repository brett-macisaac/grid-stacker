//import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React, { useContext, useState } from "react";

import GridChar from '../../classes/GridChar';
import GridDisplayer from '../grid_displayer/GridDisplayer';
import ButtonStandard from '../button_standard/ButtonStandard';
import TextBlocks from '../text_blocks/TextBlocks';
import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';

/*
* A 'blockified' button component which by default implements the app's global theme.

* Props:
*/
function ButtonBlocks({ text, prSizeText, onPress, onSinglePress, doubleClick, isOnDown, style, prColourBackground, 
                        prColourEmptyCell, prColourText, prColourBorder, prIsHorizontal })
{
    // Acquire global theme.
    // const { themeName } = useContext(ThemeContext);
    // let theme = globalProps.themes[themeName];

    return (
        <ButtonStandard 
            onPress = { onPress } onSinglePress = { onSinglePress } 
            style = { style } doubleClick = { doubleClick } isOnDown = { isOnDown }
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
        </ButtonStandard>
    );
}

ButtonBlocks.propTypes =
{
    text: PropTypes.string,
    prSizeText: PropTypes.number,
    onPress: PropTypes.func,
    onSinglePress: PropTypes.func,
    doubleClick: PropTypes.bool,
    isOnDown: PropTypes.bool,
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
};

export default ButtonBlocks;