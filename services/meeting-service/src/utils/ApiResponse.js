

class ApiResonse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.success = true;
        this.message = message;
        this.data = data;
    }
};

export default ApiResonse;