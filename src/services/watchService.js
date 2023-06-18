import * as httpRequest from '../utils/httpRequest';

export const watch = async (id_user, id_video) => {
    try {
        const res = await httpRequest.get(`/watch`, {
            params: {
                id_user,
                id_video,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
