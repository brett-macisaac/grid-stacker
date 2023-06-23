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

/*
* AsyncStorage keys for the top, middle, and bottom balls.
*/
const lclStrgKeyBallsTop = "MenuBallsTop";
const lclStrgKeyBallsMid = "MenuBallsMid";
const lclStrgKeyBallsBottom = "MenuBallsBottom";

//const GridG = new GridChar('G');

function Menu({}) 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const navigate = useNavigate();

    const [ grid, setGrid ] = useState(new Grid(10, 20));

    useEffect(
        () =>
        {
            const lBlock = new Block();

            setGrid(
                (prev) => 
                {
                    const lCopy = prev.copy();

                    lCopy.DrawBlockAt(lBlock, Grid.DrawPosition.CentreMid, false);

                    return lCopy;
                }
            )
        },
        []
    );

    const handlePlay = () =>
    {
        navigate("/gameParams");
    };

    return ( 
        <PageContainer
            navigate = { navigate }
            buttonNavBarText = "PLAY"
            buttonNavBarHandler = { handlePlay }
            optionsRightHeaderButtons = { [ optionsHeaderButtons.settings ] }
            style = { styles.container }
        >
            {/* Title */}
            <TextBlocks prText = "GRID STACKER" prSizeText = { 50 } prColourBackground = { theme.emptyGridCell } prStyle = {{ justifyContent: "center" }} />

            <ButtonBlocks text = "<" onPress = { () => { console.log("Hello") } } prSizeText = { 50 } prColourBackground = { theme.buttonContent } style = {{ padding: 10 }} />

            {/* Create a 'BlockSymbol' component for displaying non-standard symbols, such as arrows. */}
            <ButtonBlocks text = "^" onPress = { () => { console.log("Hello") } } prSizeText = { 50 } prColourBackground = { theme.buttonContent } style = {{ padding: 10 }} />

            {/* Put stats here: e.g. "Number of games you've played, number of games played by everyone, etc." */}
            
        </PageContainer>
    );
}

const styles = 
{
    container:
    {
        justifyContent: "space-between", 
        alignItems: "center",
    },
    btnMenu: 
    {
        maxWidth: globalProps.widthGridPoolBall,
        width: window.innerWidth * 0.75,
        borderRadius: globalProps.borderRadiusStandard,
        paddingTop: 10,
        paddingBottom: 10,
        // borderWidth: 1
    }
};

export default Menu;