import { createContext } from "react";

// The context that handles the user's game preference (i.e. number of rows/cols, the blocks, and the username).
const PreferenceContext = createContext();

export default PreferenceContext;