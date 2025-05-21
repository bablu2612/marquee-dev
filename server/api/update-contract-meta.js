const {
    getIntegrationSdk,
} = require('../api-util/sdk');
const { UUID } = require('sharetribe-flex-integration-sdk').types;

module.exports = async (req, res) => {
    const { txn_id, PaymemtData } = req.body;

    const integrationSdk = getIntegrationSdk();
    let transactionsId = new UUID(txn_id);

    const data = await integrationSdk.transactions.updateMetadata({
        id: transactionsId,
        metadata: {
            ...PaymemtData,
            // entertainerData: entertainerData,
        }
    })



    return res.status(200).send({ status: 'success', data: data })


};
