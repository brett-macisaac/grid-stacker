import React, { useState, useEffect, useContext, useRef } from 'react';
import { json, useNavigate } from 'react-router-dom';

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

    const [ highScores, setHighScores ] = useState(
        {
            orderColumns: [ "title", "score", "lines", "user" ],
            header: { title: "STAT", score: "SCORE", lines: "LINES", user:  "USER" },
            content:
            {
                orderRows: [ "highScoreGlobal", "highScoreLocal" ],
                rows:
                {
                    highScoreGlobal: { title: "HI (G)", score: "-", lines: "-", user:  "-" },
                    highScoreLocal: { title: "HI (L)", score: "-", lines: "-", user:  "-" },
                }
            }
        }
    );

    const [ timesPlayedLocal, setTimesPlayedLocal ] = useState(0);

    const [ timesPlayedGlobal, setTimesPlayedGlobal ] = useState(0);

    const [optionsPopUpMsg, setOptionsPopUpMsg] = useState(undefined);

    useEffect(
        () =>
        {
            // Initialise the grid.
            // gGrid = new Grid(location.state.cols, location.state.rows);
            // updateGridState();

            updateStats();

            // Get global (i.e. all-time) high-score for the current dimensions (if connection is possible and the returned value isn't 0).
        },
        [ numColumns, numRows, blockList ]
    );

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

    const updateStats = () =>
    {
        const lHighScores = utils.GetFromLocalStorage(consts.lclStrgKeyHighScores);
        const lTimesPlayedObject = utils.GetFromLocalStorage(consts.lclStrgKeyTimesPlayed);

        const lKeyGridSize = utilsAppSpecific.getGridSizeKey(numColumns, numRows);

        let lTimesPlayedLocal = 0;
        let lHighScoreLocal = { score: "-", lines: "-", user: "-" };
        let lHighScoreGlobal = { score: "-", lines: "-", user: "-" };

        // Set local stats.
        if (blockList in lHighScores && lKeyGridSize in lHighScores[blockList])
        {
            lHighScoreLocal.score = lHighScores[blockList][lKeyGridSize].score;
            lHighScoreLocal.lines = lHighScores[blockList][lKeyGridSize].lines;
            lHighScoreLocal.user = lHighScores[blockList][lKeyGridSize].user;

            lTimesPlayedLocal = lTimesPlayedObject[blockList][lKeyGridSize]
        }
        
        // Set global stats (if available).

        // Set state variables.
        setHighScores(
            (prev) =>
            {
                const lCopy = JSON.parse(JSON.stringify(prev));

                lCopy.content.rows.highScoreLocal.score = lHighScoreLocal.score;
                lCopy.content.rows.highScoreLocal.lines = lHighScoreLocal.lines;
                lCopy.content.rows.highScoreLocal.user = lHighScoreLocal.user;

                lCopy.content.rows.highScoreGlobal.score = lHighScoreGlobal.score;
                lCopy.content.rows.highScoreGlobal.lines = lHighScoreGlobal.lines;
                lCopy.content.rows.highScoreGlobal.user = lHighScoreGlobal.user;

                return lCopy;
            }
        );

        setTimesPlayedLocal(lTimesPlayedLocal);
    };

    const handleNext = () =>
    {
        navigate("/username", { state: { rows: numRows, cols: numColumns, blocks: blockList } });
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
            <TextBlocks 
                prText = "GAME OPTIONS" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

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
                                    const lColourText = pNumCols == numColumns ? theme.selected : gColoursColumnButtons[pIndex];

                                    const lBorder = `1px solid ${pNumCols == numColumns ? theme.selected : theme.header}`

                                    return ( 
                                        <ButtonBlocks 
                                            key = { pIndex } 
                                            text = { pNumCols.toString().padStart(2, "0") } 
                                            onPress = { () => { selectColumns(pNumCols); } }
                                            prColourText = { lColourText }
                                            prColourBackground = { theme.header }
                                            style = {{ 
                                                border: lBorder,
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
                    styleInner = {{ ...styles.conOption }}
                >
                    <TextStandard text = "Select the number of rows" isItalic style = { styles.prompt } />

                    <div style = { styles.conGridDimension }>
                        {
                            Array.from(
                                { length: gRngRows.max - gRngRows.min + 1 }, (el, i) => { return i + gRngRows.min }
                            ).map(
                                (pNumRows, pIndex) =>
                                {
                                    const lColourText = pNumRows == numRows ? theme.selected : gColoursRowButtons[pIndex];

                                    const lBorder = `1px solid ${pNumRows == numRows ? theme.selected : theme.header}`

                                    return ( 
                                        <ButtonBlocks 
                                            key = { pIndex }
                                            index = { pIndex } 
                                            text = { pNumRows.toString().padStart(2, "0") } 
                                            onPress = { () => { selectRows(pNumRows); } }
                                            prColourText = { lColourText }
                                            prColourBackground = { theme.header }
                                            style = {{ 
                                                border: lBorder,
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

                <Container style = { styles.conStats }>
                    <TextStandard text = "Stats for the selected game." isItalic />

                    <TableStandard 
                        prData = { highScores }
                        prStyleTable = {{ backgroundColor: theme.content }}
                        //prBorderColour = { theme.borders }
                        prBorderSize = { 3 }
                        prStyleCellHeader = {{ backgroundColor: theme.buttonContent }}
                        prStyleCellContent = {{ backgroundColor: theme.buttonContent }}
                        //prStyleColumn = {{ backgroundColor: theme.content }}
                    />

                    <CountLabel text = "Games (Local)" count = { timesPlayedLocal } style = { styles.countLabel } />

                    <CountLabel text = "Games (Global)" count = { timesPlayedGlobal } style = { styles.countLabel } />
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
    conStats:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-1)
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
    }
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