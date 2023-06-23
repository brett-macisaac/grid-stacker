import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from "../../styles.js";
import consts from '../../utils/constants.js';
import utils from '../../utils/utils.js';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer.jsx';
import GridChar from '../../classes/GridChar';
import TextStandard from '../../components/text_standard/TextStandard.jsx';
import CheckBox from '../../components/check_box/CheckBox.jsx';
import PageContainer from '../../components/page_container/PageContainer.jsx';
import Container from '../../components/container/Container.jsx';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';
import ThemeContext from "../../contexts/ThemeContext.js";
import PreferenceContext from '../../contexts/PreferenceContext.js';
import TextBlocks from '../../components/text_blocks/TextBlocks.jsx';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks.jsx';
import CountContainer from '../../components/count_container/CountContainer.jsx';

const gRngCols = { min: 4, max: 10 };
const gRngRows = { min: 5, max: 22 };

function GameParams() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // The user's preferences and the function that handles updating it.
    const { prefs, updatePrefs } = useContext(PreferenceContext);

    const navigate = useNavigate();

    const [numColumns, setNumColumns] = useState(prefs.cols);

    const [numRows, setNumRows] = useState(prefs.rows);

    const [blockList, setBlockList] = useState(prefs.blocks);

    const [optionsPopUpMsg, setOptionsPopUpMsg] = useState(undefined);

    const selectColumns = (pNumCols) =>
    {
        setNumColumns(pNumCols);

        updatePrefs("cols", pNumCols);
    };

    const selectRows = (pNumRows) =>
    {
        setNumRows(pNumRows);

        updatePrefs("rows", pNumRows);
    };

    const toggleBlock = (pBlockType) =>
    {
        let lBlockList = blockList.split('');

        const lIsBlockSelected = lBlockList.includes(pBlockType);

        if (blockList.length == 1 && lIsBlockSelected)
        {
            console.log("Cant remove the " + pBlockType + " piece because it's the only one left.");
            // Maybe a pop-up message.
            return;
        }
        else if (lIsBlockSelected)
        {
            lBlockList = lBlockList.filter(block => block !== pBlockType);
            //console.log("Removed the " + pBlockType + " piece.");
        }
        else
        {
            lBlockList.push(pBlockType);
            //console.log("Added the " + pBlockType + " piece.");

            // blockList must always be in alphabetical order.
            lBlockList.sort();
        }

        const lBlockListNew = lBlockList.join('');

        updatePrefs("blocks", lBlockListNew);

        setBlockList(lBlockListNew);
    }

    const handleNext = () =>
    {
        navigate("/username");
    };

    return ( 
        <PageContainer
            navigate = { navigate }
            buttonNavBarText = "NEXT"
            buttonNavBarHandler = { handleNext }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            optionsRightHeaderButtons = { [ optionsHeaderButtons.settings ] }
            optionsPopUpMsg = { optionsPopUpMsg }
            style = { styles.container }
        >
            <TextBlocks prText = "GAME OPTIONS" prSizeText = { 35 } prColourBackground = { theme.emptyGridCell } prStyle = {{ justifyContent: "center" }} />

            <div style = { styles.content }>
                <CountContainer 
                    title = "Number of Columns" count = { numColumns } size = { 1 }
                    styleInner = {{ ...styles.conOption }}
                >
                    <TextStandard text = "Select the number of columns" isItalic  style = { styles.prompt } />

                    <div style = { styles.conGridDimension }>
                        {
                            Array.from(
                                { length: gRngCols.max - gRngCols.min + 1 }, (el, i) => { return i + gRngCols.min }
                            ).map(
                                (pNumCols, pIndex) =>
                                {
                                    return ( 
                                        <ButtonBlocks 
                                            key = { pIndex } 
                                            text = { pNumCols.toString().padStart(2, "0") } 
                                            onPress = { () => { selectColumns(pNumCols); } }
                                            prColourText = { pNumCols == numColumns ? theme.selected : undefined }
                                            prColourBackground = { theme.header }
                                            style = {{ 
                                                border: pNumCols == numColumns ? `1px solid ${theme.selected}` : undefined,
                                                padding: 5
                                            }}
                                        /> 
                                    )
                                }
                            )
                        }
                    </div>
                </CountContainer>

                <CountContainer 
                    title = "Number of Rows" count = { numRows } size = { 1 }
                    styleInner = {{ ...styles.conGridDimension }}
                >
                    <TextStandard text = "Select the number of rows" isItalic style = { styles.prompt } />

                    <div style = { styles.conGridDimension }>
                        {
                            Array.from(
                                { length: gRngRows.max - gRngRows.min + 1 }, (el, i) => { return i + gRngRows.min }
                            ).map(
                                (pNumRows, pIndex) =>
                                {
                                    return ( 
                                        <ButtonBlocks 
                                            key = { pIndex }
                                            index = { pIndex } 
                                            text = { pNumRows.toString().padStart(2, "0") } 
                                            onPress = { () => { selectRows(pNumRows); } }
                                            prColourText = { pNumRows == numRows ? theme.selected : undefined }
                                            prColourBackground = { theme.header }
                                            style = {{ 
                                                border: pNumRows == numRows ? `1px solid ${theme.selected}` : undefined,
                                                padding: 5
                                            }}
                                        /> 
                                    )
                                }
                            )
                        }
                    </div>
                </CountContainer>

                <Container style = { styles.conBlocks }>
                    <TextStandard text = "Select the blocks you want to play with. A block is not selected if it's greyed-out." style = { styles.prompt } isItalic />
                    <div style = { styles.conBlocksInner }>
                        {
                            Object.keys(Block.Type).map(
                                (pBlockType, pIndex) =>
                                {
                                    const lGrid = new Grid(5, 5);

                                    const lBlock = new Block(pBlockType);

                                    if (!blockList.includes(pBlockType))
                                    {
                                        lBlock.colour = Block.sColourShadow;
                                    }

                                    lGrid.DrawBlockAt(lBlock, Grid.DrawPosition.CentreMid);

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { 60 } 
                                            prMaxWidth = { 60 } 
                                            prOnClick = { () => { toggleBlock(pBlockType); } }
                                        />
                                    )
                                }
                            )
                        }
                    </div>
                </Container>

                {/* Display stats for this game, such as number of times played and high-score. */}

            </div>

        </PageContainer>
    );
}

const styles =
{
    container:
    {
        // flexDirection: "row",
        // flexWrap: "wrap",
        //columnGap: utilsGlobalStyles.spacingVertN(1),
        rowGap: utilsGlobalStyles.spacingVertN(0),
        // justifyContent: "center",
        // alignItems: "flex-start"
    },
    content:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: utilsGlobalStyles.spacingVertN(1),
        rowGap: utilsGlobalStyles.spacingVertN(0),
        justifyContent: "center",
        alignItems: "flex-start"
    },
    conOption: 
    {
        alignItems: "center",
    },
    conGridDimension:
    {
        flexDirection: "row", flexWrap: "wrap", columnGap: 20, rowGap: 10, justifyContent: "center"
    },
    prompt: 
    {
        //textAlign: "center",
        marginBottom: utilsGlobalStyles.spacingVertN(-1)
    },
    conBlocks:
    {
        flexDirection: "column"
    },
    conBlocksInner:
    {
        flexDirection: "row", flexWrap: "wrap", columnGap: 20, rowGap: 10, justifyContent: "center"
    }
};

export default GameParams;