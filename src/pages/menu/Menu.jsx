import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import headerButtons from '../../components/header_buttons/HeaderButtons';
import ApiRequestor from '../../ApiRequestor';

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
import UserContext from '../../contexts/UserContext';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx';
import utilsAppSpecific from '../../utils/utils_app_specific';

function Menu({}) 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const lUserContext = useContext(UserContext);

    const navigate = useNavigate();

    const [ stMetaStatsLocal, setMetaStatsLocal ] = useState(utils.GetFromLocalStorage(consts.lclStrgKeyMetaStats));

    const [ stMetaStatsGlobal, setMetaStatsGlobal ] = useState(undefined);

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg] = useState(undefined);

    const handlePlay = () =>
    {
        if (!lUserContext.value)  // If the user isn't signed in.
        {
            setOptionsPopUpMsg(
                {
                    title: "Not Signed In",
                    message: "You aren't signed in, meaning that your high-scores won't be recorded globally. Do you wish to continue?",
                    buttons: [
                        { text: "Continue as Guest", onPress: () => { navigate("/gameParams") } },
                        { text: "Sign In", onPress: () => { navigate("/signIn") } },
                        { text: "Create Account", onPress: () => { navigate("/signUp") } },
                    ]
                }
            );
            return;
        }
        navigate("/gameParams");
    };

    useEffect(
        () =>
        {
            const setMetaStats = async () =>
            {
                const lMetaStats = await ApiRequestor.getMetaStats();

                console.log(lMetaStats);

                if (lMetaStats)
                    setMetaStatsGlobal(lMetaStats);
            }

            setMetaStats();
        },
        []
    )

    return ( 
        <PageContainer
            navigate = { navigate }
            buttonNavBarText = "PLAY"
            buttonNavBarHandler = { handlePlay }
            headerBtnsLeft = { [ headerButtons.account ] }
            headerBtnsRight = { [ headerButtons.settings ] }
            style = { styles.container }
            optionsPopUpMsg = { stOptionsPopUpMsg }
        >
            {/* Title */}
            <TextBlocks 
                prText = "GRID STACKER" prSizeText = { 50 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ ...styles.title, justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <Container style = { styles.conGameCount }>
                <TextStandard text = "Local Stats" isItalic isBold size = {1} />
                <CountLabel text = "Games Played" count = { stMetaStatsLocal.totalGames } style = { styles.countLabel } />

                <CountLabel text = "Total Score" count = { stMetaStatsLocal.totalScore } style = { styles.countLabel } />

                <CountLabel text = "Total Lines" count = { stMetaStatsLocal.totalLines } style = { styles.countLabel } />
            </Container>

            {
                stMetaStatsGlobal && (
                    <Container style = { styles.conGameCount }>
                        <TextStandard text = "Global Stats" isItalic isBold size = {1} />
                        <CountLabel text = "Games Played" count = { stMetaStatsGlobal.totalGames } style = { styles.countLabel } />
        
                        <CountLabel text = "Total Score" count = { stMetaStatsGlobal.totalScore } style = { styles.countLabel } />
        
                        <CountLabel text = "Total Lines" count = { stMetaStatsGlobal.totalLines } style = { styles.countLabel } />
                    </Container>
                )
            }

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
        //marginBottom: utilsGlobalStyles.spacingVertN(1)
    },
    container:
    {
        //justifyContent: "space-between", 
        rowGap: utilsGlobalStyles.spacingVertN(1),
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