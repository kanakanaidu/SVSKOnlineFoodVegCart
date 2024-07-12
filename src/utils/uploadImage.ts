import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dtjcdk72h/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'online_store';
//CLOUDINARY_URL=cloudinary://967755467196267:1Y3KwPxWXo7w2CN-8DgtjogcqDU@dtjcdk72h
const uploadImage = async (base64Image: string) => {
    const imageFile = base64ToFile(base64Image, 'invoiceorder.png');
    let imageUrl = "no file recieved";
    if (imageFile) {
        try {
            imageUrl = await uploadImageToCloudinary(imageFile);
            console.log('Image uploaded successfully:', imageUrl);
            alert('Screenshot sent via WhatsApp!');
        } catch (error) {
            console.error('Failed to upload image or send WhatsApp message', error);
            alert('Failed to send screenshot via WhatsApp.');
        }
    } else {
        alert('Failed to convert screenshot to file.');
    }
    return imageUrl;
}

const base64ToFile = (base64: string, filename: string): File | null => {
    try {
        const arr = base64.split(',');
        if (arr.length !== 2) {
            throw new Error('Invalid base64 format');
        }

        const mime = arr[0].match(/:(.*?);/)?.[1];
        if (!mime) {
            throw new Error('Invalid MIME type');
        }

        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    } catch (error) {
        console.error('Error converting base64 to file', error);
        return null;
    }
};

const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

export default uploadImage;
