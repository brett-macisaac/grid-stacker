//import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React, { useContext, useState } from "react";

import GridChar from '../../classes/GridChar';
import GridDisplayer from '../grid_displayer/GridDisplayer';
import TextStandard from '../text_standard/TextStandard';
import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';
import utils from '../../utils/utils';

/*
* A standard table component.

* Props:
    > prRowHeader: the header row (an array of strings).
    > prRowsContent: the content rows (an array of an array of strings). Each row should be have the same length as prRowHeader.
    > prData: an object which contains all of the table's data and the order of the columns.
        e.g. 
        {
            orderColumns: [ "colA", "colC", "colB" ],
            header: { colA: "A", colC: "C", colB: "B" },
            content:
            {
                orderRows: [ "rowA", "rowC", "rowB" ],
                rows:
                {
                    rowA: { colA: "1", colC: "2", colB: "3" }
                    rowC: { colA: "2", colC: "3", colB: "4" }
                    rowB: { colA: "5", colC: "6", colB: "7" }
                }
            }
        }
*/
function TableStandard({ prRowHeader, prRowsContent, prData, prSizeText, prBorders, prBorderColour, prBorderSize, prStyleTable, 
                         prStyleColumn, prStyleCellHeader, prStyleCellContent })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // The header row.
    let lRowHeader = [];
    if (prData)
    {
        for (const lColumn of prData.orderColumns)
        {
            lRowHeader.push(prData.header[lColumn]);
        }
    }
    else
    {
        lRowHeader = prRowHeader;
    }

    // The dimensions of the table.
    let lNumColumns;
    let lNumRows;
    if (prData)
    {
        lNumColumns = prData.orderColumns.length;
        lNumRows = Object.keys(prData.content.rows).length;
    }
    else
    {
        lNumColumns = prRowHeader.length;
        lNumRows = prRowsContent.length;
    }

    // The content rows.
    let lRows;

    if (prData)
    {
        lRows = [];
        for (const lRow of prData.content.orderRows)
        {
            const lRowTemp = [];
            for (const lColumn of prData.orderColumns)
            {
                lRowTemp.push(prData.content.rows[lRow][lColumn]);
            }

            lRows.push(lRowTemp);
        }
    }
    else
    {
        lRows = Array(prRowsContent.length);
        for (let i = 0; i < lRows.length; ++i)
        {
            lRows[i] = utils.PadEndArray(prRowsContent[i], lNumColumns, "-");
        }
    }

    const lBorder = `${prBorderSize}px solid ${prBorderColour ? prBorderColour : theme.content}`;

    return (
        <div
            className = "hideScrollBar tableStandard"
            style = {{ 
                backgroundColor: theme.buttonContent,
                ...styles.table, 
                ...prStyleTable 
            }}
        >
            {
                lRowHeader.map(
                    (pHeading, pIndexCol) =>
                    {
                        const lBorderRight = ((pIndexCol != lNumColumns - 1) || prBorders[1]) ? lBorder : undefined;
                        const lBorderLeft = (pIndexCol == 0 && prBorders[3]) ? lBorder : undefined;

                        return (
                            <div 
                                key = { pIndexCol }
                                style = {{ 
                                    ...styles.column, ...prStyleColumn, 
                                    //borderRight: (pIndexCol == lNumColumns - 1) ? lBorder : undefined 
                                }}
                            >
                                <TextStandard 
                                    text = { pHeading } isBold size = { prSizeText }
                                    style = {{ 
                                        ...styles.cell, ...styles.cellHeader, ...prStyleCellHeader, 
                                        borderRight: lBorderRight, borderLeft: lBorderLeft, 
                                        borderTop: prBorders[0] ? lBorder : undefined
                                    }}
                                />
                                {
                                    Array(lNumRows).fill(undefined).map(
                                        (pIDC, pIndexRow) =>
                                        {
                                            let lText = lRows[pIndexRow][pIndexCol];

                                            if (!lText || lText.length == 0)
                                                lText = "-";

                                            return (
                                                <TextStandard 
                                                    key = { pIndexRow }
                                                    text = { lText } size = { prSizeText }
                                                    style = {{ 
                                                        ...styles.cell, ...styles.cellContent, ...prStyleCellContent,
                                                        borderTop: lBorder, borderRight: lBorderRight,
                                                        borderLeft: lBorderLeft, borderBottom: ((pIndexRow == lNumRows - 1) && prBorders[2]) ? lBorder : undefined
                                                    }} 
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

TableStandard.propTypes =
{
    prRowHeader: PropTypes.oneOfType(
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number)
    ),
    prRowsContent: PropTypes.arrayOf(
        PropTypes.oneOfType(
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.number)
        ),
    ),
    prData: PropTypes.shape({
        orderColumns: PropTypes.arrayOf(PropTypes.string),
        header: PropTypes.object,
        content: PropTypes.shape({
            orderRows: PropTypes.arrayOf(PropTypes.string),
            rows: PropTypes.object
        })
    }),
    prSizeText: PropTypes.number,
    prBorders: PropTypes.arrayOf(PropTypes.bool),
    prBorderSize: PropTypes.number
};

TableStandard.defaultProps =
{
    prSizeText: 0,
    prBorders: [ true, true, true, true ],
    prBorderSize: 2
}

const styles =
{
    table:
    {
        flexDirection: "row",
        //justifyContent: "center",
        overflowX: "scroll",
        flexShrink: 0
    },
    column:
    {
        flexShrink: 0,
        flexDirection: "column",
        //paddingLeft: 5, 
        //paddingRight: 5, 
    },
    cell:
    {
        padding: 5,
        lineHeight: 1
    },
    cellHeader:
    {
        //padding: 10,
        textAlign: "center"
    },
    cellContent:
    {
        //padding: 5,
        //textAlign: "center"
    }
};

/*
* Returns the height of a table with default styling for the given parameters.

* Parameters:
    >
*/
function defaultTableHeight(pNumRows, pSizeText, pBorders, pBorderSize = 2)
{
    let lPadding = styles.cell.padding;
    let lHeightPadding = pNumRows * 2 * lPadding;

    let lHeightBorders = pBorderSize * (pNumRows - 1);
    if (pBorders[0])
        lHeightBorders += pBorderSize;
    if (pBorders[2])
        lHeightBorders += pBorderSize;

    let lHeightText = pNumRows * utilsGlobalStyles.fontSizeN(pSizeText);

    return lHeightPadding + lHeightBorders + lHeightText;
}

export { TableStandard as default, defaultTableHeight };