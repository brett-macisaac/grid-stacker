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
    > text: the content rows (an array of an array of strings). Each row should be have the same length as prRowHeader.
*/
function TableStandard({ prRowHeader, prRowsContent, prSizeText, prStyleTable, prStyleColumn, prStyleCellHeader, prStyleCellContent })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // Get the table's dimension.
    const lNumColumns = prRowHeader.length;
    const lNumRows = prRowsContent.length;

    // Ensure the content rows are all the same length as the header row.
    let lRows = JSON.parse(JSON.stringify(prRowsContent));
    for (let i = 0; i < lRows.length; ++i)
    {
        lRows[i] = utils.PadEndArray(lRows[i], lNumColumns, "");
    }

    return (
        <div
            className = "hideScrollBar"
            style = {{ 
                backgroundColor: theme.buttonContent,
                ...styles.table, 
                ...prStyleTable 
            }}
        >
            {
                prRowHeader.map(
                    (pHeading, pIndexCol) =>
                    {
                        return (
                            <div 
                            style = {{ 
                                ...styles.column, ...prStyleColumn, 
                                borderRight: (pIndexCol == lNumColumns - 1) ? `2px solid ${theme.content}` : undefined 
                            }}
                            >
                                <TextStandard 
                                    text = { pHeading } isBold size = { prSizeText }
                                    style = {{ 
                                        ...styles.cell, ...styles.cellHeader, ...prStyleCellHeader, 
                                        borderBottom: `2px solid ${theme.content}`, borderLeft: `2px solid ${theme.content}`
                                    }}
                                />
                                {
                                    Array(lNumRows).fill(undefined).map(
                                        (pIDC, pIndexRow) =>
                                        {
                                            return (
                                                <TextStandard 
                                                    text = { prRowsContent[pIndexRow][pIndexCol] }  size = { prSizeText }
                                                    style = {{ 
                                                        ...styles.cell, ...styles.cellContent, ...prStyleCellContent,
                                                        borderBottom: `2px solid ${theme.content}`, borderLeft: `2px solid ${theme.content}`
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
    ).isRequired,
    prRowsContent: PropTypes.arrayOf(
        PropTypes.oneOfType(
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.number)
        ),
    ).isRequired,
    prSizeText: PropTypes.number,
    prStyle: PropTypes.object,
};

TableStandard.defaultProps =
{
    prSizeText: 0
}

const styles =
{
    table:
    {
        flexDirection: "row",
        //justifyContent: "center",
        overflowX: "scroll",
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
        padding: "5px 10px",
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

export default TableStandard;