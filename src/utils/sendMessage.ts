import axios from 'axios';

const sendWhatsApp = async (phoneNumber: any, message: any, imageData: string) => {
    try {
        // const base64Image = imageData.split(',')[1]; // Get base64 image data
        const apiEndpoint = 'http://localhost:3001/send-whatsapp'; // Replace with your API endpoint

        const response = await axios.post(apiEndpoint, {
            to: phoneNumber,
            message: message,
            // media: base64Image
            media: imageData
        });

        if (response.data.success) {
            console.log('Message sent successfully:', response.data.messageSid);
        } else {
            console.error('Error sending message:', response.data.error);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export default sendWhatsApp;
