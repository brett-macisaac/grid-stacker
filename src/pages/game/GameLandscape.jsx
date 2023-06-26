import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import ButtonStandard from '../../components/button_standard/ButtonStandard.jsx';
import PageContainer from '../../components/page_container/PageContainer.jsx';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer.jsx';
import GridChar from '../../classes/GridChar';
import gridSymbols from './symbols_buttons';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import utils from '../../utils/utils';
import consts from '../../utils/constants';
import ThemeContext from "../../contexts/ThemeContext.js";
import PreferenceContext from '../../contexts/PreferenceContext.js';
import TextStandard from '../../components/text_standard/TextStandard';
import TextInputStandard from '../../components/text_input_standard/TextInputStandard.jsx'
import TableStandard, { defaultTableHeight } from '../../components/TableStandard/TableStandard';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx'

/*
* A local storage key for the high-scores.
*/
const gLclStrgKeyHighScores = "HighScores";

const gMockScoreData = {
    header: [ "STAT", "SCORE", "LINES", "USER" ],
    content: [
        [ "HI (G)",  "32,400",  50, "O'Shaghenesy" ],
        [ "HI (L)",  "15,600",  44, "BrettMac21" ],
        [ "NOW", "5,250",   20, "BrettMac21"  ]
    ]
};

// console.log("Height of stats table: " + defaultTableHeight(4, -1, [ false, true, true, true ]));

