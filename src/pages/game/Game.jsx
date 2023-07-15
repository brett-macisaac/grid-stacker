import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import GameLandscape from './GameLandscape';
import GamePortrait from './GamePortrait';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import Vector2D from '../../classes/Vector2D';
import gridSymbols from './symbols_buttons';
import ThemeContext from "../../contexts/ThemeContext.js";
import PreferenceContext from '../../contexts/PreferenceContext.js';
import WindowSizeContext from '../../contexts/WindowSizeContext.js';
import utils from '../../utils/utils';
import utilsAppSpecific from '../../utils/utils_app_specific';
import consts from '../../utils/constants';

function Game() 
{
    const location = useLocation();

    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // Acquire window size.
    const windowSize = useContext(WindowSizeContext);

    // The user's preferences.
    const { prefs } = useContext(PreferenceContext);

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

    const rfNextBlocks = useRef(
        [ ...Array(4) ].map(
            () =>
            {
                const lBlocks = location.state.blocks.split('');
                return new Block(lBlocks[utils.GetRandom(0, lBlocks.length - 1)]);
            }
        )
    );

    const rfHeldBlock = useRef(undefined);

    const [ updater, setUpdater ] = useState({});
    
    //const [ grid, setGrid ] = useState({ instance: rfGrid.current });

    const rfGrid = useRef(
        new Grid(location.state.cols, location.state.rows)  
    );

    const rfBlock = useRef(undefined);

    const stats = useRef(
        {
            orderColumns: [ "title", "score", "lines", "user" ],
            header: { title: "STAT", score: "SCORE", lines: "LINES", user:  "USER" },
            content:
            {
                orderRows: [ "highScoreGlobal", "highScoreLocal", "scoreNow" ],
                rows:
                {
                    highScoreGlobal: { title: "HI (G)", score: "-", lines: "-", user:  "-" },
                    highScoreLocal: { title: "HI (L)", score: "-", lines: "-", user:  "-" },
                    scoreNow: { title: "NOW", score: "-", lines: "-", user: location.state.username }
                }
            }
        }
    );

    const rfGameInProgress = useRef(false);

    const areMenuButtonsEnabled = useRef(true);

    const isBlockThePrevHeldBlock = useRef(false);

    const didHeldBlockJustSpawn = useRef(false);

    useEffect(
        () =>
        {
            const lHighScores = utils.GetFromLocalStorage(consts.lclStrgKeyHighScores);

            const lKeyGridSize = utilsAppSpecific.getGridSizeKey(location.state.cols, location.state.rows);

            if (location.state.blocks in lHighScores && lKeyGridSize in lHighScores[location.state.blocks])
            {
                stats.current.content.rows.highScoreLocal.score = lHighScores[location.state.blocks][lKeyGridSize].score;
                stats.current.content.rows.highScoreLocal.lines = lHighScores[location.state.blocks][lKeyGridSize].lines;
                stats.current.content.rows.highScoreLocal.user = lHighScores[location.state.blocks][lKeyGridSize].user;
            }

            // Get global (i.e. all-time) high-score for the current dimensions (if connection is possible and the returned value isn't 0).

            // Get some random block colours for the buttons.
            const lRandomColours = utilsAppSpecific.getRandomBlockColours(4);

            // An object to store the buttons' colours.
            const lColoursButtons = { 
                left: "", right: "", leftMax: "", rightMax: "", down: "", downMax: "", clockwise: "", anticlockwise: "", 
                rotate180: "", hold: "" 
            };

            // Set colour of the horizontal movement buttons.
            lColoursButtons.left = lRandomColours[0]; lColoursButtons.right = lRandomColours[0]; 
            lColoursButtons.rightMax = lRandomColours[0]; lColoursButtons.leftMax = lRandomColours[0];

            // Set colour of the vertical movement buttons.
            lColoursButtons.down = lRandomColours[1]; lColoursButtons.downMax = lRandomColours[1]; 

            // Set colour of the rotation  buttons.
            lColoursButtons.clockwise = lRandomColours[2]; lColoursButtons.anticlockwise = lRandomColours[2];
            lColoursButtons.rotate180 = lRandomColours[2];

            // Set colour of the 'hold' button.
            lColoursButtons.hold = lRandomColours[3];

            for (const pKey in gridSymbols)
            {
                gridSymbols[pKey].setColour(lColoursButtons[pKey]);
            }

            // Update buttons' colours.
            reRender();

            document.addEventListener("keydown", handleKeyDown);

            return () =>
            {
                document.removeEventListener("keydown", handleKeyDown);
            }
        },
        []
    );

    const handlePlay = async () =>
    {
        if (!areMenuButtonsEnabled.current)
            return;

        // Set the game flag.
        rfGameInProgress.current = true;

        // Reset the game's state.
        resetGame();

        // The current period that defines the block's fall rate.
        let lFallPeriodCurrent = gFallPeriodMax;

        // The number of 'period cycles' that have elapsed.
        let lNumPeriodCyclesElapsed = 0;

        /*
        * The value which determines what lFallPeriodCurrent will be when a new level is reached.
        * The higher this value, the lower lFallPeriodCurrent is; when lPeriodCoefficient is at its highest value, 
          lFallPeriodCurrent is at its lowest.
        */
        let lPeriodCoefficient = 0;

        // Spawn the first block.
        spawnNextBlock();

        while (true)
        {
            // Simulate gravity (wait before dropping).
            await utils.SleepFor(gSoftDrop ? gFallPeriodSoftDrop : lFallPeriodCurrent);

            // If the held block was just spawned in, wait again (i.e. 'reset' gravity).
            if (didHeldBlockJustSpawn.current)
            {
                didHeldBlockJustSpawn.current = false;

                await utils.SleepFor(gSoftDrop ? gFallPeriodSoftDrop : lFallPeriodCurrent);
            }

            // Try to move the piece down the screen; if it can move down, continue.
            if (moveBlock(Vector2D.s_up, true))
            { continue; }

            // Disable user's ability to move the block.
            rfBlock.current = undefined;

            // Reset the gSoftDrop flag.
            gSoftDrop = false;

            const lNumFullLines = (rfGrid.current).GetNumFullLines();
            const lIsPerfectClear = rfGrid.current.IsEmptyAfterClear();

            // If the user cleared at least one line.
            if (lNumFullLines != 0)
            {
                // The current level.
                let lLevel = Math.floor(getStat("lines") / gLengthLevel) + 1;

                // Calculate the score from the line clears.
                let lScoreFromLineClears = gScoresLineClears[lNumFullLines - 1] * lLevel;

                // The score multiplier.
                let lMultiplier = 1;
                
                // Modify the multiplier based on perfect clears.
                if (lIsPerfectClear)
                { 
                    gStreakStats.perfectClearStreak += 1;

                    console.log(`Perfect clear streak of ${gStreakStats.perfectClearStreak}.`);

                    lMultiplier *= (gStreakStats.perfectClearStreak + 1)
                }
                else
                {
                    gStreakStats.perfectClearStreak = 0;
                }

                // Factor in the user's streak.
                if (lNumFullLines != 1)
                {
                    gStreakStats.lineClearStreakCount += 1;
                    console.log(`Line clear streak of ${gStreakStats.lineClearStreakCount}.`);

                    lMultiplier *= gStreakStats.lineClearStreakCount;
                }
                else
                {
                    gStreakStats.lineClearStreakCount = 0;
                }

                // Multiply the base score.
                lScoreFromLineClears *= lMultiplier;

                console.log(`Score from ${lNumFullLines} lines: ${lScoreFromLineClears}`);

                rfGrid.current.text = `${lScoreFromLineClears} x${lMultiplier}`;

                // Remove full lines.
                await removeFullLines();

                rfGrid.current.text = "";

                // Increment the score and lines.
                addScoreAndLines(lScoreFromLineClears, lNumFullLines);

                // A flag that, when true, indicates that a new level has been reached.
                const lIsNewLevel = getStat("lines") - gLengthLevel * lLevel >= 0;

                if (lIsNewLevel)
                {
                    // A flag that, when true, indicates that there are no more period cycles.
                    const lNoMorePeriodCycles = lNumPeriodCyclesElapsed + 1 === gNumPeriodCycles;
                    
                    if (!lNoMorePeriodCycles) // If there are further period cycles.
                    {
                        // Update lNumPeriodCyclesElapsed and lPeriodCoefficient.
                        if (lFallPeriodCurrent === gFallPeriodMin)
                        {
                            ++lNumPeriodCyclesElapsed;
                            
                            lPeriodCoefficient = lNumPeriodCyclesElapsed;
                        }
                        else
                        {
                            ++lPeriodCoefficient;
                        }
                        
                        // Calculate the period for the current level.
                        lFallPeriodCurrent = gFallPeriodMax - gFallPeriodInterval * lPeriodCoefficient;
                    }

                    const lLevelNew = lLevel + 1;
                    
                    // For testing the fall period.
                    console.log("Lines: " + getStat('lines'));
                    console.log("Level " + lLevelNew + ": fall period is " + lFallPeriodCurrent);
                }
                
            }

            // Create and spawn the next block.
            const lValidSpawn = spawnNextBlock();

            // If the block cannot be spawned, end the game and notify the Player that the game is over.
            if (!lValidSpawn)
            {
                break;
            }
        }

        console.log("Game over");

        rfGameInProgress.current = false;

        // Disable user's ability to move the block.
        rfBlock.current = undefined;

        // Disable the menu buttons temporarily so that the user doesn't accidentally click it.
        disableMenuButtonsTemporarily();

        updateStats();

        reRender();

        console.log("Game over 2");
    };

    const handleExit = (pNavigate) =>
    {
        if (!areMenuButtonsEnabled.current)
            return;

        pNavigate("/");
    }

    /*
    * Clears all rows that are full and also shifts all other (non-full) rows downwards.
     
     * Return Value:
         > The number of full rows that were cleared. 
    */
    const removeFullLines = async () => //throws InterruptedException
    {
        // The dimensions of the grid.
        const lGridDimensions = rfGrid.current.dimension;

        // The time taken to clear 1 line.
        const lPausePerLine = 250

        // The time to pause between individual tiles being shifted down (ms).
        const lPausePerTile = lPausePerLine / lGridDimensions.columns;

        // The number of full rows found thus far.
        let lNumFullRows = 0;

        for (let row = lGridDimensions.rows - 1; row >= 0; --row)
        {   
            let lIsRowFull = true;
            let lIsRowEmpty = true;
            
            for (let col = 0; col < lGridDimensions.columns; ++col)
            {
                if (!lIsRowFull && !lIsRowEmpty) // If both booleans have been falsified.
                {
                    break;
                }
                else if (rfGrid.current.IsTileEmpty(col, row))
                {
                    // If at least one tile is empty, the row can't be full.
                    lIsRowFull = false;
                }
                else // if (!this.IsTileEmpty(col, row))
                {
                    // If at least one tile is filled, the row can't be empty.
                    lIsRowEmpty = false;
                }
            }
            
            if (lIsRowFull) 
            { 
                // Record occurrence of full row.
                ++lNumFullRows;
                
                // Clear the row.
                for (let col = 0; col < lGridDimensions.columns; ++col)
                {
                    if (rfGrid.current.IsTileEmpty(col, row))
                    { continue; }

                    // Clear the colour of the tile at coordinate (col,row).
                    rfGrid.current.EmptyTile(col, row);
                    reRender();

                    await utils.SleepFor(lPausePerTile);
                }
            }
            // else if (lIsRowEmpty) // If the row is empty, this means that all rows above it are also empty.
            // {
            //     break;
            // }
            else if (lNumFullRows !== 0) // && !lIsRowFull && !lIsRowEmpty (if the row isn't full and isn't empty: i.e. semi-filled).
            {
                // Shift the (non-full, non-empty) row down lNumFullRows rows.
                for (let col = 0; col < lGridDimensions.columns; ++col)
                {
                    if (rfGrid.current.IsTileEmpty(col, row))
                    { continue; }

                    // Copy the colour of the tile at coordinate (col,row) to the appropriate row (row + lNumFullRows).
                    rfGrid.current.SetTileColour(col, row + lNumFullRows, rfGrid.current.GetTile(col, row));

                    // Clear the colour of the tile at coordinate (col,row).
                    rfGrid.current.EmptyTile(col, row);

                    reRender();

                    await utils.SleepFor(lPausePerTile);
                }
                
            }
            
        }
        
        // Return the number of full rows that were cleared.
        return lNumFullRows;
    };

    const moveBlock = (pMovement) =>
    {
        if (!(rfBlock.current instanceof Block))
        { return false; }

        let lDidMove = rfBlock.current.Move(pMovement, rfGrid.current, true);

        if (lDidMove)
        {
            if (pMovement == Vector2D.s_left)
            {
                new Audio(gSounds.left).play();
            }
            else if (pMovement == Vector2D.s_right)
            {
                new Audio(gSounds.right).play();
            }

            reRender();
        }

        return lDidMove;
    };

    /*
    * Tries to rotate the current block in a given direction.

    * Parameters:
        > a_clockwise: a flag that, when true, indicates that the block is to be rotated clockwise.
    */
    const rotateBlock = (pClockwise) =>
    {
        if (!(rfBlock.current instanceof Block))
        { return false; }

        let lDidRotate = rfBlock.current.Rotate(pClockwise, rfGrid.current, true);

        if (lDidRotate)
        {
            if (pClockwise)
            {
                new Audio(gSounds.clockwise).play();
            }
            else
            {
                new Audio(gSounds.anticlockwise).play();
            }

            reRender();
        }

        return lDidRotate;
    }

    /*
    * Tries to rotate the current block 180 degrees.
    */
    const rotateBlock180 = () =>
    {
        if (!(rfBlock.current instanceof Block))
        { return false; }

        let lDidRotate = rfBlock.current.Rotate180(rfGrid.current);

        if (lDidRotate)
        {
            new Audio(gSounds.rotate180).play();
            reRender();
        }

        return lDidRotate;
    }

    /*
    * Rotates the next block in a given direction.
    */
    const rotateNextBlock = (pClockwise) =>
    {
        const lNextBlock = rfNextBlocks.current[rfNextBlocks.current.length - 1];

        if (!rfGameInProgress.current || !(lNextBlock instanceof Block))
        { return; }

        lNextBlock.changeRotationIndex(pClockwise);

        if (pClockwise)
            new Audio(gSounds.clockwise).play();
        else
            new Audio(gSounds.anticlockwise).play();

        reRender();
    }

    const rotateHeldBlock = (pClockwise) =>
    {
        if (!rfGameInProgress.current || !(rfHeldBlock.current instanceof Block))
        { return; }

        rfHeldBlock.current.changeRotationIndex(pClockwise);

        reRender();
    }

    /*
    * Rotates the next block 180 degrees
    */
    const rotateNextBlock180 = () =>
    {
        const lNextBlock = rfNextBlocks.current[rfNextBlocks.current.length - 1];

        if (!rfGameInProgress.current || !(lNextBlock instanceof Block))
        { return; }

        // Rotate block 180 degrees (i.e. rotate twice in any direction).
        lNextBlock.changeRotationIndex(true); lNextBlock.changeRotationIndex(true);

        reRender();
    }

    /*
    * Rotate the held block 180 degrees.
    */
    const rotateHeldBlock180 = () =>
    {
        if (!rfGameInProgress.current || !(rfHeldBlock.current instanceof Block))
        { return; }

        // Rotate block 180 degrees (i.e. rotate twice in any direction).
        rfHeldBlock.current.changeRotationIndex(true); rfHeldBlock.current.changeRotationIndex(true);

        reRender();
    }

    const shiftBlock = (pDirection) =>
    {
        if (!(rfBlock.current instanceof Block))
        { return; }

        const lLengthShift = rfBlock.current.Shift(rfGrid.current, pDirection, false);

        if (lLengthShift != 0)
        {
            if (pDirection == Vector2D.s_left)
                new Audio(gSounds.shiftLeft).play();
            else if (pDirection == Vector2D.s_right)
                new Audio(gSounds.shiftRight).play();
            else if (pDirection == Vector2D.s_up)
                new Audio(gSounds.shiftDown).play();
        }
        reRender();
    };

    const spawnNextBlock = () =>
    {
        // If rfBlock has already been set (e.g. from the player 'holding' a block), do not spawn a new block in.
        // i.e. a block should only be spawned if it's undefined.
        if (rfBlock.current)
        { return; }

        rfBlock.current = rfNextBlocks.current[rfNextBlocks.current.length - 1].copy();
        isBlockThePrevHeldBlock.current = false;

        //let lCanSpawn = rfGrid.current.DrawBlockAt(rfBlock.current, Grid.DrawPosition.TopTwoRows, false);
        //reRender();
        let lCanSpawn = rfGrid.current.DrawBlockAt(rfBlock.current, Grid.DrawPosition.TopTwoRows, false);

        const lBlocks = location.state.blocks.split('');

        rfNextBlocks.current = [ 
            new Block(lBlocks[utils.GetRandom(0, lBlocks.length - 1)]),
            ...(rfNextBlocks.current.slice(0, rfNextBlocks.current.length - 1))
        ];

        if (lCanSpawn)
        {
            incrementTally(rfBlock.current.type);
        }

        reRender();

        return lCanSpawn;
    }

    const holdBlock = () =>
    {
        if (!(rfBlock.current instanceof Block))
        { return; }

        // If the current block was the block held previously, return.
        if (isBlockThePrevHeldBlock.current)
        { return; }

        rfGrid.current.UnDrawBlock(rfBlock.current);

        if (!rfHeldBlock.current)
        {
            rfHeldBlock.current = rfBlock.current.copy();

            rfBlock.current = undefined;

            spawnNextBlock();
        }
        else
        {
            const lBlockCurrent = rfBlock.current.copy();

            rfBlock.current = rfHeldBlock.current;
            isBlockThePrevHeldBlock.current = true;

            rfHeldBlock.current = lBlockCurrent;

            // let lCanSpawn = rfGrid.current.DrawBlockAt(rfBlock.current, Grid.DrawPosition.TopTwoRows, false);
            // reRender();
            rfGrid.current.DrawBlockAt(rfBlock.current, Grid.DrawPosition.TopTwoRows, false);
            reRender();
        }

        didHeldBlockJustSpawn.current = true;
    };

    const addScoreAndLines = (pScore, pLines) =>
    {
        stats.current.content.rows.scoreNow.score += pScore
        stats.current.content.rows.scoreNow.lines += pLines;
    };

    const resetScoreAndLines = (pScore, pLines) =>
    {
        stats.current.content.rows.scoreNow.score = pScore
        stats.current.content.rows.scoreNow.lines = pLines;
    };

    /*
    * Once a game is over, this function should be called to update the game's stats.
    */
    const updateStats = () =>
    {
        // Update the 'total times played' variable.
        const lTotalTimesPlayed = utils.GetFromLocalStorage(consts.lclStrgKeyTotalTimesPlayed);
        utils.SetInLocalStorage(consts.lclStrgKeyTotalTimesPlayed, lTotalTimesPlayed + 1);

        // The grid-size key.
        const lKeyGridSize = utilsAppSpecific.getGridSizeKey(location.state.cols, location.state.rows);

        const lTimesPlayed = utils.GetFromLocalStorage(consts.lclStrgKeyTimesPlayed);

        if (!(location.state.blocks in lTimesPlayed))
        {
            lTimesPlayed[location.state.blocks] = { };
        }

        // The number of times the user has played with the current game configuration.
        let lTimesPlayedCurrentGame;

        if (lKeyGridSize in lTimesPlayed[location.state.blocks])
        {
            lTimesPlayedCurrentGame = lTimesPlayed[location.state.blocks][lKeyGridSize];
        }
        else
        {
            lTimesPlayedCurrentGame = 0;
        }

        // Increment the tally.
        lTimesPlayed[location.state.blocks][lKeyGridSize] = lTimesPlayedCurrentGame + 1;

        // Update the local stats object.
        utils.SetInLocalStorage(consts.lclStrgKeyTimesPlayed, lTimesPlayed);

        // The (local) high-scores object
        const lHighScores = utils.GetFromLocalStorage(consts.lclStrgKeyHighScores);

        if (!(location.state.blocks in lHighScores))
        {
            lHighScores[location.state.blocks] = { };
        }

        // The current local high-score.
        let lHighScoreLocal = getStat("highLocal");
        if (!Number.isInteger(lHighScoreLocal))
        { lHighScoreLocal = 0; }

        // The score that the user just posted.
        const lScoreNow = getStat("score");

        if (lScoreNow > lHighScoreLocal)
        {
            if (lKeyGridSize in lHighScores)
            {
                lHighScores[location.state.blocks][lKeyGridSize].score = lScoreNow;
                lHighScores[location.state.blocks][lKeyGridSize].lines = getStat("lines");
                lHighScores[location.state.blocks][lKeyGridSize].user = getStat("user");
            }
            else
            {
                lHighScores[location.state.blocks][lKeyGridSize] = { score: lScoreNow, lines: getStat("lines"), user: location.state.username };
            }

            // Update the stats.
            stats.current.content.rows.highScoreLocal.score = lScoreNow;
            stats.current.content.rows.highScoreLocal.lines = getStat("lines");
            stats.current.content.rows.highScoreLocal.user = location.state.username;

            // Update the local stats object.
            utils.SetInLocalStorage(consts.lclStrgKeyHighScores, lHighScores);
        }

        // Check if the all-time high-score was beaten and update the database if so.
    }

    const getStat = (pStat) =>
    {
        if (pStat == "score")
        {
            return stats.current.content.rows.scoreNow.score;
        }
        else if (pStat == "lines")
        {
            return stats.current.content.rows.scoreNow.lines;
        }
        else if (pStat == "user")
        {
            return stats.current.content.rows.scoreNow.user;
        }
        else if (pStat == "highLocal")
        {
            return stats.current.content.rows.highScoreLocal.score;
        }
        else if (pStat == "highGlobal")
        {
            return stats.current.content.rows.highScoreGlobal.score;
        }
        else
        {
            return undefined;
        }
    };

    const resetTallies = () => 
    {
        setBlockTallies(
            (prev) =>
            {
                const lCopy = { ...prev };

                for (const key of Object.keys(lCopy))
                {
                    lCopy[key] = 0;
                }

                return lCopy;
            }
        );
    };

    const incrementTally = (pBlockType) =>
    {
        setBlockTallies(
            (prev) =>
            {
                return { ...prev, [pBlockType]: prev[pBlockType] + 1 }
            }
        );
    }

    const resetNextBlocks = () =>
    {
        const lBlocks = location.state.blocks.split('');

        rfNextBlocks.current = [ ...Array(4) ].map(
            () =>
            {
                return new Block(lBlocks[utils.GetRandom(0, lBlocks.length - 1)]);
            }
        );
    };

    const resetGame = () =>
    {
        rfGrid.current.Reset();
        resetScoreAndLines(0, 0);
        resetTallies();
        resetNextBlocks();
        rfHeldBlock.current = undefined;
        reRender();

        for (const key in gStreakStats)
        {
            gStreakStats[key] = 0;
        }
    };

    /*
    * This is designed to be called at the end of a game to disable the menu buttons (i.e. the 'PLAY' and 'EXIT') buttons
    */
    const disableMenuButtonsTemporarily = () =>
    {
        areMenuButtonsEnabled.current = false;

        const enableMenuButtons = () => { areMenuButtonsEnabled.current = true };

        setTimeout(enableMenuButtons, 1000);
    };

    const reRender = () =>
    {
        setUpdater({});
    }

    const isLandscape = () =>
    {
        return (windowSize.width > windowSize.height);
    };

    const handleKeyDown = (pEvent) =>
    {
        if (pEvent.repeat)
            return;

        pEvent.stopPropagation();
        
        if (!rfBlock.current || !rfGameInProgress.current)
        { return; }

        // The key that was pressed down.
        const lKey = pEvent.code;

        // Whether the shift key is down.
        const lIsShiftDown = pEvent.shiftKey;

        // Whether the alt key is down.
        const lIsAltDown = pEvent.altKey;

        // Translational Movement.
        if (lKey === "ArrowDown")
        {
            gSoftDrop = !gSoftDrop;
        }
        else if (lKey === "ArrowUp")
        {
            shiftBlock(Vector2D.s_up);
        }
        else if (lKey === "ArrowLeft")
        {
            if (lIsShiftDown)
                shiftBlock(Vector2D.s_left);
            else
                moveBlock(Vector2D.s_left);
        }
        else if (lKey === "ArrowRight")
        {
            if (lIsShiftDown)
                shiftBlock(Vector2D.s_right);
            else
                moveBlock(Vector2D.s_right);
        }

        // Rotational Movement.
        if (lKey === "KeyD")
        {
            if (lIsShiftDown)
                rotateNextBlock(true)
            else if (lIsAltDown)
                rotateHeldBlock(true)
            else
                rotateBlock(true);
        }
        else if (lKey === "KeyA")
        {
            if (lIsShiftDown)
                rotateNextBlock(false)
            else if (lIsAltDown)
                rotateHeldBlock(false)
            else
                rotateBlock(false);
        }
        else if (lKey === "KeyS")
        {
            if (lIsShiftDown)
                rotateNextBlock180()
            else if (lIsAltDown)
                rotateHeldBlock180()
            else
                rotateBlock180();
        }

        // Block holding.
        if (lKey == "Space")
        {
            holdBlock();
        }
    };

    // All of the event handlers.
    const lHandlers = {
        play: handlePlay,
        exit: handleExit,
        left: () => moveBlock(Vector2D.s_left),
        right: () => moveBlock(Vector2D.s_right),
        clockwise: () => rotateBlock(true),
        anticlockwise: () => rotateBlock(false),
        down: () => { gSoftDrop = !gSoftDrop; },
        downMax: () => shiftBlock(Vector2D.s_up),
        leftMax: () => shiftBlock(Vector2D.s_left),
        rightMax: () => shiftBlock(Vector2D.s_right),
        rotate180: rotateBlock180,
        rotateNextBlock: () => rotateNextBlock(true),
        rotateHeldBlock: () => rotateHeldBlock(true),
        hold: holdBlock,
    };

    const lGridHold = new Grid(4, 4);
    if (rfHeldBlock.current)
    {
        lGridHold.DrawBlockAt(rfHeldBlock.current, Grid.DrawPosition.CentreMid, false);
    }

    if (isLandscape())
    {
        return (
            <GameLandscape 
                prGrid = { rfGrid.current }
                prBlockTallies = { blockTallies }
                prNextBlocks = { rfNextBlocks.current }
                prGridHold = { lGridHold }
                prGameInProgress = { rfGameInProgress.current }
                prActiveBlocks = { location.state.blocks }
                prStats = { stats.current }
                prHandlers = { lHandlers }
                prButtonSymbols = { gridSymbols }
                pUpdater = { updater }
            />
        );
    }
    else
    {
        return (
            <GamePortrait 
                prGrid = { rfGrid.current }
                prBlockTallies = { blockTallies }
                prNextBlocks = { rfNextBlocks.current }
                prGridHold = { lGridHold }
                prGameInProgress = { rfGameInProgress.current }
                prActiveBlocks = { location.state.blocks }
                prStats = { stats.current }
                prHandlers = { lHandlers }
                prButtonSymbols = { gridSymbols }
                pUpdater = { updater }
            />
        )
    }
}

