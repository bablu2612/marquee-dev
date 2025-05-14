const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// AWS Configuration from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;
const Bucket = process.env.AWS_BUCKET;

// Initialize the S3 Client (v3)
const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

/**
 * Common method to upload a file to S3
 * @param {Buffer} fileBuffer - The file buffer (content of the file)
 * @param {string} fileName - The desired file name in S3 (can be dynamic)
 * @param {string} contentType - The MIME type of the file
 * @param {string} acl - The ACL permission (e.g., public-read)
 * @returns {Promise<Object>} - The response from S3 containing file details
 */
const uploadToS3 = async (fileBuffer, fileName, contentType, acl = 'public-read') => {
    try {
        const command = new PutObjectCommand({
            Bucket,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType,  // Automatically set based on file type
            // ACL: acl,                  // Set file access permissions
            // ACL: 'public-read'
        });

        const data = await s3Client.send(command);
        return data;  // Returns S3 response (e.g., file URL, metadata, etc.)
    } catch (err) {
        console.error('Error uploading to S3:', err);
        throw new Error('Error uploading file to S3');
    }
};

module.exports = { uploadToS3 };
