
// Use HashRouter instead of BrowserRouter to prevent sending the urls to the server, which results in 404.
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from "react";

import ThemeContext from './contexts/ThemeContext';
import PreferenceContext from './contexts/PreferenceContext';
import WindowSizeContext from './contexts/WindowSizeContext';
import SoundContext from './contexts/SoundContext';
import UserContext from './contexts/UserContext';

import './App.css';
import pages from './pages/pages';
import utils from './utils/utils';
import consts from './utils/constants';
import globalProps, { utilsGlobalStyles } from './styles';
import ApiRequestor from './ApiRequestor';

/* Ideas
* Add a preview/summary of the options that the user selects on the game parameters page, in addition to the stats.
  The container would have the text, "Summary of the selected game". This will allow the user to clearly see what 
  they've selected before continuing, which is especially useful on mobile screens that can't display everything at 
  once.
* Display popular game types on the Menu page. The user should be able to select these game modes and go straight to the
  username page.
*/

/*
* Default game preferences.
*/
const gPrefsDefault = { cols: 4, rows: 9, usernameGuest: "", blocks: "IJLOSTZ" };

function App() 
{
    // Global theme variable.
    const [ themeName, setThemeName ] = useState(utils.GetFromLocalStorage(gLclStrgKeyThemeName, globalProps.themeDefault));
    let theme = globalProps.themes[themeName];

    // Global Preferences variable.
    const [ prefs, setPrefs ] = useState(utils.GetFromLocalStorage(consts.lclStrgKeyPreferences, gPrefsDefault));

    const [ sound, setSound ] = useState(utils.GetFromLocalStorage(gLclStrgKeySound, "true") === "true");

    const [ user, setUser ] = useState(utils.GetFromLocalStorage(consts.lclStrgKeyUser, undefined));

    // Global window size variable.
    const [ windowSize, setWindowSize ] = useState({ width: window.innerWidth, height: window.innerHeight });

    const updatePrefs = (pNewPrefs) =>
    {
        if (typeof pNewPrefs !== 'object')
        {
            console.log("The argument must be an object containing the preferences you wish to update.");
            return;
        }

        const lPrefsNew = { ...prefs, ...pNewPrefs };

        setPrefs(lPrefsNew);

        console.log(lPrefsNew);

        utils.SetInLocalStorage(consts.lclStrgKeyPreferences, lPrefsNew);
    };

    const updateWindowSize = () =>
    {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const updateSound = (pSFX) =>
    {
        setSound(pSFX);

        utils.SetInLocalStorage(gLclStrgKeySound, pSFX ? "true" : "false");
    };

    const updateUser = (pUser) =>
    {
        if (!pUser)
        {
            setUser(undefined);
            localStorage.removeItem(consts.lclStrgKeyUser);
            return;
        }

        if (!("username" in pUser) || !("token" in pUser))
        {
            console.log("Invalid user data!");
            return;
        }

        setUser(pUser);

        utils.SetInLocalStorage(consts.lclStrgKeyUser, pUser);
    }

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
            if (!localStorage.getItem(consts.lclStrgKeyMetaStats))
            { 
                utils.SetInLocalStorage(
                    consts.lclStrgKeyMetaStats, 
                    {
                        totalGames: 0,
                        totalScore: 0,
                        totalLines: 0
                    }
                );
            }

            if (!localStorage.getItem(consts.lclStrgKeyGameStats))
            { utils.SetInLocalStorage(consts.lclStrgKeyGameStats, { }); }

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

    useEffect(
        () =>
        {
            ApiRequestor.setAuthToken(user ? user.token : "");
        },
        [ user ]
    );

    return (
        <ThemeContext.Provider      value = {{ themeName, updateTheme }}>
        <PreferenceContext.Provider value = {{ prefs, updatePrefs }}>
        <WindowSizeContext.Provider value = { windowSize }>
        <SoundContext.Provider      value = {{ value: sound, updater: updateSound }}>
        <UserContext.Provider       value = {{ value: user, updater: updateUser }}>
            
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

        </UserContext.Provider>
        </SoundContext.Provider>
        </WindowSizeContext.Provider>
        </PreferenceContext.Provider>
        </ThemeContext.Provider>
    );

}

/*
* A localStorage key whose value is a string that corresponding to the app's current theme.
*/
const gLclStrgKeyThemeName = "themeName";

/*
* A localStorage key whose value is a string that corresponding to the app's current theme.
*/
const gLclStrgKeySound = "SFX";

export default App;
