import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { json, useNavigate } from 'react-router-dom';
import _debounce from "lodash/debounce";
import ClearIcon from '@mui/icons-material/Clear';

import globalProps, { utilsGlobalStyles } from "../../styles.js";
import consts from '../../utils/constants.js';
import utils from '../../utils/utils.js';
import utilsAppSpecific from '../../utils/utils_app_specific.js';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer.jsx';
import TableStandard from '../../components/table_standard/TableStandard.jsx';
import GridChar from '../../classes/GridChar';
import TextStandard from '../../components/text_standard/TextStandard.jsx';
import CountLabel from '../../components/count_label/CountLabel.jsx';
import CheckBox from '../../components/check_box/CheckBox.jsx';
import PageContainer from '../../components/page_container/PageContainer.jsx';
import Container from '../../components/container/Container.jsx';
import headerButtons from '../../components/header_buttons/HeaderButtons';
import ThemeContext from "../../contexts/ThemeContext.js";
import UserContext from '../../contexts/UserContext.js';
import PreferenceContext from '../../contexts/PreferenceContext.js';
import TextBlocks from '../../components/text_blocks/TextBlocks.jsx';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks.jsx';
import CountContainer from '../../components/count_container/CountContainer.jsx';
import SliderStandard from '../../components/slider_standard/SliderStandard.jsx';
import ApiRequestor from '../../ApiRequestor.js';

const gRngCols = { min: 4, max: 10 };
const gRngRows = { min: 5, max: 22 };

// https://dmitripavlutin.com/react-throttle-debounce/
// https://dmitripavlutin.com/react-cleanup-async-effects/

