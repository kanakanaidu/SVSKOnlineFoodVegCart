import axios from 'axios';
// import { fetchConfig } from './firebaseFunctions';

const sendWhatsApp = async (phoneNumber: any, message: any, imageData?: string) => {
    try {
        let phone: string = '';
        if(phoneNumber.startsWith('+91')){
            phone = phoneNumber;
        } else{
            const last10Numbers = phoneNumber.slice(-10);
            phone = '+91'+ last10Numbers;
        }
        // const base64Image = imageData.split(',')[1]; // Get base64 image data
        const apiEndpoint = 'http://ec2-35-154-252-61.ap-south-1.compute.amazonaws.com:3001'; // Replace with your API endpoint
        // const apiEndpoint = await fetchConfig();
        // console.log(`endpoint: ${process.env.REACT_APP_API_ENDPOINT}`);

        const response = await axios.post(apiEndpoint+'/send-whatsapp', {
            to: phone,
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
