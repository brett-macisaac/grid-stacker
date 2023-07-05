
import PropTypes from 'prop-types';
import React, { useContext, useState, useEffect } from "react";
//import { useIsFocused } from "@react-navigate/native"; 

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps from '../../styles';
import HeaderButton from "../header_button/HeaderButton.jsx";
import Grid from '../../classes/Grid.js';
import GridDisplayer from '../grid_displayer/GridDisplayer.jsx';
import Block from '../../classes/Block.js';
import ButtonStandard from "../button_standard/ButtonStandard.jsx";
import consts from "../../utils/constants.js";
import utils from "../../utils/utils.js";
import "./Header.css";

/*
* An AsyncStorage key whose value is the number of the pool ball that's displayed in the header.
*/
const lclStrgKeyBlockType = "HeaderBlockType";

/*
* The custom header component that's used by the PageContainer component.

* Props:
    > navigate: the object that allows for navigate to pages in the app.
    > optionsLeftButtons: an array of options for each of the header buttons placed on the left. Each element is an 
      object that has three properties: icon, onPress, and left. The icon is a function that takes a parameter list of 
      (size, colour) and returns a vector icon (such as from Ionicons) that uses the size and colour arguments for its 
      corresponding props. The onPress prop is a function that's called when the icon is clicked.
    > optionsRightButtons: same as optionsLeftButtons but for the buttons on the right.
    > setOptionsPopUpMsg: a function that's used to have a pop-up message appear. This may be desirable to warn the user
      when they click a button in the header, such as an 'exit' button that might cause them to lose progress.
*/
const Header = ({ navigate, optionsLeftButtons, optionsRightButtons, setOptionsPopUpMsg }) => 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const [ grid, setGrid ] = useState(new Grid(5, 5));

    const [ block, setBlock ] = useState(new Block());

    /*
    * Set the ball number to the one stored locally on the user's device.
    */
    useEffect(
        () =>
        {
            const lBlockType = utils.GetFromLocalStorage(lclStrgKeyBlockType, "I");

            //console.log("Header block: " + lBlockType);

            setBlock(new Block(lBlockType));
        },
        []
    );

    const cycleBlock = () => 
    {
        const lBlockTypes = Object.keys(Block.Type);

        const lIndexCurrentBlock = lBlockTypes.indexOf(block.type);

        const lIndexNextBlock = (lIndexCurrentBlock + 1) % lBlockTypes.length;

        //console.log("New Block: " + lBlockTypes[lIndexNextBlock])

        setBlock(new Block(lBlockTypes[lIndexNextBlock]));

        utils.SetInLocalStorage(lclStrgKeyBlockType, lBlockTypes[lIndexNextBlock]);
    };

    /*
    * Update the grid every time the block changes.
    */
    useEffect(
        () =>
        {
            setGrid(
                (prev) => 
                {
                    const lCopy = prev.copy();

                    lCopy.Reset();

                    lCopy.DrawBlockAt(block, Grid.DrawPosition.CentreMid, false);

                    return lCopy;
                }
            );
        },
        [ block ]
    );
  
    return (
        <div 
            style = {{ 
                ...styles.container, backgroundColor: theme.header, borderBottom: `1px solid ${theme.borders}`, //zIndex: 1
            }}
        >

            <div style = { { ...styles.sideContainer, ...styles.leftContainer } }>
                {
                    optionsLeftButtons && optionsLeftButtons.map(
                        (options, index) =>
                        {
                            return (
                                <HeaderButton 
                                    key = { index }
                                    icon = { options.icon }
                                    onPress = { 
                                        () => { options.onPress(navigate, setOptionsPopUpMsg) } 
                                    }
                                />
                            )
                        }
                    )
                }
            </div>

            <GridDisplayer prGrid = { grid } prMaxWidth = { 40 } prMaxHeight = { 40 } prOnClick = { cycleBlock } />

            {/* Put a grid here instead, maybe 4x4 with a piece that changes everytime the user clicks it. */}
            {/* <ButtonStandard
                onPress = { incrementBallNumber }
                activeOpacity = { 1 }
                style = {{ 
                    ...styles.btnBall, borderColor: theme.selected
                }}
            >
                <PoolBall 
                    number = { ballNumber } 
                    potted = { false } 
                    selected = { false }
                    sizeBall = { 46 }
                />
            </ButtonStandard> */}

            <div style = { { ...styles.sideContainer, ...styles.rightContainer } }>
                {
                    optionsRightButtons && optionsRightButtons.map(
                        (options, index) =>
                        {
                            return (
                                <HeaderButton 
                                    key = { index }
                                    icon = { options.icon }
                                    onPress = { 
                                        () => { options.onPress(navigate, setOptionsPopUpMsg) } 
                                    }
                                />
                            )
                        }
                    )
                }
            </div>

        </div>
    );
};

Header.propTypes =
{
    navigate: PropTypes.func.isRequired,
    optionsLeftButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func.isRequired
            }
        )
    ),
    optionsRightButtons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                icon: PropTypes.func.isRequired,
                onPress: PropTypes.func.isRequired
            }
        )
    ),
    setOptionsPopUpMsg: PropTypes.func
};

Header.defaultProps =
{
}

const styles =
{
    container: 
    {
        //flex: 1,
        //width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: globalProps.heightHeader,
        width: "100%"
    },
    sideContainer: 
    {
        width: 1,
        flexGrow: 1,
        flexDirection: "row"
    },
    leftContainer:
    {
        justifyContent: "flex-start",
    },
    rightContainer:
    {
        justifyContent: "flex-end",
    },
    btnBall:
    {
        backgroundColor: 'transparent', 
        width: 48, 
        height: 48, 
        borderRadius: 24,
        borderWidth: 2,
        borderStyle: "solid"
    }
};

export default Header;