function GameParams() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // The user's preferences and the function that handles updating it.
    const { prefs, updatePrefs } = useContext(PreferenceContext);

    const lUserContext = useContext(UserContext);

    const navigate = useNavigate();

    const [numColumns, setNumColumns] = useState(prefs.cols);

    const [numRows, setNumRows] = useState(prefs.rows);

    const [blockList, setBlockList] = useState(prefs.blocks);

    const [ highScores, setHighScores ] = useState(
        {
            orderColumns: [ "title", "score", "lines", "user" ],
            header: { title: "STAT", score: "SCORE", lines: "LINES", user:  "USER" },
            content:
            {
                orderRows: [ "highScoreGlobal", "highScoreLocal" ],
                rows:
                {
                    highScoreGlobal: { title: "HI - GLOBAL", score: "-", lines: "-", user:  "-" },
                    highScoreLocal: { title: "HI - LOCAL", score: "-", lines: "-", user:  "-" },
                }
            }
        }
    );

    const [ stTimesPlayed, setTimesPlayed ] = useState({ local: 0, global: 0 });

    const [optionsPopUpMsg, setOptionsPopUpMsg] = useState(undefined);

    const statUpdateCounts = useRef(0);

    const debouncedHandler = useMemo(
        () => _debounce(async (asyncCallback) => await asyncCallback(), 500),
        []
    );

    useEffect(
        () =>
        {
            updateStatsDebounced(numColumns, numRows, blockList);
        },
        [ numColumns, numRows, blockList ]
    );

    useEffect(
        () =>
        {
            return () => 
            {
                // Cleanup of the debounced update.
                updateStatsDebounced.cancel();
            }
        },
        []
    )

    const updateStatsDebounced = useMemo(
        () =>
        {
            return _debounce(
                async (numColumns, numRows, blockList) =>
                {
                    console.log("Stats Update #" + ++(statUpdateCounts.current));

                    const lGameStats = utils.GetFromLocalStorage(consts.lclStrgKeyGameStats);
                    //console.log(lGameStats);

                    console.log(`${numRows}X${numColumns}`);

                    const lKeyGridSize = utilsAppSpecific.getGridSizeKey(numColumns, numRows);

                    let lGameStatsLocal = { score: "-", lines: "-", user: "-", timesPlayed: 0 };

                    // Set local stats (if available).
                    if (blockList in lGameStats && lKeyGridSize in lGameStats[blockList])
                        lGameStatsLocal = lGameStats[blockList][lKeyGridSize];

                    updatePrefs({ rows: numRows, cols: numColumns, blocks: blockList });

                    // Set global stats (if available).
                    let lGameStatsGlobal = await ApiRequestor.getGameStats({ "blocks": blockList, "grid": lKeyGridSize });

                    if (!lGameStatsGlobal)
                        lGameStatsGlobal = { score: "-", lines: "-", user: "-", timesPlayed: "-" };

                    // Set state variables.
                    setHighScores(
                        (prev) =>
                        {
                            const lCopy = JSON.parse(JSON.stringify(prev));

                            lCopy.content.rows.highScoreLocal.score = lGameStatsLocal.score;
                            lCopy.content.rows.highScoreLocal.lines = lGameStatsLocal.lines;
                            lCopy.content.rows.highScoreLocal.user = lGameStatsLocal.user;

                            lCopy.content.rows.highScoreGlobal.score = lGameStatsGlobal.score;
                            lCopy.content.rows.highScoreGlobal.lines = lGameStatsGlobal.lines;
                            lCopy.content.rows.highScoreGlobal.user = lGameStatsGlobal.user;

                            return lCopy;
                        }
                    );

                    setTimesPlayed({ local: lGameStatsLocal.timesPlayed, global: lGameStatsGlobal.timesPlayed });
                },
                750
            )
        }, 
        []
    );

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

        setBlockList(lBlockListNew);
    }

    const handleNext = () =>
    {
        if (!lUserContext.value)
        { navigate("/username"); return; } // { state: { rows: numRows, cols: numColumns, blocks: blockList } }

        navigate("/game");
    };

    return ( 
        <PageContainer
            navigate = { navigate }
            buttonNavBarText = "NEXT"
            buttonNavBarHandler = { handleNext }
            headerBtnsLeft = { [ headerButtons.back ] }
            headerBtnsRight = { [ headerButtons.settings ] }
            optionsPopUpMsg = { optionsPopUpMsg }
            style = { styles.container }
        >
            <TextBlocks 
                prText = "GAME OPTIONS" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <div style = { styles.content }>

                <Container title = "GRID DIMENSIONS" style = {{ alignItems: "center", justifyContent: "center" }}>

                    <TextStandard 
                        text = "Select the dimensions of the grid using the sliders." 
                        style = { styles.prompt } isItalic 
                    />

                    <div style = {{ height: 300, width: 300 }}>

                        <div style = {{ height: 260, width: 300, flexDirection: "row" }}>

                            <SliderStandard 
                                prMin = { 0 } prMax = { gRngRows.max } prValue = { numRows } prStep = { 1 } 
                                prIsVertical prIsVerticalTopDown = { false }
                                prOnChange = { (val) => { setNumRows(val); } }
                                prStyleContainer = { styles.sliderContainer }
                                prStyleProgressBar = {{ borderLeft: `1px solid ${theme.borders}`, borderRight: `1px solid ${theme.borders}`, borderRadius: 0 }}
                                // prStyleTrack = { styles.sliderTrackVertical }
                                prShowValue = { false } prShowLabel = { true } prShowStickyValue = { true }
                                prWidth = { 40 }
                                prMinAllowed = { gRngRows.min }
                            />

                            <div style = {{ height: 260, width: 260, padding: 10, justifyContent: "flex-end", alignItems: "flex-start" }}>
                                <GridDisplayer 
                                    prGrid = { new Grid(numColumns, numRows) } 
                                    prMaxWidth = { 250 } prMaxHeight = { 250 }
                                />
                            </div>

                        </div>

                        <div style = {{ height: 40, width: 300, flexDirection: "row" }}>

                            <div 
                                style = {{ 
                                    height: 40, width: 40, backgroundColor: theme.header, border: `1px solid ${theme.borders}`,
                                    borderRight: "none", borderTop: "none", color: "white", justifyContent: "center", alignItems: "center"
                                }}
                            >
                                <ClearIcon 
                                    sx = { { fill: theme.borders, fontSize: 30 } }
                                />
                            </div>

                            <SliderStandard 
                                prMin = { 0 } prMax = { gRngRows.max } prValue = { numColumns } prStep = { 1 }
                                prOnChange = { (val) => { setNumColumns(val); } }
                                prStyleContainer = { styles.sliderContainer }
                                prStyleProgressBar = {{ borderTop: `1px solid ${theme.borders}`, borderBottom: `1px solid ${theme.borders}`, borderRadius: 0 }}
                                prShowValue = { false } prShowLabel = { true } prShowStickyValue = { true }
                                prWidth = { 260 }
                                prMinAllowed = { gRngCols.min } prMaxAllowed = { gRngCols.max }
                            />

                        </div>

                    </div>
                </Container>

                <Container style = { styles.conBlocks } title = "BLOCKS">
                    <TextStandard text = "Select the blocks you want to play with. A block is not selected if it's greyed-out." style = { styles.prompt } isItalic />
                    <div style = { styles.conBlocksInner }>
                        {
                            Object.keys(Block.Type).map(
                                (pBlockType, pIndex) =>
                                {
                                    const lGrid = new Grid(4, 4);

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

                <Container style = { styles.conStats } styleOuter = { styles.conStatsOuter } title = "STATS">
                    <TextStandard text = "Stats for the selected game." isItalic />

                    <TableStandard 
                        prData = { highScores }
                        prStyleTable = {{ backgroundColor: theme.content }}
                        //prBorderColour = { theme.borders }
                        prBorderSize = { 3 }
                        prStyleCellHeader = {{ backgroundColor: theme.buttonContent, padding: 10 }}
                        prStyleCellContent = {{ backgroundColor: theme.buttonContent, textAlign: "center", padding: 10 }}
                        //prStyleColumn = {{ backgroundColor: theme.content }}
                    />

                    <CountLabel text = "Games (Local)" count = { stTimesPlayed.local } style = { styles.countLabel } />

                    <CountLabel text = "Games (Global)" count = { stTimesPlayed.global } style = { styles.countLabel } />
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
        paddingTop: utilsGlobalStyles.spacingVertN(-1)
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
    conStatsOuter:
    {
        width: window.innerWidth > 500 ? 500 : globalProps.widthCon,
        maxWidth: "100%",
    },
    conStats:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-1),
        flexGrow: 0
    },
    tableHighScore:
    {
        //width: "fit-content",
        //alignSelf: "center"
    },
    conBlocksInner:
    {
        flexDirection: "row", flexWrap: "wrap", columnGap: 10, rowGap: 10, justifyContent: "center"
    },
    countLabel: 
    {
        border: "none"
    },
    sliderContainer:
    {
        border: "none",
        borderRadius: 0
    },
};

const gColoursColumnButtons = Array.from({ length: gRngCols.max - gRngCols.min + 1 }, (el, i) => { return i }).map(
    (pIDC) =>
    {
        return utilsAppSpecific.getRandomBlockColour();
    }
);

const gColoursRowButtons = Array.from({ length: gRngRows.max - gRngRows.min + 1 }, (el, i) => { return i }).map(
    (pIDC) =>
    {
        return utilsAppSpecific.getRandomBlockColour();
    }
);


export default GameParams;