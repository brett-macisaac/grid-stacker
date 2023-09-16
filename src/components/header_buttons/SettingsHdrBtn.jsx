import React from "react";
import PropTypes from 'prop-types';
import Settings from '@mui/icons-material/Settings';

import HeaderButton from "../header_button/HeaderButton.jsx";

/*
* An 'account' button for the app's header.
*/
function SettingsHdrBtn({ prNavigate })
{
    return (
        <HeaderButton 
            icon = { 
                (size, colour) =>
                {
                    return (
                        <Settings 
                            sx = { { fill: colour, fontSize: size } }
                        />
                    )
                } 
            }
            onPress = { () => { prNavigate("/settings") } }
        />
    )
};

SettingsHdrBtn.propTypes =
{
    prNavigate: PropTypes.func.isRequired,
};

export default SettingsHdrBtn;