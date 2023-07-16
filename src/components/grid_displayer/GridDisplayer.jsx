import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import globalProps, { utilsGlobalStyles } from "../../styles.js";
import ThemeContext from "../../contexts/ThemeContext.js";
import Grid from '../../classes/Grid.js';
//import "./style_grid_pool_ball.css";

function GridDisplayer({ prGrid, prMaxWidth, prMaxHeight, prOnClick, prColourEmptyCell, prColourBackground, prColourBorder })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const lDimensionGrid = prGrid.dimension;

    // The total amount of space required for the squares' margins in the horizontal direction.
    const lSumMarginWidth = styles.container.columnGap * (lDimensionGrid.columns - 1);

    // The total amount of space required for the squares' margins in the vertical direction.
    let lSumMarginHeight = styles.container.rowGap * (lDimensionGrid.rows - 1);

    let lBorderWidth = 2 * parseInt(styles.container.border);

    // The (max) height of each square such that one column will be exactly equal to this.#fMaxHeight.
    let lMaxHeightTile = Math.floor((prMaxHeight - lSumMarginHeight - lBorderWidth) / lDimensionGrid.rows);

    // The (max) width of each square such that one column will be exactly equal to this.#fMaxHeight.
    let lMaxWidthTile = Math.floor((prMaxWidth - lSumMarginWidth - lBorderWidth) / lDimensionGrid.columns);

    // The tiles' dimension (lDimensionTile * lDimensionTile) (multiple by 0.99 to ensure the dimensions don't exceed 
    // the maximums, which can be caused by decimal precision error).
    const lDimensionTile = Math.floor(Math.min(lMaxHeightTile, lMaxWidthTile));

    const lWidth = lDimensionTile * lDimensionGrid.columns + lSumMarginWidth + lBorderWidth;
    const lHeight = lDimensionTile * lDimensionGrid.rows + lSumMarginHeight + lBorderWidth;

    const lColourBackground = prColourBackground ? prColourBackground : theme.gridBackground;

    const lFontSize = lDimensionTile * 0.8;

    let lText = "";

    let lWords = prGrid.text.split(" ");

    // Each word of the text must be on its own line. Therefore, the length of each word must be a multiple of the 
    // number of columns
    for (const lWord of lWords)
    {
        let lLengthWordPadded;
        if (lWord.length % lDimensionGrid.columns == 0)
            lLengthWordPadded = lWord.length;
        else
            lLengthWordPadded = lDimensionGrid.columns - (lWord.length % lDimensionGrid.columns) + lWord.length;

        lText += lWord.padEnd(lLengthWordPadded, " ");
    }

    return (
        <div 
            style = {{ 
                ...styles.container, width: lWidth, height: lHeight, backgroundColor: lColourBackground, 
                borderColor: prColourBorder ? prColourBorder : lColourBackground, fontSize: lFontSize, textAlign: "center"
            }} 
            onClick = { prOnClick }
            className = "unselectable"
        >
            {
                prGrid.grid.map(
                    (pColour, pIndex) =>
                    {
                        let lColour = pColour;

                        if (!lColour) // If the tile is empty.
                        {
                            lColour = prColourEmptyCell ? prColourEmptyCell : theme.emptyGridCell;
                        }

                        return (
                            <div 
                                key = { pIndex } 
                                style = {{ width: lDimensionTile, height: lDimensionTile, backgroundColor: lColour }}
                            >
                                { (lText && pIndex < lText.length) ? lText[pIndex] : undefined }
                            </div>
                        );
                    }
                )
            }
        </div>
    );
}

GridDisplayer.propTypes =
{
    prGrid: PropTypes.instanceOf(Grid),
    prMaxWidth: PropTypes.number.isRequired,
    prMaxHeight: PropTypes.number.isRequired,
    prOnClick: PropTypes.func
};

GridDisplayer.defaultProps = 
{
}

const styles = 
{
    container:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 1,
        columnGap: 1,
        border: "1px solid",
        flexShrink: 0
    }
};

export default GridDisplayer;