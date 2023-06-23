import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import ButtonStandard from '../../components/button_standard/ButtonStandard.jsx';
import PageContainer from '../../components/page_container/PageContainer.jsx';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer.jsx';
import GridChar from '../../classes/GridChar';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import utils from '../../utils/utils';
import consts from '../../utils/constants';
import ThemeContext from "../../contexts/ThemeContext.js";
import PreferenceContext from '../../contexts/PreferenceContext.js';
import TextStandard from '../../components/text_standard/TextStandard';
import TextInputStandard from '../../components/text_input_standard/TextInputStandard.jsx'
import TableStandard from '../../components/TableStandard/TableStandard';
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

function Game() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // The user's preferences and the function that handles updating it.
    const { prefs, updatePrefs } = useContext(PreferenceContext);

    // An object that tracks how much of each tally has been updated.
    const [ blockTallies, setBlockTallies ] = useState(
        Object.keys(Block.Type).reduce(
            (pTallyObject, pBlockType) =>
            {
                return { ...pTallyObject, [pBlockType]: 0 }
            },
            { }
        )
    );

    const [ nextBlocks, setNextBlocks ] = useState(
        [ ...Array(4) ].map(
            () =>
            {
                return new Block(Block.getRandomType());
            }
        )
    );

    const [ gameInProgress, setGameInProgress ] = useState(false);

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

    const lWidthContainer = window.innerWidth >= styles.container.maxWidth ? styles.container.maxWidth : window.innerWidth;

    const lMaxHeightTallyGrid = Math.floor((styles.conTop.height - 7 * styles.infoPanel.rowGap - utilsGlobalStyles.fontSizeN() - 2 * styles.infoPanel.padding) / 7);
    const lMaxWidthTallyGrid = Math.floor(lWidthContainer * (parseInt(styles.infoPanel.width) / 100) - 2 * styles.infoPanel.padding);
    console.log("Max height of a tally grid: " + lMaxHeightTallyGrid);
    console.log("Max width of a tally grid: " + lMaxWidthTallyGrid);
    

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

                                if (!prefs.blocks.includes(pBlockType))
                                {
                                    lBlock.colour = Block.sColourShadow;
                                }

                                lGrid.DrawBlockAt(lBlock, Grid.DrawPosition.CentreMid);

                                lGrid.text = blockTallies[pBlockType].toString().padStart(3, '0');

                                return (
                                    <GridDisplayer 
                                        key = { pIndex }
                                        prGrid = { lGrid } 
                                        prMaxHeight = { lMaxHeightTallyGrid } 
                                        prMaxWidth = { lMaxWidthTallyGrid } 
                                        //prOnClick = { () => { toggleBlock(pBlockType); } }
                                    />
                                );
                            }
                        )
                    }
                </div>

                <div style = { styles.grid }>
                    <TableStandard 
                        prRowHeader = { gMockScoreData.header } 
                        prRowsContent = { gMockScoreData.content }
                        prSizeText = { -1 } 
                    />
                </div>

                <div style = {{ ...styles.infoPanel, ...styles.infoPanelRight, borderColor: theme.content }}>
                    <TextStandard text = "NEXT" isBold style = {{ textAlign: "center" }} />
                    {
                        nextBlocks.map(
                            (pNextBlock, pIndex) =>
                            {
                                const lGrid = new Grid(4, 4);

                                lGrid.DrawBlockAt(pNextBlock, Grid.DrawPosition.CentreMid);

                                return (
                                    <GridDisplayer 
                                        key = { pIndex }
                                        prGrid = { lGrid } 
                                        prMaxHeight = { lMaxHeightTallyGrid } 
                                        prMaxWidth = { lMaxWidthTallyGrid } 
                                        prColourBorder = { pIndex == nextBlocks.length - 1 ? theme.selected : undefined }
                                        //prOnClick = { () => { toggleBlock(pBlockType); } }
                                    />
                                );
                            }
                        )
                    }
                </div>

            </div>

            <div style = {{ ...styles.conBottom, borderColor: theme.content }}>
                    {
                        !gameInProgress && (
                            <div style = { styles.conMenuControls }>
                                <ButtonBlocks 
                                    text = "PLAY" 
                                    onPress = { handlePlay } 
                                    prColourEmptyCell = { theme.content }
                                    style = {{ ...styles.btnMenuControl, backgroundColor: theme.content }} 
                                />
                                <ButtonBlocks 
                                    text = "EXIT" 
                                    onPress = { () => navigate("/") } 
                                    prColourEmptyCell = { theme.content }
                                    style = {{ ...styles.btnMenuControl, backgroundColor: theme.content }} 
                                />
                            </div>
                        )
                    }
            </div>

        </PageContainer>
    );
}

const styles = 
{
    container:
    {
        padding: 0,
        maxWidth: 800
    },
    conTop:
    {
        flexDirection: "row",
        width: "100%",
        height: 0.75 * window.innerHeight,
        //backgroundColor: "#330606"
    },
    conBottom:
    {
        width: "100%",
        height: 0.25 * window.innerHeight,
        borderTop: "2px solid",
        justifyContent: "center",
        //backgroundColor: "#000853"
    },
    infoPanel:
    {
        width: "25%",
        //backgroundColor: "#005304",
        padding: utilsGlobalStyles.spacingVertN(-3),
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        justifyContent: "flex-start",
        alignItems: "center",
    },
    grid:
    {
        width: "50%"
        //flexGrow: 2
    },
    infoPanelLeft:
    {
        borderRight: "2px solid",
    },
    infoPanelRight:
    {
        borderLeft: "2px solid",
    },
    conMenuControls:
    {
        justifyContent: "center",
        alignItems: "center",
        rowGap: utilsGlobalStyles.spacingVertN()
    },
    btnMenuControl:
    {
        width: "80%",
        maxWidth: 400,
        borderRadius: globalProps.borderRadiusStandard,
        padding: 10,
    }
};

export default Game;