function GameLandscape({ prGrid, prBlockTallies, prNextBlocks, prGameInProgress, prActiveBlocks, prStats, prHandlers }) 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const [ optionsPopUpMsg, setOptionsPopUpMsg ] = useState(undefined);

    const navigate = useNavigate();

    useEffect(
        () =>
        {
        },
        []
    );

    const handlePlay = () =>
    {
    };

    // The width of the containers' (right) border.
    const gWidthBorder = parseInt(styles.con.borderRight);

    // The width of the control containers.
    const gWidthConControls = utils.GetPercentVal(styles.conControls.width, window.innerWidth);

    // The maximum dimension of the game buttons.
    const gMaxWidthGameButton = Math.floor(gWidthConControls - 2 * styles.conControls.padding - gWidthBorder);
    const gMaxHeightGameButton = Math.floor((window.innerHeight - 2 * styles.conControls.padding - 4 * styles.conControls.rowGap) / 5);
    const gMaxSizeGameButton = Math.min(gMaxWidthGameButton, gMaxHeightGameButton);
    let gMaxSizeGameButtonSymbol = gMaxSizeGameButton - 2 * styles.btnGameControl.padding;
    gMaxSizeGameButtonSymbol = gMaxSizeGameButtonSymbol > 100 ? 100 : gMaxSizeGameButtonSymbol;
    console.log("Max size of game buttons: " + gMaxSizeGameButton);

    // The maximum dimensions of the game grid.
    const gMaxHeightGameGrid = Math.floor(window.innerHeight);
    const gMaxWidthGameGrid = Math.floor(utils.GetPercentVal(styles.conGrid.width, window.innerWidth));

    // The dimensions of the tally container.
    const gHeightConTally = window.innerHeight - gHeightStatsTable;
    const gWidthConTally = utils.GetPercentVal(styles.conStats.width, window.innerWidth);

    // The maximum dimensions of the grids displayed in the tally container (such that there's three columns).
    let gMaxHeightTallyGrid = Math.floor((gHeightConTally - 4 * styles.conTallySub.rowGap - utilsGlobalStyles.fontSizeN() - 2 * styles.conTally.padding) / 4);
    let gMaxWidthTallyGrid = Math.floor((gWidthConTally - styles.conTallySub.columnGap - 2 * styles.conTally.padding -  gWidthBorder) / 2);
    console.log("Max height tally grid: " + gMaxHeightTallyGrid);
    gMaxHeightTallyGrid = gMaxHeightTallyGrid > 100 ? 100 : gMaxHeightTallyGrid;
    gMaxWidthTallyGrid = gMaxWidthTallyGrid > 100 ? 100 : gMaxWidthTallyGrid;
    console.log("Max width tally grid: " + gMaxWidthTallyGrid);

    return ( 
        <PageContainer
            navigate = { navigate }
            showHeader = { false }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            optionsRightHeaderButtons = { [ optionsHeaderButtons.settings ] }
            optionsPopUpMsg = { optionsPopUpMsg }
            style = {{ ...styles.container, backgroundColor: theme.header }}
        >
            <div 
                style = {{ 
                    ...styles.conControls, ...styles.con, borderColor: theme.content, 
                    justifyContent: prGameInProgress ? "space-between" : "center" 
                }}
            >
                {
                    !prGameInProgress && (
                        <ButtonBlocks 
                            text = "PLAY" 
                            onPress = { prHandlers.play } 
                            prColourEmptyCell = { theme.content }
                            prIsHorizontal = { false }
                            style = {{ ...styles.btnMenuControl, backgroundColor: theme.content }} 
                        />
                    )
                }
                {
                    prGameInProgress && gGameButtonSymbolsLeft.map(
                        (pSymbol, pIndex) =>
                        {
                            const lAlignSelf = pIndex % 2 == 1 ? "flex-end" : "flex-start";

                            return (
                                <ButtonStandard 
                                    key = { pIndex }
                                    style = {{ 
                                        ...styles.btnGameControl, border: `1px solid ${pSymbol.randomColour}`,
                                        alignSelf: lAlignSelf
                                    }}
                                    onPress = { () => { console.log("Pressed game button."); } }
                                >
                                    <GridDisplayer 
                                        prGrid = { pSymbol.grid } 
                                        prMaxHeight = { gMaxSizeGameButtonSymbol }
                                        prMaxWidth = { gMaxSizeGameButtonSymbol }
                                        prColourBackground = { theme.buttonContent }
                                    />
                                </ButtonStandard>
                            )
                        }
                    )
                }
            </div>

            <div style = {{ ...styles.conStats, ...styles.con, borderColor: theme.content }}>
                <div style = { styles.conTally }>
                    <TextStandard text = "TALLY" isBold style = {{ textAlign: "center" }} />
                    <div style = { styles.conTallySub }>
                        {
                            Object.keys(Block.Type).map(
                                (pBlockType, pIndex) =>
                                {
                                    const lGrid = new Grid(4, 4);

                                    const lBlock = new Block(pBlockType);

                                    if (!prActiveBlocks.includes(pBlockType))
                                    {
                                        lBlock.colour = Block.sColourShadow;
                                    }

                                    lGrid.DrawBlockAt(lBlock, Grid.DrawPosition.CentreMid);

                                    lGrid.text = prBlockTallies[pBlockType].toString().padStart(3, '0');

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { gMaxHeightTallyGrid } 
                                            prMaxWidth = { gMaxWidthTallyGrid } 
                                            //prOnClick = { () => { toggleBlock(pBlockType); } }
                                        />
                                    );
                                }
                            )
                        }
                    </div>
                </div>
                <TableStandard 
                    prRowHeader = { gMockScoreData.header } 
                    prRowsContent = { gMockScoreData.content }
                    prData = { prStats }
                    prSizeText = { -1 } 
                    prBorders = { [ true, true, false, false ] }
                />
            </div>

            <div style = {{ ...styles.conGrid, ...styles.con, borderColor: theme.content }}>
                <GridDisplayer 
                    prGrid = { prGrid } 
                    prMaxWidth = { gMaxWidthGameGrid } 
                    prMaxHeight = { gMaxHeightGameGrid } 
                />
            </div>

            <div style = {{ ...styles.conBlocks, ...styles.con, borderColor: theme.content }}>
                <TextStandard text = "NEXT" isBold style = {{ textAlign: "center" }} />
                {
                    prNextBlocks.map(
                        (pNextBlock, pIndex) =>
                        {
                            const lGrid = new Grid(4, 4);

                            lGrid.DrawBlockAt(pNextBlock, Grid.DrawPosition.CentreMid);

                            return (
                                <GridDisplayer 
                                    key = { pIndex }
                                    prGrid = { lGrid } 
                                    prMaxHeight = { gMaxHeightTallyGrid } 
                                    prMaxWidth = { gMaxWidthTallyGrid } 
                                    prColourBorder = { pIndex == prNextBlocks.length - 1 ? theme.selected : undefined }
                                    //prOnClick = { () => { toggleBlock(pBlockType); } }
                                />
                            );
                        }
                    )
                }
            </div>

            <div 
                style = {{ 
                    ...styles.conControls, ...styles.con, borderColor: theme.content, 
                    justifyContent: prGameInProgress ? "space-between" : "center" 
                }}
            >
                {
                    !prGameInProgress && (
                        <ButtonBlocks 
                            text = "EXIT" 
                            onPress = { () => console.log("exit") } 
                            prColourEmptyCell = { theme.content }
                            prIsHorizontal = { false }
                            style = {{ ...styles.btnMenuControl, backgroundColor: theme.content }} 
                        />
                    )
                }
                {
                    prGameInProgress && gGameButtonSymbolsRight.map(
                        (pSymbol, pIndex) =>
                        {
                            const lAlignSelf = pIndex % 2 == 1 ? "flex-start" : "flex-end";

                            return (
                                <ButtonStandard 
                                    key = { pIndex }
                                    style = {{ 
                                        ...styles.btnGameControl, border: `1px solid ${pSymbol.randomColour}`, 
                                        alignSelf: lAlignSelf 
                                    }}
                                    onPress = { () => { console.log("Pressed game button."); } }
                                >
                                    <GridDisplayer 
                                        prGrid = { pSymbol.grid } 
                                        prMaxHeight = { gMaxSizeGameButtonSymbol }
                                        prMaxWidth = { gMaxSizeGameButtonSymbol }
                                        prColourBackground = { theme.buttonContent }
                                    />
                                </ButtonStandard>
                            )
                        }
                    )
                }
            </div>

        </PageContainer>
    );
}

