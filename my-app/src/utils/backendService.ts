const baseUrl = 'https://apiproxy.telphin.ru/';

interface authorizeProps{
    login: string,
    password: string
}

interface headers{
    [key: string]: string;
}

enum Methods{
    POST="POST", 
    GET='GET', 
    PUT='PUT'
}

const fetchWrapper = async (url: string, callback: () => Promise<any>, method: Methods, body?: any, additionalHeaders?: headers) => {
    const authToken = localStorage.getItem('authToken');
    const params = {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-type': 'application/json',
            ...additionalHeaders
        },
    };
    if(body) params['body'] = body;
    const res = await fetch(baseUrl + url, params);
    const result = await res.json();

    if(result.message === 'Unauthorized'){
        try{
            await backendService.refreshToken();
            return callback();
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
        try{
            const res = await fetchWrapper('api/ver1.0/user/', backendService.getClientId, Methods.GET);
            return res.client_id;
        } catch(e){
            throw e;
        }
    },

    getExtensions: async (clientId: string, page: number, perPage: number) => {
        try{
            return await fetchWrapper(`api/ver1.0/client/${clientId}/extension/?` + new URLSearchParams({
                page: page + '',
                per_page: perPage + '',
            }), () => backendService.getExtensions(clientId, page, perPage), Methods.GET);
        } catch(e){
            throw e;
        }
    },
    getExtensionInfo: async (clientId: string, extensionId: string = '') => {
        try{
            return await fetchWrapper(`api/ver1.0/client/${clientId}/extension/${extensionId}`, () => backendService.getExtensionInfo(clientId, extensionId), Methods.GET);
        } catch(e){
            throw e;
        }
    },
    updateExtension: async (clientId: string, extensionId: string, body: any) => {
        // const authToken = localStorage.getItem('authToken');
        Object.keys(body).forEach(k => body[k] = body[k] === '' ? null : body[k]);
        try{
            return await fetchWrapper(`api/ver1.0/client/${clientId}/extension/${extensionId}`, () => backendService.updateExtension(clientId, extensionId, body), Methods.PUT, JSON.stringify(body));
        } catch(e){
            throw e;
        }
    }
};

export default backendService;