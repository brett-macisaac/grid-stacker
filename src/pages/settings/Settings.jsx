import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Brightness4 from '@mui/icons-material/Brightness4';
import SportsEsports from '@mui/icons-material/SportsEsports';
import Info from '@mui/icons-material/Info'; 

import globalProps, { utilsGlobalStyles } from '../../styles';
import consts from '../../utils/constants.js';
import utils from '../../utils/utils.js';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import SoundContext from '../../contexts/SoundContext';
import ThemeContext from "../../contexts/ThemeContext.js";
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import PageContainer from '../../components/page_container/PageContainer';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import Container from '../../components/container/container';
import TextStandard from '../../components/text_standard/TextStandard';
import CheckBox from '../../components/check_box/CheckBox';

function Settings() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // SFX context.
    const lSoundContext = useContext(SoundContext);

    const navigate = useNavigate();

    return ( 
        <PageContainer
            navigate = { navigate }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            style = { styles.container }
        >

            <TextBlocks 
                prText = "SETTINGS" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <ButtonNextPage 
                text = "Themes" 
                sizeText = { 1 }
                isBold
                icon = { 
                    <Brightness4 
                        sx = {{ color: theme.fontButtonContent, fontSize: globalProps.sizeIconHeaderFooter }}
                    /> 
                }
                onPress = { () => navigate("/settingsThemes") }
            />

            <ButtonNextPage 
                text = "About" 
                sizeText = { 1 }
                isBold
                icon = { 
                    <Info 
                        sx = {{ color: theme.fontButtonContent, fontSize: globalProps.sizeIconHeaderFooter }} 
                    /> 
                }
                onPress = { () => navigate("/about") }
            />

            <ButtonNextPage 
                text = "Controls" 
                sizeText = { 1 }
                isBold
                icon = { 
                    <SportsEsports 
                        sx = {{ color: theme.fontButtonContent, fontSize: globalProps.sizeIconHeaderFooter }} 
                    /> 
                }
                onPress = { () => navigate("/controls") }
            />

            <Container style = { styles.conSFX }>

                <TextStandard 
                    text = "Do you want sound effects turned on?"
                    style = { styles.text } isItalic removeLineBreaks
                />

                <CheckBox 
                    text = "SFX On?" 
                    isChecked = { lSoundContext.value } 
                    onPress = { () => lSoundContext.updater(!lSoundContext.value) } 
                />

            </Container>

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
        rowGap: utilsGlobalStyles.spacingVertN(-1),
    },
    text:
    {
        textAlign: "center",
    },
};

export default Settings;