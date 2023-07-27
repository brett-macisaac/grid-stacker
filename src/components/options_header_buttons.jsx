//import { Ionicons } from '@expo/vector-icons';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import Settings from '@mui/icons-material/Settings';

/*
* These are the button components available to be placed in the Header component.
*/
const optionsHeaderButtons = 
{
    
    back:
    {
        icon: (size, colour) =>
        {
            return (
                <ArrowBackIosNew 
                    sx = { { color: colour, fontSize: size } }
                />
            )
        },
        onPress: (navigate) =>
        {
            navigate(-1);
        }
    },

    settings:
    {
        icon: (size, colour) =>
        {
            return (
                <Settings 
                    sx = { { color: colour, fontSize: size } }
                />
            )
        },
        onPress: (navigate) =>
        {
            navigate("/settings");
        }
    },

    

};

export default optionsHeaderButtons;