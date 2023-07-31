import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import headerButtons from '../../components/header_buttons/HeaderButtons';
import globalProps, { utilsGlobalStyles, globalStyles } from '../../styles';
import consts from '../../utils/constants.js';
import utils from '../../utils/utils.js';

import ThemeContext from "../../contexts/ThemeContext.js";
import UserContext from '../../contexts/UserContext';
import PageContainer from '../../components/page_container/PageContainer';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import Container from '../../components/container/Container';
import TextStandard from '../../components/text_standard/TextStandard';
import ButtonStandard from '../../components/button_standard/ButtonStandard';

function Account() 
{
    const navigate = useNavigate();

    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const lUserContext = useContext(UserContext);

    const handleLogOut = () =>
    {
        lUserContext.updater(undefined);

        navigate("/");
    };

    const lIsSignedIn = lUserContext.value;

    const lUsername = lIsSignedIn ? lUserContext.value.username : "?";

    return ( 
        <PageContainer
            navigate = { navigate }
            headerBtnsLeft = { [ headerButtons.back ] }
            headerBtnsRight = { [ headerButtons.settings ] }
            style = { styles.container }
        >

            <TextBlocks 
                prText = { `Hi ${lUsername}` } prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <ButtonStandard 
                text = "LOG OUT" isBold
                onPress = { handleLogOut } 
                style = { globalStyles.button }
            />

            <ButtonStandard 
                text = "CHANGE ACCOUNT" isBold
                onPress = { () => navigate("/signIn") } 
                style = { globalStyles.button }
            />

            <ButtonStandard 
                text = "PLAY" isBold
                onPress = { () => navigate("/gameParams") } 
                style = { globalStyles.button }
            />

        </PageContainer>
    );
}

const styles =
{
    container:
    {
        rowGap: utilsGlobalStyles.spacingVertN(),
        paddingLeft: utilsGlobalStyles.spacingVertN(-2),
        paddingRight: utilsGlobalStyles.spacingVertN(-2),
    },
    conButtonTheme:
    {
        alignItems: "center",
        // justifyContent: "center"
    },
    conSFX:
    {
        width: "100%",
        maxWidth: 500,
        rowGap: utilsGlobalStyles.spacingVertN(-1),
    },
    text:
    {
        textAlign: "center",
    },
};

export default Account;