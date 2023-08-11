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
import TextInputStandard from '../../components/text_input_standard/TextInputStandard.jsx';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx'
import headerButtons from '../../components/header_buttons/HeaderButtons';

/*
* A local storage key for all of the usernames that have been used in the past.
*/
const gLclStrgKeyPreviousPlayers = "PreviousPlayers";

//const GridG = new GridChar('G');

function Username() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // The user's preferences and the function that handles updating it.
    const { prefs, updatePrefs } = useContext(PreferenceContext);

    const [ username, setUsername ] = useState(prefs.usernameGuest);

    const [ prevPlayers, setPrevPlayers ] = useState(utils.GetFromLocalStorage(gLclStrgKeyPreviousPlayers, []));

    const [ optionsPopUpMsg, setOptionsPopUpMsg ] = useState(undefined);

    const navigate = useNavigate();

    useEffect(
        () =>
        {
        },
        []
    );

    const handleTextInput = (pNewUserName) =>
    {
        setUsername(pNewUserName);

        updatePrefs("usernameGuest", pNewUserName);
    };

    const selectPrevPlayer = (pUsername) =>
    {
        setUsername(pUsername);

        updatePrefs("usernameGuest", pUsername);
    };

    const handlePlay = () =>
    {
        if (username == "")
        {
            setOptionsPopUpMsg(PopUpOk("No Username", "You must enter a guest username to play."));
            return;
        }

        const lIsNewUser = !prevPlayers.includes(username);

        if (lIsNewUser)
        {
            utils.SetInLocalStorage(gLclStrgKeyPreviousPlayers, [ ...prevPlayers, username ]);
        }
        
        navigate("/game");
    };

    return ( 
        <PageContainer
            navigate = { navigate }
            buttonNavBarText = "PLAY"
            buttonNavBarHandler = { handlePlay }
            headerBtnsLeft = { [ headerButtons.back ] }
            headerBtnsRight = { [ headerButtons.settings ] }
            optionsPopUpMsg = { optionsPopUpMsg }
            style = { styles.container }
        >
            <TextBlocks 
                prText = "USERNAME" 
                prSizeText = { 40 } 
                prColourBackground = { theme.emptyGridCell } 
                style = {{ justifyContent: "center" }} 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }}
            />

            <TextStandard 
                text = "Because you are signed out, you must play with a guest account. Enter a username below to continue." 
                style = {{ textAlign: "center", maxWidth: 400 }} 
                isItalic 
            />

            <TextInputStandard 
                placeholder = "Username"
                text = { username } 
                onChangeText = { (pNewText) => handleTextInput(pNewText) } 
                maxLength = { 20 } 
            />

            {
                (prevPlayers.length != 0 && !(prevPlayers.length == 1 && prevPlayers[0] == username)) && (
                    <div style = { styles.conPrevPlayers }>
                        <TextStandard 
                            text = "Or, select a previous username from below." 
                            style = {{ textAlign: "center", }} isItalic isBold
                        />

                        {
                            prevPlayers.map(
                                (pUsername, pIndex) =>
                                {
                                    return (
                                        <ButtonStandard 
                                            key = { pIndex } 
                                            text = { pUsername } 
                                            onPress = { () => { selectPrevPlayer(pUsername); } } 
                                            isBold
                                            style = { styles.btnPrevPlayer }
                                        />
                                    )
                                }
                            )
                        }
                    </div>
                )
            }

        </PageContainer>
    );
}

const styles = 
{
    container:
    {
        //justifyContent: "space-between", 
        alignItems: "center",
        rowGap: utilsGlobalStyles.spacingVertN()
    },
    conPrevPlayers:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-1)
    },
    btnPrevPlayer:
    {
        padding: 10,
        borderRadius: globalProps.borderRadiusStandard
    }
};

export default Username;