import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import GameLandscape from './GameLandscape';
import GamePortrait from './GamePortrait';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import ThemeContext from "../../contexts/ThemeContext.js";
import PreferenceContext from '../../contexts/PreferenceContext.js';
import WindowSizeContext from '../../contexts/WindowSizeContext.js';

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

    // Acquire window size.
    const windowSize = useContext(WindowSizeContext);

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

    const [ grid, setGrid ] = useState(new Grid(prefs.cols, prefs.rows));

    const [ stats, setStats ] = useState(
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
                    scoreNow: { title: "NOW", score: "-", lines: "-", user: prefs.username }
                }
            }
        }
    );

    const [ gameInProgress, setGameInProgress ] = useState(false);

    useEffect(
        () =>
        {
            // Get local high-score for the current dimensions (if it exists).

            // Get global (i.e. all-time) high-score for the current dimensions (if connection is possible and the returned value isn't 0).

            // Update 'stats' with the above values (if the values exist).
        },
        []
    );

    const handlePlay = async () =>
    {
        // Set the game flag.
        setGameInProgress(true);

        // Reset the game's state.
        setGrid(new Grid(prefs.cols, prefs.rows));

        //gTetrisGrid.Reset();
        //gTetrisInfo.Reset();
        //gTallies.Reset();

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

        // Spawn the first tetromino.
        SpawnNextTetromino();

        while (true)
        {
            // Simulate gravity (wait before dropping).
            await utils.SleepFor(gSoftDrop ? gFallPeriodSoftDrop : lFallPeriodCurrent)
            //Thread.sleep(f_fall_period_current);
                
            if (gIsPaused) // If the game is to be Paused.
            {
                await utils.SleepUntilClick(gBtnPlayPauseResume);
            }

            // Try to move the piece down the screen; if it can move down, continue.
            if (MoveTetromino(Vector2D.s_up))
            { continue; }

            // Delete the tetromino so that the user cannot move/rotate it (i.e. their time is up).
            gTetromino = undefined;

            // Reset the gSoftDrop flag.
            gSoftDrop = false;

            // Remove full lines and record the number of them.
            const lNumFullLines = await gTetrisGrid.RemoveFullLines();

            // If the user cleared at least one line.
            if (lNumFullLines !== 0)
            {
                console.log("Number of full lines: " + lNumFullLines);

                // Calculate the score from the line clears.
                let lScoreFromLineClears = gScoresLineClears[lNumFullLines - 1] * gTetrisInfo.GetInfo("Level");
                
                // If all rows have been cleared (i.e. the grid is empty) double the line clears score.
                // If all rows have been cleared, this is known as a 'perfect clear'.
                if (gTetrisGrid.IsEmpty())
                { lScoreFromLineClears *= 2; }
                
                // Increment the score.
                gTetrisInfo.IncrementScore(lScoreFromLineClears);
                
                // Record the line clears.
                gTetrisInfo.IncrementLines(lNumFullLines);
                
                // A flag that, when true, indicates that a new level has been reached.
                const lIsNewLevel = gTetrisInfo.GetInfo("Lines") - gLengthLevel * gTetrisInfo.GetInfo("Level") > 0;

                if (lIsNewLevel)
                {   
                    // Increment the level.
                    gTetrisInfo.IncrementLevel();
                    
                    // A flag that, when true, indicates that there are no more period cycles.
                    const lNoMorePeriodCycles = lNumPeriodCyclesElapsed + 1 === gNumPeriodCycles;
                    
                    if (!lNoMorePeriodCycles) // If there are further period cycles.
                    {
                        // Update f_num_period_cycles and f_period_coefficient.
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
                    
                    // For testing the fall period.
                    console.log("Level " + gTetrisInfo.GetInfo("Level") + ": fall period is " + lFallPeriodCurrent);
                }
                
            }

            // Create and spawn the next tetromino.
            const lValidSpawn = SpawnNextTetromino();

            // If the tetromino cannot be spawned, end the game and notify the Player that the game is over.
            if (!lValidSpawn)
            {
                if (gTetrisInfo.GetInfo("Score") > gTetrisInfo.GetInfo("High"))
                {
                    console.log("Congratulations! Your score of " + gTetrisInfo.GetInfo("Score") +
                                " is higher than the previous high score of " + gTetrisInfo.GetInfo("High") + '.');
                    
                    // Update the high score.
                    UpdateHighScore();
                }
                else
                {
                    console.log("Game over! You completed " + gTetrisInfo.GetInfo("Lines") + " lines, reached level " + 
                                gTetrisInfo.GetInfo("Level") + ", and scored " + gTetrisInfo.GetInfo("Score") + " points.");
                }

                gTetromino = undefined;
                gNextTetromino = undefined;

                break;
            }

        }

        setGameInProgress(false);
    };

    const isLandscape = () =>
    {
        console.log("Landscape" + windowSize.width > windowSize.height);
        return (windowSize.width > windowSize.height);
    }

    // All of the event handlers.
    const lHandlers = {
        play: handlePlay,
    };

    // The stats to display in the table.


    if (isLandscape())
    {
        return (
            <GameLandscape 
                prGrid = { grid }
                prBlockTallies = { blockTallies }
                prNextBlocks = { nextBlocks }
                prGameInProgress = { gameInProgress }
                prActiveBlocks = { prefs.blocks }
                prStats = { stats }
                prHandlers = { lHandlers }
            />
        );
    }
    else
    {
        return (
            <GamePortrait 
                prGrid = { grid }
                prBlockTallies = { blockTallies }
                prNextBlocks = { nextBlocks }
                prGameInProgress = { gameInProgress }
                prActiveBlocks = { prefs.blocks }
                prStats = { stats }
                prHandlers = { lHandlers }
            />
        )
    }
}

/*
* The slowest/highest period at which the tetromino falls (ms).
*/
const gFallPeriodMax = 700;

/*
* The fastest/lowest period at which the tetromino falls (ms).
*/
const gFallPeriodMin = 200;

/*
* The interval between consecutive tetromino fall period (ms): e.g. the fall rate at level 4 will be 
  s_fall_rate_interval ms lower than at level 3.
* The difference between the max and min fall periods must be divisible by this value: i.e. 
  (s_fall_period_initial - s_fall_period_min) % s_fall_period_interval == 0 must be true.
    
*/
const gFallPeriodInterval = 100;

/*
* The period at which the tetromino falls when the 'soft-drop' mode is active.
*/
const gFallPeriodSoftDrop = gFallPeriodMin / 2;

/*
* The number of period cycles that may elapse.
*/
const gNumPeriodCycles = ((gFallPeriodMax - gFallPeriodMin) / gFallPeriodInterval) + 1;

/*
* The number of lines the Player must clear to go up a level.
* Given that a player can clear at most 4 lines in a single tetromino placement, this should be 4 or higher, as 
  otherwise a player will be able to go up multiple levels in a single move, which may not be desirable.
*/
const gLengthLevel = 4;

/*
* This array is used to increase a Player's score when they clear n lines, where n ranges from 1 to 4.
* A Player's score increases by f_scores_line_clears[n - 1] * f_level.
*/
const gScoresLineClears = [ 40, 100, 300, 1200 ];


export default Game;