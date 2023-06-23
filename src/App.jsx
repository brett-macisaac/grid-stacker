
// Use HashRouter instead of BrowserRouter to prevent sending the urls to the server, which results in 404.
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from "react";

import ThemeContext from './contexts/ThemeContext';
import PreferenceContext from './contexts/PreferenceContext';
import WindowSizeContext from './contexts/WindowSizeContext';

import './App.css';
import pages from './pages/pages';
import utils from './utils/utils';
import globalProps, { utilsGlobalStyles } from './styles';
/*
* A localStorage key whose value is a string that corresponding to the app's current theme.
*/
const gLclStrgKeyThemeName = "themeName";

/*
* A localStorage key whose value is a string that corresponding to the user's game preferences.
*/
const gLclStrgKeyPrefs = "gamePreferences";

/*
* Default game preferences.
*/
const gPrefsDefault = { cols: 4, rows: 9, username: "", blocks: "IJLOSTZ" };

function App() 
{
    // Global theme variable.
    const [ themeName, setThemeName ] = useState(globalProps.themeDefault);
    let theme = globalProps.themes[themeName];

    // Global Preferences variable.
    const [ prefs, setPrefs ] = useState(gPrefsDefault);

    // Global window size variable.
    const [ windowSize, setWindowSize ] = useState({ width: window.innerWidth, height: window.innerHeight });

    const updatePrefs = (pPrefPropKey, pPrefPropValue) =>
    {
        if (!prefs.hasOwnProperty(pPrefPropKey))
        {
            console.log("Invalid preference property!");
            return;
        }

        const lPrefsNew = { ...prefs, [pPrefPropKey]: pPrefPropValue }

        setPrefs(lPrefsNew);

        utils.SetInLocalStorage(gLclStrgKeyPrefs, lPrefsNew);
    };

    const updateWindowSize = () =>
    {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        console.log("Window size updated!");
    };

    /*
    * Updates the themeName.

    * Parameters:
        > newThemeName: the name of the theme that will be set.
    */
    const updateTheme = (pThemeName) =>
    {
        if (!pThemeName)
        {
            console.log("No theme name provided!");
            return;
        }

        setThemeName(pThemeName);

        /*
        * Set the background colour of the root view. The root view is generally not visible, but can appear when 
          opening the keyboard. It's white by default, which might be jarring if the theme is black.
        */
        //SystemUI.setBackgroundColorAsync(globalProps.themes[newThemeName].content);

        // Locally store the new theme's name.
        utils.SetInLocalStorage(gLclStrgKeyThemeName, pThemeName);
    };

    /*
    * Initialise the values of the contexts,
    */
    useEffect(
        () =>
        {
            // Get and set stored theme.
            const lThemeName = utils.GetFromLocalStorage(gLclStrgKeyThemeName, globalProps.themeDefault);
            setThemeName(lThemeName);

            // Get and set stored preferences.
            const lPreferences = utils.GetFromLocalStorage(gLclStrgKeyPrefs, gPrefsDefault);
            setPrefs(lPreferences);

            // Set-up an event-listener for window resize.
            window.addEventListener('resize', utils.Debounce(updateWindowSize, 200));

            return () =>
            {
                // Remove event listener.
                window.removeEventListener('resize', utils.Debounce(updateWindowSize, 200));
            }
        },
        []
    );

    return (
        <ThemeContext.Provider value = {{ themeName, updateTheme }}>
        <PreferenceContext.Provider value = {{ prefs, updatePrefs }}>
        <WindowSizeContext.Provider value = { windowSize}>
            
            <Router>
                <Routes>
                    {/* 
                    * This context gives each child component (incl. their descendants) access to the themeName variable.
                    */}
                    {
                        Object.keys(pages).map(
                            (pageName, index) => 
                            {
                                const path = (pageName == "root") ? "/" : `/${pageName}`;

                                const PageComponent = pages[pageName]

                                return (
                                    <Route
                                        path = { path }
                                        element = {<PageComponent />}
                                        key = { index }
                                    />
                                );
                            }
                        )
                    }
                    {/* <Route path = "/" element = { <GameParams /> } />
                    <Route path = "/prev-names" element = { <PrevNames /> } />
                    <Route path = "/names" element = { <PlayerNames /> } />
                    <Route path = "/game" element = { <Game /> } /> */}
                </Routes>
            </Router>

        </WindowSizeContext.Provider>
        </PreferenceContext.Provider>
        </ThemeContext.Provider>
    );

}

export default App;
