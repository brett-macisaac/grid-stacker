import React, { useContext } from 'react';
import PropTypes from "prop-types";

import ThemeContext from "../../contexts/ThemeContext.js";
import GridSymbol from '../../classes/GridSymbol';
import imgsKeys from './imgsKeys';
//import gridSymbols from '../game/symbols_buttons';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer';
import Container from '../../components/container/Container';
import TextStandard from '../../components/text_standard/TextStandard';
import globalProps, { utilsGlobalStyles } from '../../styles';


function ControlDescription({ prTitle, prDescription, prScreenControl, prIsScreenControlSquare, prKeys, prIsShiftControl, prCtrlKey })
{
    //Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return (
        <Container style = { styles.container }>

                <TextStandard 
                    text = { prTitle }
                    style = { styles.text } isBold size = { 2 }
                />
                <TextStandard 
                    text = { prDescription }
                    style = { styles.text } isItalic removeLineBreaks
                />

            <div style = {{ ...styles.conControls, borderColor: theme.borders }}>

                <div style = 
                    {{ ...styles.conControl, ...styles.conControlScreen, borderColor: theme.borders }}
                >
                    <TextStandard 
                        text = { "SCREEN" }
                        isBold size = { 0 }
                        style = {{ 
                            ...styles.text, ...styles.titleControl, backgroundColor: theme.header, borderColor: theme.borders
                        }}
                    />

                    <div style = { styles.conControlInner }>
                        {
                            (prScreenControl instanceof GridSymbol) && (
                                <div
                                    style = {{ 
                                        ...styles.btnGameControl, 
                                        border: `1px solid ${prScreenControl.colour}`,
                                        backgroundColor: theme.emptyGridCell,
                                    }}
                                >
                                    <GridDisplayer 
                                        prGrid = { prScreenControl.grid } 
                                        prMaxHeight = { 50 } prMaxWidth = { 50 } 
                                        prColourBackground = { theme.emptyGridCell }
                                    />
                                </div>
                            )
                        }
                        {
                            (typeof prScreenControl === 'string') && (
                                <TextStandard 
                                    text = { prScreenControl }
                                    size = { -1 }
                                    style = { styles.text }
                                />
                            )
                        }
                    </div>

                </div>

                <div style = 
                    {{ ...styles.conControl, ...styles.conControlKeyboard, borderColor: theme.borders }}
                >
                    <TextStandard 
                        text = { "KEYBOARD" }
                        isBold size = { 0 }
                        style = {{ 
                            ...styles.text, ...styles.titleControl, backgroundColor: theme.header, borderColor: theme.borders
                        }}
                    />

                    <div style = { styles.conControlInner }>
                        {
                            prKeys.map(
                                (pKey, pIndex) =>
                                {
                                    return (
                                        <div key = { pIndex } style = { styles.conKey }>
                                            <img src = { pKey } alt = "key" style = { styles.imgKey } />
                                            {
                                                (pIndex != prKeys.length - 1) && (
                                                    <TextStandard 
                                                        text = { "+" }
                                                        isBold size = { 2 }
                                                        style = {{ 
                                                            ...styles.text
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>

                </div>

            </div>

        </Container>
    );
}

ControlDescription.propTypes =
{
    prTitle: PropTypes.string.isRequired,
    prDescription: PropTypes.string.isRequired,
    prScreenControl: PropTypes.oneOfType([
        PropTypes.instanceOf(GridSymbol).isRequired,
        PropTypes.string.isRequired
    ]),
    prKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ControlDescription.defaultProps =
{
};

const styles = 
{
    container:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-1),
    },
    text:
    {
        textAlign: "center",
    },
    conControls:
    {
        flexDirection: "row",
        width: "100%",
        border: "1px solid",
    },
    conControl:
    {
        width: "50%",
        alignItems: "center",
        paddingBottom: utilsGlobalStyles.spacingVertN(-2)
    },
    conControlInner:
    {
        width: "100%", height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 8, paddingRight: 8,
        rowGap: utilsGlobalStyles.spacingVertN(-2),
    },
    conControlScreen:
    {
        borderRight: "1px solid"
    },
    conControlKeyboard:
    {
        borderLeft: "1px solid"
    },
    titleControl:
    {
        width: "100%",
        padding: 10,
        marginBottom: utilsGlobalStyles.spacingVertN(-2),
        borderBottom: "1px solid"
    },
    btnGameControl:
    {
        width: "fit-content",
        padding: 7,
        borderRadius: globalProps.borderRadiusStandard,
        //border: "1px solid"
    },
    imgKey:
    {
        maxWidth: "100%", maxHeight: "100%"
    },
    imgKeySquare:
    {
        width: 60,
        height: 60
    },
    imgKeyRect:
    {
        width: 120,
        height: 50
    },
    conKey:
    {
        //marginBottom: utilsGlobalStyles.spacingVertN(-3),
        rowGap: utilsGlobalStyles.spacingVertN(-3)
    }
};

export default ControlDescription;