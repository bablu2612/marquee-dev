import { creatContractApi } from "../../../util/api";

export const createContractDetails = (data) => (dispatch) => {
    return creatContractApi(data).then((responce) => {
        return responce;
    }).catch((err) => {
        console.log(err);
    })
}
