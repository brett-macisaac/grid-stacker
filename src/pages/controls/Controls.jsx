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
                                    prKeys = { pCtrlDesc.keys }
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
            keys: [ imgsKeys.arrowLeft ],
        },
        {
            title: "RIGHT",
            description: "Moves the block 1 space to the right.",
            screenControl: gridSymbols.right,
            keys: [ imgsKeys.arrowRight ],
        },
        {
            title: "CLOCKWISE",
            description: "Rotates the block 90 degrees clockwise.",
            screenControl: gridSymbols.clockwise,
            keys: [ imgsKeys.d ],
        },
        {
            title: "ANTI-CLOCKWISE",
            description: "Rotates the block 90 degrees anti-clockwise.",
            screenControl: gridSymbols.anticlockwise,
            keys: [ imgsKeys.a ],
        },
        {
            title: "180",
            description: "Rotates the block 180 degrees.",
            screenControl: gridSymbols.rotate180,
            keys: [ imgsKeys.s ],
        },
        {
            title: "DOWN (Soft Drop)",
            description: "Increases the speed of the falling block. Press again to return to the normal speed.",
            screenControl: gridSymbols.down,
            keys: [ imgsKeys.arrowDown ],
        },
        {
            title: "DOWN MAX (Hard Drop)",
            description: "Instantly moves the block as far down as it can go.",
            screenControl: gridSymbols.downMax,
            keys: [ imgsKeys.arrowUp ],
        },
        {
            title: "HOLD",
            description: "Removes the block that is currently falling and replaces it with the block in the 'hold' grid. If there isn't a block in the hold grid, the next block spawns in.",
            screenControl: gridSymbols.hold,
            keys: [ imgsKeys.space ],
        },
        {
            title: "CLOCKWISE NEXT",
            description: "Rotates the next block 90 degrees clockwise.",
            screenControl: "Press the grid on which the next block is displayed.",
            keys: [ imgsKeys.shift, imgsKeys.d ],
        },
        {
            title: "ANTI-CLOCKWISE NEXT",
            description: "Rotates the next block 90 degrees anti-clockwise.",
            screenControl: "Unavailable",
            keys: [ imgsKeys.shift, imgsKeys.a ],
        },
        {
            title: "180 NEXT",
            description: "Rotates the next block 180 degrees",
            screenControl: "Unavailable",
            keys: [ imgsKeys.shift, imgsKeys.s ],
        },
        {
            title: "CLOCKWISE HELD",
            description: "Rotates the held block 90 degrees clockwise.",
            screenControl: "Press the grid on which the held block is displayed.",
            keys: [ imgsKeys.alt, imgsKeys.d ],
        },
        {
            title: "ANTI-CLOCKWISE HELD",
            description: "Rotates the held block 90 degrees anti-clockwise.",
            screenControl: "Unavailable",
            keys: [ imgsKeys.alt, imgsKeys.a ],
        },
        {
            title: "180 HELD",
            description: "Rotates the held block 180 degrees",
            screenControl: "Unavailable",
            keys: [ imgsKeys.alt, imgsKeys.s],
        },
    ];

export default Controls;