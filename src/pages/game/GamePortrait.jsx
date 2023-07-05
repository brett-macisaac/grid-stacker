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
import TableStandard, { defaultTableHeight } from '../../components/table_standard/TableStandard';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx'

function GamePortrait({ prGrid, prBlockTallies, prNextBlocks, prGridHold, prGameInProgress, prActiveBlocks, prStats, 
                        prHandlers, prButtonSymbols, pUpdater }) 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const navigate = useNavigate();

    const [ optionsPopUpMsg, setOptionsPopUpMsg ] = useState(undefined);

    useEffect(
        () =>
        {
        },
        []
    );

    // The width of the container.
    const gWidthContainer = window.innerWidth >= styles.container.maxWidth ? styles.container.maxWidth : window.innerWidth;

    // The height of the top container.
    let lHeightConTop = utils.GetPercentVal(styles.conTop.height, window.innerHeight);

    // The height of the bottom container.
    let lHeightConBottom = window.innerHeight - lHeightConTop ;

    // The width of the top middle container.
    const gWidthConTopMid = utils.GetPercentVal(styles.conTopMid.width, gWidthContainer)

    // The widths of the containers at the top left and top-right.
    const gWidthTopSide = (gWidthContainer - gWidthConTopMid) / 2;

    // The maximum dimensions of the grids displayed in the tally container (also used for the 'next' and 'hold grids). 
    const gMaxHeightTallyGrid = Math.floor((lHeightConTop - 7 * styles.infoPanel.rowGap - utilsGlobalStyles.fontSizeN() - 2 * styles.infoPanel.padding) / 7);
    const gMaxWidthTallyGrid = Math.floor(gWidthTopSide - 2 * styles.infoPanel.padding - 2);

    // The maximum dimensions of the game grid.
    const gMaxHeightGameGrid = Math.floor(lHeightConTop - gHeightStatsTable);
    const gMaxWidthGameGrid = Math.floor(gWidthConTopMid);

    // The maximum dimension of the game buttons.
    const gMaxWidthGameButton = Math.floor((gWidthContainer - 2 * styles.conGameControls.padding - 4 * styles.conGameControlsSub.columnGap) / 5);
    const gMaxHeightGameButton = Math.floor((lHeightConBottom - 2 * styles.conGameControls.padding - styles.conGameControls.rowGap) / 2);
    const gMaxSizeGameButton = Math.min(gMaxWidthGameButton, gMaxHeightGameButton);
    const gMaxSizeGameButtonSymbol = gMaxSizeGameButton - 2 * styles.btnGameControl.padding;

    // The 'top' game buttons.
    const lGameButtonSymbolsTop = [
        prButtonSymbols.left, prButtonSymbols.leftMax, prButtonSymbols.hold, prButtonSymbols.rightMax, prButtonSymbols.right
    ];

    // The 'bottom' game buttons
    const lGameButtonSymbolsBottom = [
        prButtonSymbols.anticlockwise, prButtonSymbols.down, prButtonSymbols.rotate180, prButtonSymbols.downMax, prButtonSymbols.clockwise
    ];

    return ( 
        <PageContainer
            navigate = { navigate }
            showHeader = { false }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            optionsRightHeaderButtons = { [ optionsHeaderButtons.settings ] }
            optionsPopUpMsg = { optionsPopUpMsg }
            style = {{ ...styles.container, backgroundColor: theme.header }}
        >
            <div style = { styles.conTop }>
                <div style = {{ ...styles.infoPanel, ...styles.infoPanelLeft, borderColor: theme.content }}>
                    <TextStandard text = "TALLY" isBold />
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

                <div style = { styles.conTopMid }>
                    <TableStandard 
                        prData = { prStats }
                        prSizeText = { -1 } 
                        prBorders = { [ false, true, true, false ] }
                    />

                    <div style = { styles.conGrid }>
                        {
                            prGrid.instance && (
                                <GridDisplayer 
                                    prGrid = { prGrid.instance } 
                                    prMaxWidth = { gMaxWidthGameGrid } 
                                    prMaxHeight = { gMaxHeightGameGrid } 
                                />
                            )
                        }
                    </div>
                </div>

                <div style = {{ ...styles.infoPanel, ...styles.infoPanelRight, borderColor: theme.content }}>
                    <div style = { styles.conHoldBlock }>
                        <TextStandard text = "HOLD" isBold style = {{ textAlign: "center" }} />
                        <GridDisplayer 
                            prGrid = { prGridHold } 
                            prMaxHeight = { gMaxHeightTallyGrid } 
                            prMaxWidth = { gMaxWidthTallyGrid } 
                        />
                    </div>

                    <div style = { styles.conNextBlocks }>
                        <TextStandard text = "NEXT" isBold style = {{ textAlign: "center" }} />
                        {
                            prNextBlocks.map(
                                (pNextBlock, pIndex) =>
                                {
                                    const lGrid = new Grid(4, 4);

                                    lGrid.DrawBlockAt(pNextBlock, Grid.DrawPosition.CentreMid);

                                    const lOnClick = (pIndex == prNextBlocks.length - 1) ? prHandlers.rotateNextBlock : undefined;

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { gMaxHeightTallyGrid } 
                                            prMaxWidth = { gMaxWidthTallyGrid } 
                                            prColourBorder = { pIndex == prNextBlocks.length - 1 ? theme.selected : undefined }
                                            prOnClick = { lOnClick }
                                        />
                                    );
                                }
                            )
                        }
                    </div>
                </div>

            </div>

            <div style = {{ ...styles.conBottom, borderColor: theme.content }}>
                    {
                        !prGameInProgress && (
                            <div style = {{ ...styles.conMenuControls, backgroundColor: theme.header + "AA" }}>
                                <ButtonBlocks 
                                    text = "PLAY" 
                                    onPress = { prHandlers.play } 
                                    prColourBackground = { "transparent" }
                                    prColourEmptyCell = { "transparent" }
                                    style = {{ ...styles.btnMenuControl, backgroundColor: theme.content + "CB" }} 
                                />
                                <ButtonBlocks 
                                    text = "EXIT" 
                                    onPress = { () => prHandlers.exit(navigate) } 
                                    prColourBackground = { "transparent" }
                                    prColourEmptyCell = { "transparent" }
                                    style = {{ ...styles.btnMenuControl, backgroundColor: theme.content + "CB" }} 
                                />
                            </div>
                        )
                    }
                    <div style = { styles.conGameControls }>
                        <div style = { styles.conGameControlsSub }>
                            {
                                lGameButtonSymbolsTop.map(
                                    (pSymbol, pIndex) =>
                                    {
                                        const lAlignSelf = pIndex % 2 == 1 ? "flex-end" : "flex-start";

                                        const lOnPress = prHandlers[pSymbol.name] ? prHandlers[pSymbol.name] : () => { console.log("No handler assigned."); };

                                        return (
                                            <ButtonStandard 
                                                key = { pIndex }
                                                style = {{ 
                                                    ...styles.btnGameControl, 
                                                    border: `1px solid ${pSymbol.colour}`,
                                                    alignSelf: lAlignSelf
                                                }}
                                                onPress = { lOnPress }
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
                        <div style = { styles.conGameControlsSub }>
                        {
                                lGameButtonSymbolsBottom.map(
                                    (pSymbol, pIndex) =>
                                    {
                                        const lAlignSelf = pIndex % 2 == 1 ? "flex-end" : "flex-start";

                                        const lOnPress = prHandlers[pSymbol.name] ? prHandlers[pSymbol.name] : () => { console.log("No handler assigned."); };

                                        return (
                                            <ButtonStandard 
                                                key = { pIndex }
                                                style = {{ 
                                                    ...styles.btnGameControl, 
                                                    border: `1px solid ${pSymbol.colour}`,
                                                    alignSelf: lAlignSelf
                                                }}
                                                onPress = { lOnPress }
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
                    </div>
            </div>

        </PageContainer>
    );
}

GamePortrait.propTypes = 
{
    prGrid: PropTypes.shape({ instance: PropTypes.instanceOf(Grid) }).isRequired,
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
        padding: 0,
        //maxWidth: 800,
        height: "100%"
    },
    conTop:
    {
        flexDirection: "row",
        width: "100%",
        height: "75%"
        //height: 0.75 * window.innerHeight,
        //backgroundColor: "#330606"
    },
    conBottom:
    {
        width: "100%",
        height: "25%",
        //height: 0.25 * window.innerHeight,
        borderTop: "2px solid",
        justifyContent: "center",
        position: "relative"
        //backgroundColor: "#000853"
    },
    infoPanel:
    {
        width: "22%",
        //backgroundColor: "#005304",
        padding: utilsGlobalStyles.spacingVertN(-3),
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        justifyContent: "space-between",
        alignItems: "center",
    },
    conTopMid:
    {
        width: "56%",
        justifyContent: "space-between",
        //alignItems: "center"
    },
    conGrid:
    {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    infoPanelLeft:
    {
        borderRight: "2px solid",
    },
    infoPanelRight:
    {
        borderLeft: "2px solid",
    },
    conNextBlocks:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-2),
    },
    conHoldBlock:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-2),
    },
    conMenuControls:
    {
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        padding: utilsGlobalStyles.spacingVertN(-1),
        zIndex: 1,
        position: "absolute",
    },
    btnMenuControl:
    {
        width: "80%",
        maxWidth: 400,
        borderRadius: globalProps.borderRadiusStandard,
        padding: 8,
        alignItems: "center",
    },
    conGameControls:
    {
        height: "100%",
        padding: utilsGlobalStyles.spacingVertN(-2),
        rowGap: 0,
        justifyContent: "space-between",
        alignItems: "center"
    },
    conGameControlsSub:
    {
        height: "50%",
        flexDirection: "row",
        columnGap: utilsGlobalStyles.spacingVertN(-1),
        alignItems: "center"
    },
    btnGameControl:
    {
        padding: 7,
        borderRadius: globalProps.borderRadiusStandard,
        //border: "1px solid"
    },
};

// The height of the 'stats table'.
const gHeightStatsTable = Math.floor(defaultTableHeight(4, -1, [ false, true, true, false ]));

// The 'top' game buttons.
const gGameButtonSymbolsTop = [
    gridSymbols.left, gridSymbols.leftMax, gridSymbols.hold, gridSymbols.rightMax, gridSymbols.right
];

// The 'bottom' game buttons
const gGameButtonSymbolsBottom = [
    gridSymbols.anticlockwise, gridSymbols.down, gridSymbols.rotate180, gridSymbols.downMax, gridSymbols.clockwise
];


export default GamePortrait;