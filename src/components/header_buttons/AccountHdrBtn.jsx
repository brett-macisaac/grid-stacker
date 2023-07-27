import React, { useContext } from "react";
import PropTypes from 'prop-types';
import Person from '@mui/icons-material/Person';

import UserContext from "../../contexts/UserContext.js";
import HeaderButton from "../header_button/HeaderButton.jsx";

/*
* An 'account' button for the app's header.
*/
function AccountHdrBtn({ prNavigate })
{
    const lUserDetails = useContext(UserContext).value;

    return (
        <HeaderButton 
            icon = { 
                (size, colour) =>
                {
                    return (
                        <Person 
                            sx = { { color: colour, fontSize: size } }
                        />
                    )
                } 
            }
            onPress = { () => { lUserDetails ? prNavigate("/account") : prNavigate("/signIn") } }
        />
    )
};

AccountHdrBtn.propTypes =
{
    prNavigate: PropTypes.func.isRequired,
};

export default AccountHdrBtn;