const baseUrl = 'https://apiproxy.telphin.ru/';

interface authorizeProps{
    login: string,
    password: string
}

const backendService = {
    authorize: async ({login, password}: authorizeProps) => {
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
        if(result.message)
            throw result.message;
        else
            return result;
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken') || '';
        const res = await fetch(baseUrl + 'oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'grant_type': 'refresh_token',
                'client_id': 'f8115578ec7246369ab37f73adb10c62',
                'client_secret': '1e1c99cc6ba94893a7616e2ececaaf28',
                'refresh_token': refreshToken,
                'redirect_uri': ''
            })
        });
        const result = await res.json();
        if(result.error){
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('authToken');
            throw result.error;
        }      
        else
            localStorage.setItem('authToken', result.access_token);
    },

    getClientId: async () => {
        const authToken = localStorage.getItem('authToken');
        const res = await fetch(baseUrl + 'api/ver1.0/user/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken,
            },
        });
        const result = await res.json();
        if(result.message === 'Unauthorized'){
            try{
                await backendService.refreshToken();
                return backendService.getClientId();
            }
            catch(e: any){
                throw e;
            }
        } else if(result.message){
            throw result.message;
        } else
            return result.client_id;
    },

    getExtensions: async (clientId: string, page: number, perPage: number) => {
        const authToken = localStorage.getItem('authToken');
        const res = await fetch(baseUrl + `api/ver1.0/client/${clientId}/extension/?` + new URLSearchParams({
            page: page + '',
            per_page: perPage + '',
        }), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken,
            },
        });
        const result = await res.json();
        if(result.message === 'Unauthorized'){
            try{
                await backendService.refreshToken();
                return backendService.getExtensions(clientId, page, perPage);
            }
            catch(e: any){
                throw e;
            }
        }
        else if(result.message){
            throw result.message;
        } else
            return result;
    },
    getExtensionInfo: async (clientId: string, extensionId: string = '') => {
        const authToken = localStorage.getItem('authToken');
        const res = await fetch(baseUrl + `api/ver1.0/client/${clientId}/extension/${extensionId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken,
            },
        });
        const result = await res.json();
        if(result.message === 'Unauthorized'){
            try{
                await backendService.refreshToken();
                return backendService.getExtensionInfo(clientId, extensionId);
            }
            catch(e: any){
                throw e;
            }
        }
        else if(result.message){
            throw result.message;
        } else
            return result;
    },
    updateExtension: async (clientId: string, extensionId: string, body: any) => {
        const authToken = localStorage.getItem('authToken');
        Object.keys(body).forEach(k => body[k] = body[k] === '' ? null : body[k])
        const res = await fetch(baseUrl + `api/ver1.0/client/${clientId}/extension/${extensionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const result = await res.json();
        if(result.message === 'Unauthorized'){
            try{
                await backendService.refreshToken();
                return backendService.updateExtension(clientId, extensionId, body);
            }
            catch(e: any){
                throw e;
            }
        }
        else if(result.message){
            throw result.message;
        } else
            return result;
    }
};

export default backendService;