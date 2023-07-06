import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';
import GridDisplayer from "../grid_displayer/GridDisplayer.jsx";
import GridChar from "../../classes/GridChar.js";

function TextBlocks({ prText, prSizeText, prStyle, prIsHorizontal, prColourBackground, prColourEmptyCell, prColourText, prColourPattern, prColourBorder })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // Must save the 'gridified' text in state so that the colours aren't randomised every time a render occurs.
    const [ stTextGridified, setTextGridified ] = useState(
        prText.split(' ').map(
            (pWord) => 
            {
                return pWord.split('').map((char) => { return new GridChar(char, prColourText); })
            }
        )
    );

    let lIndexColourPattern = 0;

    return (
        <div style = {{ ...styles.container, ...prStyle, columnGap: prSizeText * 0.6 }}>
            {
                stTextGridified.map(
                    (pWordGridified, pIndex) =>
                    {
                        return (
                            <div 
                                key  = {pIndex } 
                                style = {{ 
                                    flexDirection: prIsHorizontal ? "row" : "column", 
                                    columnGap: prSizeText * 0.14,
                                    rowGap: prSizeText * 0.20
                                }}
                                >
                                {
                                    pWordGridified.map(
                                        (pCharGridified, pIndex2) =>
                                        {
                                            if (prColourPattern)
                                            {
                                                pCharGridified.setColour(prColourPattern[lIndexColourPattern]);
                                                lIndexColourPattern = (lIndexColourPattern + 1) % prColourPattern.length;
                                            }
                                            else if (prColourText)
                                            {
                                                pCharGridified.setColour(prColourText);
                                            }
                                            else
                                            {
                                                pCharGridified.setColourRandom();
                                            }

                                            return (
                                                <GridDisplayer 
                                                    key = { pIndex2 } prGrid = { pCharGridified.grid } 
                                                    prMaxWidth = { prSizeText } prMaxHeight = { prSizeText } 
                                                    prColourBackground = { prColourBackground ? prColourBackground : theme.content } 
                                                    prColourEmptyCell = { prColourEmptyCell ? prColourEmptyCell : theme.emptyGridCell }
                                                    prColourBorder = { prColourBorder }
                                                />
                                            );
                                        }
                                    )
                                }
                            </div>
                        )
                    }
                )
            }
        </div>
    );
}


TextBlocks.propTypes =
{
    prText: PropTypes.string.isRequired,
    prSizeText: PropTypes.number,
    prIsHorizontal: PropTypes.bool,
    prColourBackground: PropTypes.string,
    prColourText: PropTypes.string,
    prColourPattern: PropTypes.arrayOf(PropTypes.string),
    prColourBorder: PropTypes.string
};

TextBlocks.defaultProps =
{
    prIsHorizontal: true,
    prSizeText: 40
}

const styles =
{
    container:
    {
        flexDirection: "row", 
        flexWrap: "wrap",
        rowGap: utilsGlobalStyles.spacingVertN(-1), 
        columnGap: utilsGlobalStyles.spacingVertN()
    },
};

export default TextBlocks;