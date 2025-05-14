const { uploadToS3 } = require("../api-util/awsConfig");

module.exports = async(req, res) => {
try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, buffer, mimetype } = req.file;
        const fileName = Date.now() + '-' + originalname;  // You can create a dynamic filename
        const acl = 'public-read';  // Define access permissions for the file

        // Call the common method to upload the file to S3
        const data = await uploadToS3(buffer, fileName, mimetype, acl);

        // Return the URL of the uploaded file
        const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return res.status(200).json({
            message: 'File uploaded successfully',
            url: fileUrl,
            data: data  // Return additional S3 response data if needed
        });
    } catch (err) {
        console.error('Error during file upload:', err);
        return res.status(500).json({ message: 'Error uploading file' });
    }
};
