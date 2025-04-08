const { containerClient } = require("../configs/azureConfig");

const uploadFileToBlob = async (file) =>{
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);
    return blockBlobClient.url;
}

module.exports = {uploadFileToBlob};