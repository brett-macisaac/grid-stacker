import React from "react";
import PropTypes from 'prop-types';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';

import HeaderButton from "../header_button/HeaderButton.jsx";

/*
* An 'account' button for the app's header.
*/
function BackHdrBtn({ prNavigate })
{
    return (
        <HeaderButton 
            icon = { 
                (size, colour) =>
                {
                    return (
                        <ArrowBackIosNew 
                            sx = { { color: colour, fontSize: size } }
                        />
                    )
                } 
            }
            onPress = { () => { prNavigate(-1) } }
        />
    )
};

BackHdrBtn.propTypes =
{
    prNavigate: PropTypes.func.isRequired,
};

export default BackHdrBtn;