/*
* The slowest/highest period at which the block falls (ms).
*/
const gFallPeriodMax = 900;

/*
* The fastest/lowest period at which the block falls (ms).
*/
const gFallPeriodMin = 300;

/*
* The interval between consecutive block fall period (ms): e.g. the fall rate at level 4 will be 
  s_fall_rate_interval ms lower than at level 3.
* The difference between the max and min fall periods must be divisible by this value: i.e. 
  (s_fall_period_initial - s_fall_period_min) % s_fall_period_interval == 0 must be true.
*/
const gFallPeriodInterval = 100;

/*
* The period at which the block falls when the 'soft-drop' mode is active.
*/
const gFallPeriodSoftDrop = 200;

/*
* The number of period cycles that may elapse.
*/
const gNumPeriodCycles = ((gFallPeriodMax - gFallPeriodMin) / gFallPeriodInterval) + 1;

/*
* The number of lines the Player must clear to go up a level.
* Given that a player can clear at most 4 lines in a single block placement, this should be 4 or higher, as 
  otherwise a player will be able to go up multiple levels in a single move, which may not be desirable.
*/
const gLengthLevel = 4;

/*
* This array is used to increase a player's score when they clear n lines, where n ranges from 1 to 4.
* At level x, after clearing n lines, the player's score increases by gScoresLineClears[n - 1] * x; if the player 
  executed a 'perfect clear' whereby the grid is completely empty, this value is doubled.
*/
const gScoresLineClears = [ 40, 100, 300, 1200 ];

