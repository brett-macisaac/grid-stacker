import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
import TextInputStandard from '../../components/text_input_standard/TextInputStandard';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx';
import ApiRequestor from '../../ApiRequestor';

function SignUp() 
{
    const navigate = useNavigate();
    const location = useLocation();

    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const lUserContext = useContext(UserContext);

    const [ stUsername, setUsername ] = useState(location.state.username);

    const [ stPassword, setPassword ] = useState(location.state.password);

    const [ stPasswordRenter, setPasswordRenter ] = useState("");

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg] = useState(undefined);

    const handleSignUp = async () =>
    {
        if (!stUsername || !stPassword)
        { setOptionsPopUpMsg(PopUpOk("Missing Input", "Please enter a username and password." )); return; }

        if (stPassword.length < gMinLengthPassword)
        { setOptionsPopUpMsg(PopUpOk("Invalid Password", "Your password must be at least 8 characters long." )); return; }

        if (!stPasswordRenter)
        { setOptionsPopUpMsg(PopUpOk("Missing Input", "Please renter your password to confirm." )); return; }

        if (stPassword != stPasswordRenter)
        { setOptionsPopUpMsg(PopUpOk("Password Mismatch", "Your password doesn't match with the re-entered password." )); return; }

        const lResponseSignUp = await ApiRequestor.signUp(stUsername, stPassword);

        if (!lResponseSignUp)
            { setOptionsPopUpMsg(PopUpOk("Connection Error", "Unable to connect to the server. Are you connected to the internet?" )); return; }
        else if ("error" in lResponseSignUp)
            { setOptionsPopUpMsg(PopUpOk("Problem Found", lResponseSignUp.error)); return; }

        lUserContext.updater(lResponseSignUp);

        navigate("/account");
    };

    return ( 
        <PageContainer
            navigate = { navigate }
            headerBtnsLeft = { [ headerButtons.back ] }
            headerBtnsRight = { [ headerButtons.settings ] }
            style = { styles.container }
            optionsPopUpMsg = { stOptionsPopUpMsg }
            buttonNavBarText = { "Sign Up" }
            buttonNavBarHandler = { handleSignUp }
        >

            <TextBlocks 
                prText = "Sign Up" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <TextStandard 
                text = "Enter a username and password below to create your account." 
                style = { styles.text } 
            />

            <TextInputStandard 
                text = { stUsername } 
                placeholder = { "Username" } 
                style = { globalStyles.textBox }
                maxLength = { consts.maxLengthUsername } 
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

            <TextInputStandard 
                text = { stPasswordRenter } 
                placeholder = { "Re-enter Password" } 
                style = { globalStyles.textBox }
                maxLength = { consts.maxLengthPassword } 
                onChangeText = { (pNewText) => setPasswordRenter(pNewText) }
                secureTextEntry
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

const gMinLengthPassword = 8;

export default SignUp;