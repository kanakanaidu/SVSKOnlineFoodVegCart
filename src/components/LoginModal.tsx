import React, { useState } from 'react';
import Modal from 'react-modal';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from '../../firebase.config';

interface LoginModalProps {
    loginType: string;
    isOpen: boolean;
    onRequestClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onRequestClose, loginType }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);

    const handleGmailLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            alert("Logged in successfully with Google!");
            onRequestClose();
        } catch (error) {
            console.error("Error logging in with Google", error);
        }
    };

    const handleEmailPasswordLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in successfully with email and password!");
            onRequestClose();
        } catch (error) {
            console.error("Error logging in with email and password", error);
        }
    };

    //   const setupRecaptcha = () => {
    //     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    //   };

    //   const handlePhoneNumberLogin = async () => {
    //     setupRecaptcha();
    //     const appVerifier = window.recaptchaVerifier;
    //     try {
    //       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    //       window.confirmationResult = confirmationResult;
    //       setIsOtpSent(true);
    //       alert("OTP sent to your phone number!");
    //     } catch (error) {
    //       console.error("Error sending OTP", error);
    //     }
    //   };

    //   const handleOtpVerification = async () => {
    //     const confirmationResult = window.confirmationResult;
    //     try {
    //       await confirmationResult.confirm(otp);
    //       alert("Logged in successfully with phone number!");
    //       onRequestClose();
    //     } catch (error) {
    //       console.error("Error verifying OTP", error);
    //     }
    //   };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
            <div className="max-w-md mx-auto mt-10 p-5 border border-gray-200 rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>

                {loginType == "user" && (
                    <button onClick={handleGmailLogin} className="w-full bg-red-500 text-white p-2 rounded-md mb-4">
                        Login with Gmail
                    </button>)}
                {(loginType == "retailer" || loginType == "delivery") && (
                <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                    >
                        Login with Email
                    </button>
                </form>
                )}

                {/* <div className="mt-6">
                    <div id="recaptcha-container"></div>
                    {!isOtpSent ? (
                        <>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={handlePhoneNumberLogin}
                                className="w-full bg-green-500 text-white p-2 rounded-md mt-2"
                            >
                                Send OTP
                            </button>
                        </>
                    ) : (
                        <>
                            <label className="block text-sm font-medium text-gray-700">OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={handleOtpVerification}
                                className="w-full bg-green-500 text-white p-2 rounded-md mt-2"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </div> */}
            </div>
        </Modal>
    );
};

export default LoginModal;