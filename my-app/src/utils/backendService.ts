const baseUrl = 'https://apiproxy.telphin.ru/';

interface authorizeProps{
    login: string,
    password: string
}

const backendService = {
    authorize: async ({login, password}: authorizeProps) => {
        try{
            const res = await fetch(baseUrl + 'oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'grant_type': 'password',
                    'client_id': 'f8115578ec7246369ab37f73adb10c62',
                    'client_secret': '1e1c99cc6ba94893a7616e2ececaaf28',
                    'username': login,
                    'password': password,
                })
            });
            const result = await res.json();
            return result;
        } catch(e){
            console.error(e);
        }
    },

    getClientId: async () => {
        const authToken = localStorage.getItem('authToken');
        try{
            const res = await fetch(baseUrl + 'api/ver1.0/user/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
            });
            const result = await res.json();
            console.log(result);
            return result.client_id;
        } catch(e){
            console.error(e);
        }
    },

    getExtension: async (clientId: string, extensionId: string = '') => {
        const authToken = localStorage.getItem('authToken');
        try{
            const res = await fetch(baseUrl + `api/ver1.0/client/${clientId}/extension/${extensionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
            });
            const result = await res.json();
            console.log(result);
            return result;
        } catch(e){
            console.error(e);
        }
    },
    updateExtension: async (clientId: string, extensionId: string, body: any) => {
        const authToken = localStorage.getItem('authToken');
        try{
            const res = await fetch(baseUrl + `api/ver1.0/client/${clientId}/extension/${extensionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const result = await res.json();
            console.log(result);
            return result;
        } catch(e){
            console.error(e);
        }
    }
};

export default backendService;