import Menu from "./menu/Menu";
import Settings from "./settings/Settings";
import SettingsThemes from "./settings_theme/SettingsTheme";
import About from "./about/About";
import Controls from "./controls/Controls";
import GameParams from "./game_params/GameParams";
import Username from "./username/Username";
import Game from "./game/Game";

const pages = 
{
    root: Menu,
    settings: Settings,
    settingsThemes: SettingsThemes,
    about: About,
    controls: Controls,
    gameParams: GameParams,
    username: Username,
    game: Game
};

export default pages;