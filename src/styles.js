
const gWidthScreen = window.innerWidth;

const gMaxWidthContainer = 400;

const gWidthCon = gWidthScreen * 0.9 > gMaxWidthContainer ? gMaxWidthContainer : gWidthScreen * 0.9;

/*
* Global styling properties that are used to style components throughout the app.
* These values aim to ensure that styling is consistent.
*/
const globalProps = 
{
    fontSizeStandard: 15,

    spacingStandard: 30,

    widthCon: gWidthCon,

    borderRadiusStandard: 10,

    colourSelected: "#B89F11",

    fontFamilyMono: "Courier New",

    themes:
    {
        dark:
        {
            content: "#272727",
            header: "#000000",
            navBar: "#000000",
            borders: "#FAFAFA",
            buttonContent: "#000000",
            buttonNavBar: "#272727",
            iconHeader: "#FAFAFA",
            font: "#ffffff",
            fontFaded: "#DAD8D8",
            fontButtonContent: "#ffffff",
            fontButtonNavBar: "#ffffff",
            selected: "#9B8509",
            gridBackground: "#272727",
            emptyGridCell: "#000000",
            name: "Dark"
        },
        darkBlue:
        {
            content: "#2F2F69",
            header: "#060627",
            navBar: "#060627",
            borders: "#B8B8FC",
            buttonContent: "#060627",
            buttonNavBar: "#2F2F69",
            iconHeader: "#B8B8FC",
            font: "#ffffff",
            fontFaded: "#DAD8D8",
            fontButtonContent: "#ffffff",
            fontButtonNavBar: "#ffffff",
            selected: "#7c6a04",
            gridBackground: "#2F2F69",
            emptyGridCell: "#060627",
            name: "Ocean"
        },
        darkRed:
        {
            content: "#692F2F",
            header: "#270606",
            navBar: "#270606",
            borders: "#FCB8B8",
            buttonContent: "#270606",
            buttonNavBar: "#692F2F",
            iconHeader: "#FCB8B8",
            font: "#ffffff",
            fontFaded: "#DAD8D8",
            fontButtonContent: "#ffffff",
            fontButtonNavBar: "#ffffff",
            selected: "#7c6a04",
            gridBackground: "#692F2F",
            emptyGridCell: "#270606",
            name: "Scarlet"
        },
        darkPurple:
        {
            content: "#4F2F69",
            header: "#170627",
            navBar: "#170627",
            borders: "#DDB8FC",
            buttonContent: "#170627",
            buttonNavBar: "#4F2F69",
            iconHeader: "#DDB8FC",
            font: "#ffffff",
            fontFaded: "#DAD8D8",
            fontButtonContent: "#ffffff",
            fontButtonNavBar: "#ffffff",
            selected: "#7c6a04",
            gridBackground: "#4F2F69",
            emptyGridCell: "#170627",
            name: "Plum"
        },
    },

    // The default theme.
    themeDefault: "dark",

    /*
    * The 'standard' fontSize value of Text elements.
    * The fontSize of a Text element should equal this value, or this value multiplied by a multiple of 
        fontSizeMultiplier.
    */
    fontSizeBase: 16,

    /*
    * The multiplier of fontSizeBase.
    * If you want the fontSize of a Text element to be higher than fontSizeBase, you multiply fontSizeBase by 
      fontSizeMultiplier; likewise, if you want the fontSize of a Text element to be lower than fontSize, you divide it
      by fontSizeMultiplier.
    * If you want a Text element's fontSize to be even higher, you multiply fontSizeBase by a multiple of 
      fontSizeMultiplier: i.e. fontSize = fontSizeBase * (fontSizeMultiplier)^n.
    * The point of having fontSizeBase and fontSizeMultiplier is to ensure that font sizes are standardised across the 
      application.
    */
    fontSizeMultiplier: 1.25,

    /*
    * The 'standard' value of vertical spacing between elements.
    * The vertical distance between two elements should equal this value, or this value multiplied by a multiple of
      spacingVertMultiplier.
    */
    spacingVertBase: 30,

    /*
    * The multiplier of spacingVertBase.
    * If you want the vertical distance between two elements to be higher than spacingVertBase, you multiply 
    spacingVertBase by spacingVertMultiplier; likewise, if you want two elements to be spaced less than 
    spacingVertBase, you divide spacingVertBase by spacingVertMultiplier.
    * If you want the vertical distance between two elements to be even higher, you multiply spacingVertBase by a 
    multiple of spacingVertMultiplier: i.e. verticalDistance = spacingVertBase * (spacingVertMultiplier)^n.
    * The point of having spacingVertBase and spacingVertMultiplier is to ensure that vertical spacing between elements
    is standardised across the application.
    */
    spacingVertMultiplier: 1.5,

    // The fontWeight of bold text.
    fontWeightBold: 700,

    // The height of the header.
    heightHeader: 60,

    // The height of the footer.
    heightNavBar: 90,

    sizeIconHeaderFooter: 35
};

/*
* Returns the 'nth' biggest fontSize.
* When n is 0, the returned value is simply globalProps.fontSizeBase.
* If n < 0, the returned value will be less than globalProps.fontSizeBase.
* If n > 0, the returned value will be greater than globalProps.fontSizeBase.

* Parameters:
    > n: the 'rank' of the returned value.
*/
function fontSizeN(n = 0)
{
    return globalProps.fontSizeBase * Math.pow(globalProps.fontSizeMultiplier, n);
}

/*
* Returns the 'nth' biggest vertical spacing.
* The returned value is intended to be used as a marginTop/marginBottom value of an element.
* When n is 0, the returned value is simply globalProps.spacingVertBase.
* If n < 0, the returned value will be less than globalProps.spacingVertBase.
* If n > 0, the returned value will be greater than globalProps.spacingVertBase.

* Parameters:
    > n: the 'rank' of the returned value.
*/
function spacingVertN(n = 0)
{
    return globalProps.spacingVertBase * Math.pow(globalProps.spacingVertMultiplier, n);
}

/*
* Returns whether the theme associated with themeName is considered 'dark'.
* In order for this to work, every 'dark' theme must contain the word 'dark'.

* Parameters:
    > themeName: a string that should match one of the keys of globalStyles.themes.
*/
function isThemeDark(themeName)
{
    if (!themeName)
    {
        console.log("No theme name provided; assuming theme is dark.");
        return true;
    }
    else if (typeof themeName !== 'string')
    {
        console.log("The theme name must be a string; assuming theme is dark.");
        return true;
    }
    else if (!(Object.keys(globalProps.themes)).includes(themeName))
    {
        console.log("This theme name is invalid; assuming theme is dark.");
        return true;
    }

    return themeName.includes("dark");
}

const globalStyles =
{
    textBox:
    {
        width: "100%",
        maxWidth: 300
    },
    button:
    {
        width: "100%",
        maxWidth: 300,
        padding: 15,
        borderRadius: globalProps.borderRadiusStandard
    }
};

/*
* Utility functions used throughout the application to assist with styling.
*/
const utilsGlobalStyles = 
{
    fontSizeN: fontSizeN, 
    spacingVertN: spacingVertN,
    isThemeDark: isThemeDark
};

export { globalProps as default, utilsGlobalStyles, globalStyles };