GameLandscape.propTypes = 
{
    prGrid: PropTypes.instanceOf(Grid).isRequired,
    prBlockTallies: PropTypes.shape({
        I: PropTypes.number,
        J: PropTypes.number,
        L: PropTypes.number,
        O: PropTypes.number,
        S: PropTypes.number,
        T: PropTypes.number,
        Z: PropTypes.number,
    }).isRequired,
    prNextBlocks: PropTypes.arrayOf(PropTypes.instanceOf(Block)).isRequired,
    prGameInProgress: PropTypes.bool.isRequired,
    prActiveBlocks: PropTypes.string.isRequired,
    prHandlers: PropTypes.shape({
        play: PropTypes.func,
    }).isRequired,
}

const styles = 
{
    container:
    {
        height: "100%",
        flexDirection: "row",
        padding: 0,
    },
    con:
    {
        height: "100%",
        borderRight: "2px solid"
    },
    conControls:
    {
        //backgroundColor: "#0A0AA1",
        width: "15%",
        padding: utilsGlobalStyles.spacingVertN(-2),
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        //justifyContent: "space-between",
        alignItems: "center"
    },
    conStats:
    {
        //backgroundColor: "#500AA1",
        width: "25%",
    },
    conTally:
    {
        padding: utilsGlobalStyles.spacingVertN(-3),
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        flexGrow: 1
    },
    conTallySub:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        columnGap: utilsGlobalStyles.spacingVertN(-2),
        justifyContent: "center"
    },
    conGrid:
    {
        //backgroundColor: "#0A83A1",
        width: "35%",
        alignItems: "center",
        justifyContent: "center"
    },
    conBlocks:
    {
        width: "10%",
        padding: utilsGlobalStyles.spacingVertN(-3),
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        alignItems: "center"
    },
    conLeftmost:
    {
        borderRightWidth: 0
    },
    btnGameControl:
    {
        padding: 7,
        borderRadius: globalProps.borderRadiusStandard,
        width: "fit-content"
        //border: "1px solid"
    },
    btnMenuControl:
    {
        height: "100%",
        maxHeight: 350,
        borderRadius: globalProps.borderRadiusStandard,
        padding: 16,
    },
};

// The height of the 'stats table'.
const gHeightStatsTable = Math.floor(defaultTableHeight(4, -1, [ true, true, false, false ]));

// The 'left' game buttons.
const gGameButtonSymbolsLeft = [
    gridSymbols.down, gridSymbols.leftMax, gridSymbols.hold, gridSymbols.left, gridSymbols.anticlockwise
];

// The 'right' game buttons
const gGameButtonSymbolsRight = [
    gridSymbols.downMax, gridSymbols.rightMax, gridSymbols.rotate180, gridSymbols.right, gridSymbols.clockwise
];

export default GameLandscape;