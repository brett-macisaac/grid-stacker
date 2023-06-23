import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from "react";

import TextStandard from '../text_standard/TextStandard';
import ButtonStandard from '../button_standard/ButtonStandard';
import CheckBox from '../check_box/CheckBox';
import ThemeContext from "../../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles } from '../../styles';
import consts from '../../utils/constants';
import utils from '../../utils/utils';

/*
* An localStorage key whose value is an array of IDs (strings) which refer to the pop-up messages that can no longer
  be displayed. A pop-up usually makes it to this 'blacklist' when the user selects the 'Do Not Show Again' checkbox
  when the pop-up annoys them.
*/
const lclStrgKeyPopUpBlackList = "PopUpBlackList";

/*
* The app's pop-up message component.

* Props:
    > title: the pop-up's title.
    > message: the pop-up's message.
    > buttons: the pop-up's buttons. This should be an array of objects. Each object should have two properties: text
      (string) and onPress (function). The button's 'text' is required, but 'onPress' is not.
    > removePopUp: the function that contains the logic to remove the pop-up.
    > dismissable: a boolean that, when true, indicates that the pop-up can be dismissed by clicking off it. This should
      be false if you want the user to click one of the buttons.
    > id: the ID of the pop-up. This is an optional prop. If the pop-up's ID is on the 'blacklist', the pop-up is not 
      displayed. An ID can be added to the blacklist by the user checking the 'never show again' checkbox, which can be 
      displayed by setting showNeverShowAgainCheckbox to true.
    > showNeverShowAgainCheckbox: whether to display the 'never show again' checkbox. The 'id' prop must also be set for
      the checkbox to display.
*/
function PopUpStandard({ title, message, buttons, removePopUp, dismissable, id, showNeverShowAgainCheckbox })
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    // An array of IDs that correspond to pop-ups that can no longer be displayed.
    const [ blackList, setBlackList ] = useState([]);

    const [ blackListedByCheckBox, setBlackListedByCheckBox ] = useState(false);

    /*
    * Set the blacklist to the one stored locally on the user's device.
    */
    useEffect(
        () =>
        {
            // A function that retrieves the stored theme and then updates themeName.
            const getAndSetBlackList = async function() 
            {
                const blackList = await utils.GetFromLocalStorage(lclStrgKeyPopUpBlackList, []);

                setBlackList(blackList);
            };

            getAndSetBlackList();
        },
        []
    );

    const handlePressNeverShowAgain = async () =>
    {
        const isBlacklisted = blackList.includes(id);

        let blackListNew;

        if (isBlacklisted)
        {
            blackListNew = blackList.filter((ID) => ID != id);
        }
        else
        {
            blackListNew = [...blackList]

            blackListNew.push(id);

            setBlackListedByCheckBox(true);
        }

        setBlackList(blackListNew);

        await utils.SetInLocalStorage(lclStrgKeyPopUpBlackList, blackListNew);
    }

    if (!(id ? (!blackList.includes(id) || blackListedByCheckBox) : true))
    {
        return null;
    }

    return (
        <div
            //isOpen = { id ? (!blackList.includes(id) || blackListedByCheckBox) : true }
            onClick = { dismissable ? removePopUp : undefined }
            style = {{ 
                backgroundColor: theme.header + "99", // Add alpha channel to create transparency.
                ...styles.container,
            }}
        >
            <div
                onClick = { (e) => e.stopPropagation() }
                style = {{
                    backgroundColor: theme.content,
                    border: `1px solid ${theme.borders}`,
                    ...styles.alertBox
                }}
                //activeOpacity = { 1.0 }
            >
                {/* Title */}
                <TextStandard text = { title } size = { 1 } isBold />

                {/* Message */}
                <TextStandard text = { message } />

                {/* Buttons */}
                {
                    buttons.map(
                        (button, index) =>
                        {
                            return (
                                <ButtonStandard 
                                    text = { button.text } 
                                    sizeText = { 1 }
                                    isBold
                                    onPress = { 
                                        () => 
                                        { 
                                            removePopUp();

                                            if (button.onPress) 
                                                button.onPress(); 
                                        }
                                    }
                                    style = { styles.button }
                                    key = { index }
                                />
                            )
                        }
                    )
                }

                {
                    (showNeverShowAgainCheckbox && id) && (
                        <CheckBox 
                            text = "Never Show Again"
                            isChecked = { blackList.includes(id) }
                            onPress = { handlePressNeverShowAgain }
                        />
                    )
                }
            </div>
            
        </div>
    );
}

PopUpStandard.propTypes =
{
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.arrayOf(
        PropTypes.shape(
            {
                text: PropTypes.string.isRequired,
                onPress: PropTypes.func
            }
        )
    ),
    removePopUp: PropTypes.func.isRequired,
    dismissable: PropTypes.bool,
    id: PropTypes.string,
    showNeverShowAgainCheckbox: PropTypes.bool
};

PopUpStandard.defaultProps =
{
    title: "",
    message: "",
    dismissable: true,
    showNeverShowAgainCheckbox: false
}

const styles =
{
    container:
    {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center", 
        flex: 1,
        width: "100%",
        height: "100%",
        paddingLeft: utilsGlobalStyles.spacingVertN(-1),
        paddingRight: utilsGlobalStyles.spacingVertN(-1),
    },
    alertBox: 
    {
        flexDirection: "column",
        maxWidth: 550,
        width: window.innerWidth * 0.8,
        rowGap: utilsGlobalStyles.spacingVertN(-1),
        padding: utilsGlobalStyles.fontSizeN(),
        borderRadius: globalProps.borderRadiusStandard
    },
    button:
    {
        paddingTop: utilsGlobalStyles.fontSizeN() / 2,
        paddingBottom: utilsGlobalStyles.fontSizeN() / 2,
        borderRadius: globalProps.borderRadiusStandard
    }
};

function PopUpOk(title, message, onPress, dismissable)
{
    return {
        title: title,
        message: message,
        buttons: [
            { text: "OK", onPress: onPress }
        ],
        dismissable: dismissable
    }
}

export { PopUpStandard as default, PopUpOk, lclStrgKeyPopUpBlackList };