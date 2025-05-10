const URL = `${process.env.API_URL}challenger`

export class ChallengerService {
    constructor (request){
        this.request = request;
    }

    async post () {
        const response = await this.request.post(URL);
        return response;
    }

    async getChallengerGuid(guid) {
        const response = await this.request.get(`${URL}/${guid}`,{
            headers: {
                "x-challenger": guid,
              },
        });
        return response;
    }

    async putChallengerGuid(body, guid) {
        const response = await this.request.put(`${URL}//${guid}`,{
            headers: {
                "x-challenger": guid,
            },
            data: body
        });
        return response;
    }

    async getDatabaseGuid(guid) {
        const response = await this.request.get(`${URL}/database/${guid}`,{
            headers: {
                "x-challenger": guid,
              },
        });
        return response;
    }

    async putDatabaseGuid(body, guid) {
        const response = await this.request.put(`${URL}/database/${guid}`,{
            headers: {
                "x-challenger": guid,
            },
            data: body
        });
        return response;
    }
}
