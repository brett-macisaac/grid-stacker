import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import headerButtons from '../../components/header_buttons/HeaderButtons';

import Container from '../../components/container/Container';
import TextStandard from '../../components/text_standard/TextStandard';
import PageContainer from '../../components/page_container/PageContainer';
import ThemeContext from '../../contexts/ThemeContext';
import TextBlocks from '../../components/text_blocks/TextBlocks';

function About() 
{
    const navigate = useNavigate();

    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    return ( 
        <PageContainer
            navigate = { navigate }
            headerBtnsLeft = { [ headerButtons.back ] }
            style = { styles.container }
        >

            <TextBlocks 
                prText = "ABOUT" prSizeText = { 35 } 
                prColourBackground = { theme.emptyGridCell } 
                prStyle = {{ justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
            />

            <Container style = { styles.conText }>

                <TextStandard 
                    text = "What is Grid Stacker?"
                    size = { 2 }
                    isBold
                    style = { styles.title1 }
                />
                <TextStandard 
                    text = {
`Grid Stacker is a web-based game that takes inspiration from other 'falling-blocks' games like Tetris and similar 
alternatives.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />
                <TextStandard 
                    text = {
`Unlike many other games in the genre, particularly newer incarnations, in Grid Stacker there is but one goal: to stack 
the blocks and score as many points until you lose. No special modes, simply stack until you die.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

            </Container>

            <Container style = { styles.conText }>
                <TextStandard 
                    text = "Who Created Grid Stacker?"
                    size = { 2 }
                    isBold
                    style = { styles.title1 }
                />
                <TextStandard 
                    text = {
`I'm Brett MacIsaac, a software engineering student based in Melbourne, Australia.`
                    }
                    style = { styles.paragraph }
                />
                <TextStandard 
                    text = {
`Email: brett.macisaac@outlook.com`
                    }
                    style = { styles.paragraph }
                />
            </Container>

            <Container style = { styles.conText }>
                <TextStandard 
                    text = "Why was Grid Stacker Created?"
                    size = { 2 }
                    isBold
                    style = { styles.title1 }
                />
                <TextStandard 
                    text = {
`After trying to find a simple, no-frills 'falling-blocks' game, I was disappointed by many of the current offerings. 
I was frustrated with all of the additional modes, the absurd amount of ads, the clunky controls, the pay-to-win  
structures, the lack of customisation, etc.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />
                <TextStandard 
                    text = {
`Thus, I decided to develop my own game. A game that lets you do exactly what you want: stack blocks on a grid and score
 points until you lose.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />
            </Container>

            <Container style = { styles.conText }>
                <TextStandard 
                    text = "How is Grid Stacker Different?"
                    size = { 2 }
                    isBold
                    style = { styles.title1 }
                />
                <TextStandard 
                    text = {
`While Grid Stacker obviously shares similarities with its predecessors, the game places greater emphasis on 
customisation and flexibility, resulting in several noteworthy features that set it apart.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Cross-Platform" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`Whether you're on a computer, tablet, or smartphone, Grid Stacker will look appealing and remain playable.
The game should also work as intended on any modern browser.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />
                <TextStandard 
                    text = {
`If you're on a mobile device, the game's UI will adjust depending on whether your phone is in landscape or portrait view.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />
                <TextStandard 
                    text = {
`The on-screen controls are available no matter which device you are playing on; however, intuitive keyboard controls 
give you access to all controls, allowing for a comfortable and effective experience when playing on a computer.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Changeable Grid Size" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`You get to decide how big the grid is, with over 100 unique grid sizes. No longer are you forced 
to play on a 10x20 grid.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Changeable Blocks" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`In addition to changing the grid size, you can also choose which blocks can spawn in, which results 
in over 16,000 unique game modes.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Block Spawn System" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`With most games in this genre, the blocks spawn above the grid, out-of-sight from the user, and proceed to 'fall' onto 
the grid. With Grid Stacker, the blocks spawn directly onto the grid; moreover, rather than spawning in static 
locations, the blocks can spawn anywhere in the top-three rows, which makes playing on smaller grid sizes significantly 
more manageable.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Block Rotation System" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`The rotation system used in Grid Stacker is a modified form of the standard SRS (Super Rotation System) used by many 
games in the genre. The rotation system has been modified slightly to make playing on smaller grid sizes easier.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Themes" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`The colour of the UI can be changed to suit your preference. Each theme is designed to be easy on the eyes: no more 
obscenely-colourful vomit spewed across your screen.`
                    }
                    style = { styles.paragraph }
                    removeLineBreaks
                />

                <TextStandard 
                    text = "Installable" isBold size = { 1 }
                    style = { styles.title2 }
                />
                <TextStandard 
                    text = {
`Grid Stacker is a PWA (Progressive Web App), meaning that it can be installed to your device and played offline.`
                    }
                    style = { styles.paragraph }
                />

            </Container>

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
    conText:
    {
        width: "100%",
        maxWidth: 500
    },
    paragraph:
    {
        marginTop: utilsGlobalStyles.spacingVertN(-3),
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

};

export default About;