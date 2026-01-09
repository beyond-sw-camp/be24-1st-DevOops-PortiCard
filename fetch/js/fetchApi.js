const defaultFetch = fetchBack({
    baseUrl: 'http://10.10.10.20:8080/',
    headers: {
        'Content-Type': 'application/json',
    },
    interceptors: {
        request: async (args) => {
            // 요청을 가로채서 어떠한 로직을 실행할 수 있다.
                
            return args;
        },
        response: async (response, requestArgs) => {
            // 응답을 가로채서 어떠한 로직을 실행할 수 있다.
 
            return response;
        },
    },
});