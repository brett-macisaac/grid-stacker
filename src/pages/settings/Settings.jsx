import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Brightness4 from '@mui/icons-material/Brightness4';
import Help from '@mui/icons-material/Help';

import globalProps, { utilsGlobalStyles } from '../../styles';
import consts from '../../utils/constants.js';
import utils from '../../utils/utils.js';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import ThemeContext from "../../contexts/ThemeContext.js";
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import PageContainer from '../../components/page_container/PageContainer';

function Settings() 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const navigate = useNavigate();

    return ( 
        <PageContainer
            navigate = { navigate }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            style = { styles.container }
        >

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
                text = "Help" 
                sizeText = { 1 }
                isBold
                icon = { 
                    <Help 
                        sx = {{ color: theme.fontButtonContent, fontSize: globalProps.sizeIconHeaderFooter }} 
                    /> 
                }
                onPress = { () => navigate("/gameInfo") }
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
    }
};

export default Settings;