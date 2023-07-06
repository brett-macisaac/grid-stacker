import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import ButtonStandard from '../../components/button_standard/ButtonStandard.jsx';
import TextStandard from '../../components/text_standard/TextStandard';
import PageContainer from '../../components/page_container/PageContainer.jsx';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer.jsx';
import GridChar from '../../classes/GridChar';
import GridSymbol from '../../classes/GridSymbol';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import CountLabel from '../../components/count_label/CountLabel';
import Container from '../../components/container/Container';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import utils from '../../utils/utils';
import consts from '../../utils/constants';
import ThemeContext from "../../contexts/ThemeContext.js";
import utilsAppSpecific from '../../utils/utils_app_specific';

function Menu({}) 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const navigate = useNavigate();

    // The total number of games played on this device.
    const totalGamesLocal = useRef(utils.GetFromLocalStorage(consts.lclStrgKeyTotalTimesPlayed, 0));

    // The total number of games played globally by all users. Use an API call to get this value from the database.
    const totalGamesGlobal = useRef(0);

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
            <TextBlocks 
                prText = "GRID STACKER" prSizeText = { 50 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ ...styles.title, justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <Container style = { styles.conGameCount }>
                <TextStandard text = "Number of Games Played" isItalic />
                <CountLabel text = "This Device" count = { totalGamesLocal.current } style = { styles.countLabel } />

                <CountLabel text = "Global" count = { totalGamesGlobal.current } style = { styles.countLabel } />
            </Container>

            {/* <TextBlocks 
                prText = "GS" prSizeText = { 300 } 
                prColourBackground = { theme.emptyGridCell } 
                prColourPattern = { [ utilsAppSpecific.getRandomBlockColour(), utilsAppSpecific.getRandomBlockColour() ] }
                prStyle = {{ ...styles.title, justifyContent: "center", alignItems: "center", backgroundColor: theme.emptyGridCell, width: 600, height: 600, flexShrink: 0 }} 
            /> */}

        </PageContainer>
    );
}

const styles = 
{
    title:
    {
        marginBottom: utilsGlobalStyles.spacingVertN(1)
    },
    container:
    {
        //justifyContent: "space-between", 
        rowGap: utilsGlobalStyles.spacingVertN(-1),
        alignItems: "center",
    },
    conGameCount:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        width: "100%",
        maxWidth: 500
    },
    countLabel: 
    {
        border: "none"
    },
};

export default Menu;