/*
* The user's 'streaks' stats. A 'streak' is when the user does something a number of times in succession. For instance,
  if the user executes a perfect clear 3 times in-a-row, this is a streak, which they are rewarded for.
*/
const gStreakStats = 
{
    /*
    * The number of perfect clears the user has made in-a-row. The user's score is multiplied by whatever this number
      is. 
    */
    perfectClearStreak: 0,

    /*
    * The user's line-clear streak. This refers to the number of line-clears the user has made in-a-row without any of
      them being only a single line. If you clear only a single line, your streak is ruined. This encourages strategic 
      play by using all of the available information the game gives to you.
    */
    lineClearStreakCount: 0
};

// A flag that, when true, indicates that the block should be 'soft dropped'.
let gSoftDrop = false;

const gSounds = 
{
    left: "./src/assets/sounds/arcade_beep.wav",
    right: "./src/assets/sounds/arcade_beep.wav",
    clockwise: "./src/assets/sounds/drill_1.mp3",
    anticlockwise: "./src/assets/sounds/drill_2.mp3",
    rotate180: "./src/assets/sounds/drill_3.mp3",
    shiftLeft: "./src/assets/sounds/metal_impact.wav",
    shiftRight: "./src/assets/sounds/metal_impact.wav",
    shiftDown: "./src/assets/sounds/metal_impact.wav",
};

export default Game;