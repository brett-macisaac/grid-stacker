import axios from "axios";

const gTesting = false;

const gBaseURL = gTesting ? "http://localhost:5000/api/v1/" : "https://grid-stacker-api.azurewebsites.net/api/v1/";

class ApiRequestor
{
    static sAxiosGS = axios.create(
        {
            baseURL: `${gBaseURL}grid_stacker`,
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 1000,
            validateStatus: () => true
        }
    );

    static sAxiosUser = axios.create(
        {
            baseURL: `${gBaseURL}user`,
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 1000,
            validateStatus: () => true
        }
    );

    static sAuthToken = undefined;

    static setAuthToken(pToken)
    {
        ApiRequestor.sAuthToken = pToken;
        //ApiRequestor.sAxiosGS.defaults.headers.common['Authorization'] = `Bearer ${pToken}`;
    }

    static async getMetaStats()
    {
        try
        {
            const lResponse = await ApiRequestor.sAxiosGS.get(`/metaStats`);

            //console.log(lResponse);

            return lResponse.data;
        }
        catch(e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    static async getGameStats(pGame)
    {
        try
        {
            const lResponse = await ApiRequestor.sAxiosGS.get("/getGameStats", { params: pGame });

            return lResponse.data
        }
        catch(e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    static async updateStats(pGameData)
    {
        try
        {
            const lResponse = await ApiRequestor.sAxiosGS.put(
                `/private/updateStats`,
                pGameData,
                {
                    headers:
                    {
                        authorization: `Bearer ${ApiRequestor.sAuthToken}`
                    }
                }
            );

            return lResponse.data;
        }
        catch(e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    static async signUp(pUsername, pPassword)
    {
        try
        {
            const lDetails = { username: pUsername, password: pPassword };
            const lResponse = await ApiRequestor.sAxiosUser.post(
                "/signup",
                lDetails
            );

            console.log(lResponse);

            return lResponse.data;
        }
        catch (e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

    static async signIn(pUsername, pPassword)
    {
        try
        {
            const lDetails = { username: pUsername, password: pPassword };
            const lResponse = await ApiRequestor.sAxiosUser.post(
                "/login",
                lDetails
            );

            console.log(lResponse);

            return lResponse.data;
        }
        catch (e)
        {
            //console.log(e.stack);
            return undefined;
        }
    }

};

export default ApiRequestor;