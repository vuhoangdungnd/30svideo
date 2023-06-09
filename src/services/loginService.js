import * as httpRequest from '../utils/httpRequest';

export const login = async (userData) => {
    try {
        const res = await httpRequest.post(`/auth/login`, userData);
        return res;
    } catch (error) {
        console.log(error);
    }
};
