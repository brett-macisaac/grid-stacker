import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import Container from '../../components/container/Container';
import ControlDescription from './ControlDescription';
import TextStandard from '../../components/text_standard/TextStandard';
import PageContainer from '../../components/page_container/PageContainer';
import ThemeContext from '../../contexts/ThemeContext';
import TextBlocks from '../../components/text_blocks/TextBlocks';

import imgsKeys from './imgsKeys';
import gridSymbols from '../game/symbols_buttons';

function Controls() 
{
    const navigate = useNavigate();

    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return ( 
        <PageContainer
            navigate = { navigate }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            optionsRightHeaderButtons = { [ optionsHeaderButtons.settings ] }
            style = { styles.container }
        >

            <TextBlocks 
                prText = "CONTROLS" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <div style = { styles.conControls }>
                {
                    gControlDescriptions.map(
                        (pCtrlDesc, pIndex) =>
                        {
                            return (
                                <ControlDescription 
                                    key = { pIndex }
                                    prTitle = { pCtrlDesc.title }
                                    prDescription = { pCtrlDesc.description } 
                                    prScreenControl = { pCtrlDesc.screenControl }
                                    prIsScreenControlSquare = { pCtrlDesc.isScreenControlSquare }
                                    prKey = { pCtrlDesc.key } prIsShiftControl = { pCtrlDesc.isShift }
                                />
                            );
                        }
                    )
                }
            </div>

        </PageContainer>
    );
}

const styles =
{
    container:
    {
        rowGap: utilsGlobalStyles.spacingVertN(1),
        //justifyContent: "center", // Issue when content overflows, scroll doesn't go to top.
        //alignItems: "center",
        paddingLeft: utilsGlobalStyles.spacingVertN(-2),
        paddingRight: utilsGlobalStyles.spacingVertN(-2),
    },
    conControls:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: utilsGlobalStyles.spacingVertN(1),
        columnGap: utilsGlobalStyles.spacingVertN(1),
        justifyContent: "center",
        //alignItems: "center",
    },
    conControl:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        // width: "100%",
        // maxWidth: 500
    },
    description:
    {
        textAlign: "center",
    },
    title1:
    {
        textAlign: "center",
        //marginTop: utilsGlobalStyles.spacingVertN(-3),
    },
    title2:
    {
        marginTop: utilsGlobalStyles.spacingVertN(-1),
    },
    imgKeySquare:
    {
        width: 50,
        height: 50
    }

};

const gControlDescriptions =
    [
        {
            title: "LEFT",
            description: "Moves the block 1 space to the left.",
            screenControl: gridSymbols.left,
            isScreenControlSquare: true,
            key: imgsKeys.arrowLeft,
            isShift: false
        },
        {
            title: "RIGHT",
            description: "Moves the block 1 space to the right.",
            screenControl: gridSymbols.right,
            isScreenControlSquare: true,
            key: imgsKeys.arrowRight,
            isShift: false
        },
        {
            title: "CLOCKWISE",
            description: "Rotates the block 90 degrees clockwise.",
            screenControl: gridSymbols.clockwise,
            isScreenControlSquare: true,
            key: imgsKeys.d,
            isShift: false
        },
        {
            title: "ANTI-CLOCKWISE",
            description: "Rotates the block 90 degrees anti-clockwise.",
            screenControl: gridSymbols.anticlockwise,
            isScreenControlSquare: true,
            key: imgsKeys.a,
            isShift: false
        },
        {
            title: "180",
            description: "Rotates the block 180 degrees.",
            screenControl: gridSymbols.rotate180,
            isScreenControlSquare: true,
            key: imgsKeys.s,
            isShift: false
        },
        {
            title: "DOWN (Soft Drop)",
            description: "Increases the speed of the falling block. Press again to return to the normal speed.",
            screenControl: gridSymbols.down,
            isScreenControlSquare: true,
            key: imgsKeys.arrowDown,
            isShift: false
        },
        {
            title: "DOWN MAX (Hard Drop)",
            description: "Instantly moves the block as far down as it can go.",
            screenControl: gridSymbols.downMax,
            isScreenControlSquare: true,
            key: imgsKeys.arrowUp,
            isShift: false
        },
        {
            title: "HOLD",
            description: "Removes the block that is currently falling and replaces it with the block in the 'hold' grid. If there isn't a block in the hold grid, the next block spawns in.",
            screenControl: gridSymbols.hold,
            isScreenControlSquare: false,
            key: imgsKeys.space,
            isShift: false
        },
        {
            title: "CLOCKWISE NEXT",
            description: "Rotates the next block 90 degrees clockwise.",
            screenControl: "Press the grid on which the next block is displayed.",
            isScreenControlSquare: true,
            key: imgsKeys.d,
            isShift: true
        },
        {
            title: "ANTI-CLOCKWISE NEXT",
            description: "Rotates the next block 90 degrees anti-clockwise.",
            screenControl: "Unavailable",
            isScreenControlSquare: true,
            key: imgsKeys.a,
            isShift: true
        },
        {
            title: "180 NEXT",
            description: "Rotates the next block 180 degrees",
            screenControl: "Unavailable",
            isScreenControlSquare: true,
            key: imgsKeys.s,
            isShift: true
        },
    ];

export default Controls;