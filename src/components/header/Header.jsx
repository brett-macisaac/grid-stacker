
import PropTypes from 'prop-types';
import React, { useContext, useState, useEffect } from "react";
//import { useIsFocused } from "@react-navigate/native"; 

import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps from '../../styles';
import HeaderButton from "../header_button/HeaderButton.jsx";
import TextBlocks from '../text_blocks/TextBlocks.jsx';
import Grid from '../../classes/Grid.js';
import GridDisplayer from '../grid_displayer/GridDisplayer.jsx';
import Block from '../../classes/Block.js';
import ButtonStandard from "../button_standard/ButtonStandard.jsx";
import consts from "../../utils/constants.js";
import utils from "../../utils/utils.js";
import "./Header.css";
import utilsAppSpecific from '../../utils/utils_app_specific.js';

/*
* A local storage key whose value is the pair of colours that are used for the header's logo.
*/
const glclStrgKeyLogoColours = "HeaderLogoColours";

/*
* The custom header component that's used by the PageContainer component.

* Props:
    > navigate: the object that allows for navigate to pages in the app.
    > btnsLeft: an array of options for each of the header buttons placed on the left. Each element is an 
      object that has three properties: icon, onPress, and left. The icon is a function that takes a parameter list of 
      (size, colour) and returns a vector icon (such as from Ionicons) that uses the size and colour arguments for its 
      corresponding props. The onPress prop is a function that's called when the icon is clicked.
    > btnsRight: same as btnsLeft but for the buttons on the right.
    > setOptionsPopUpMsg: a function that's used to have a pop-up message appear. This may be desirable to warn the user
      when they click a button in the header, such as an 'exit' button that might cause them to lose progress.
*/
const Header = ({ navigate, btnsLeft, btnsRight, setOptionsPopUpMsg }) => 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const [ stLogoColours, setLogoColours ] = useState(
        utils.GetFromLocalStorage(
            glclStrgKeyLogoColours, 
            [ utilsAppSpecific.getRandomBlockColour(), utilsAppSpecific.getRandomBlockColour() ]
        )
    );

    useEffect(
        () =>
        {
        },
        []
    );

    const randomiseLogoColours = () =>
    {
        const lLogoColoursNew = [ 
            utilsAppSpecific.getRandomBlockColour(), utilsAppSpecific.getRandomBlockColour() 
        ];

        setLogoColours(lLogoColoursNew);

        utils.SetInLocalStorage(glclStrgKeyLogoColours, lLogoColoursNew);
    };
  
    return (
        <div 
            style = {{ 
                ...styles.container, backgroundColor: theme.header, borderBottom: `1px solid ${theme.borders}`, //zIndex: 1
            }}
        >

            <div style = { { ...styles.sideContainer, ...styles.leftContainer } }>
                {
                    btnsLeft && btnsLeft.map(
                        (BtnComponent, pIndex) =>
                        {
                            return <BtnComponent key = { pIndex } prNavigate = { navigate } />
                        }
                    )
                }
                {/* { btnsLeft } */}
            </div>

            <div 
                style = {{ ...styles.conLogo, backgroundColor: theme.emptyGridCell }}
                onClick = { randomiseLogoColours }
            >
                <TextBlocks 
                    prText = "GS" prSizeText = { 40 } 
                    prColourBackground = { theme.emptyGridCell } 
                    prColourPattern = { stLogoColours }
                />
            </div>

            <div style = { { ...styles.sideContainer, ...styles.rightContainer } }>
                {
                    btnsRight && btnsRight.map(
                        (BtnComponent, pIndex) =>
                        {
                            return <BtnComponent key = { pIndex } prNavigate = { navigate } />
                        }
                    )
                }
                {/* { btnsRight } */}
                {/* {
                    btnsRight && btnsRight.map(
                        (options, index) =>
                        {
                            return (
                                <HeaderButton 
                                    key = { index }
                                    icon = { options.icon }
                                    onPress = { 
                                        () => { options.onPress(navigate, setOptionsPopUpMsg) } 
                                    }
                                />
                            )
                        }
                    )
                } */}
            </div>

        </div>
    );
};

Header.propTypes =
{
    navigate: PropTypes.func.isRequired,
    btnsLeft:  PropTypes.arrayOf(
        PropTypes.elementType
    ),
    btnsRight: PropTypes.arrayOf(
        PropTypes.elementType
    ),
    setOptionsPopUpMsg: PropTypes.func
};

Header.defaultProps =
{
}

const styles =
{
    container: 
    {
        //flex: 1,
        //width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: globalProps.heightHeader,
        width: "100%"
    },
    sideContainer: 
    {
        width: 1,
        flexGrow: 1,
        flexDirection: "row"
    },
    leftContainer:
    {
        justifyContent: "flex-start",
    },
    rightContainer:
    {
        justifyContent: "flex-end",
    },
    conLogo:
    {
        justifyContent: "center", 
        alignItems: "center", 
        padding: 5
    }
};

export default Header;