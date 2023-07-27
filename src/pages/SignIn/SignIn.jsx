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
import TextInputStandard from '../../components/text_input_standard/TextInputStandard';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx';
import ApiRequestor from '../../ApiRequestor';

function SignIn() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const lUserContext = useContext(UserContext);

    const [ stUsername, setUsername ] = useState("");

    const [ stPassword, setPassword ] = useState("");

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg] = useState(undefined);

    const navigate = useNavigate();

    const handleSignIn = async () =>
    {
        if (!stUsername || !stPassword)
        { setOptionsPopUpMsg(PopUpOk("Missing Input", "Please enter a username and password." )); return; }

        const lResponseSignIn = await ApiRequestor.signIn(stUsername, stPassword);

        if (!lResponseSignIn)
        { setOptionsPopUpMsg(PopUpOk("Connection Error", "Unable to connect to the server. Are you connected to the internet?" )); return; }
        else if ("error" in lResponseSignIn)
        { setOptionsPopUpMsg(PopUpOk("Problem Found", lResponseSignIn.error)); return; }

        lUserContext.updater(lResponseSignIn);

        console.log("Sign In");

        navigate("/account");
    };


    return ( 
        <PageContainer
            navigate = { navigate }
            headerBtnsLeft = { [ headerButtons.back ] }
            headerBtnsRight = { [ headerButtons.settings ] }
            style = { styles.container }
            optionsPopUpMsg = { stOptionsPopUpMsg }
            buttonNavBarText = { "Sign In" }
            buttonNavBarHandler = { handleSignIn }
        >

            <TextBlocks 
                prText = "Sign In" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <TextStandard 
                text = "Enter your username and password below to sign in." isItalic
                style = { styles.text } 
            />

            <TextInputStandard 
                text = { stUsername } 
                placeholder = { "Username" } 
                style = { globalStyles.textBox }
                maxLength = { consts.maxLengthName } 
                onChangeText = { (pNewText) => setUsername(pNewText) }
            />

            <TextInputStandard 
                text = { stPassword } 
                placeholder = { "Password" } 
                style = { globalStyles.textBox }
                maxLength = { consts.maxLengthPassword } 
                onChangeText = { (pNewText) => setPassword(pNewText) }
                secureTextEntry
            />

            <TextStandard 
                text = "OR" size = { 1 } isBold
                style = { styles.text } 
            />

            <ButtonStandard 
                text = "CREATE ACCOUNT" isBold
                onPress = { () => navigate("/signUp", { state: { username: stUsername, password: stPassword } }) } 
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
        maxWidth: 300,
        rowGap: utilsGlobalStyles.spacingVertN(-1),
    },
    text:
    {
        textAlign: "center",
    },
    btnCreateAccount: 
    {
        width: "100%",
        maxWidth: 400,
        padding: 15,
        borderRadius: globalProps.borderRadiusStandard
    }
};

export default SignIn;