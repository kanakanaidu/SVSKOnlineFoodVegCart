import React from 'react';
import { useNavigate } from 'react-router-dom';
// import '../admin/AdminPage.css'

const AdminPage: React.FC = () => {
  const history = useNavigate();

  const navigateAddNewItem = () => {
    history('/addItem');
  };

  const navigateListItems = () => {
    history('/itemlist');
  };

  const navigateToRetailer = () => {
    history('/adminOrders');
  };

  const navigateToAssignment = () => {
    history('/orderProcess');
  };

  const navigateToRetailerRegister = () => {
    history('/retailerRegister');
  };

  const navigateToDeliveryBoyRegister = () => {
    history('/deliveryBoyRegistration');
  };

  const navigateToAdminApproval = () => {
    history('/adminApprovalPage');
  };
  
  const navigateToAdminRetailernDelivery = () => {
    history('/AdminForm');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-emerald-600	text-4xl font-bold mb-8">Admin Page</h1>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
      <button className="bg-amber-200 text-white py-2 px-4 rounded hover:bg-amber-400" onClick={navigateAddNewItem}>
          Add New Items
        </button>
        <button className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-700" onClick={navigateListItems}>
          Manage Items
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700" onClick={navigateToRetailer}>
          Go to Orders Page
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={navigateToAssignment}>
          Go to Assignment Page
        </button>
        <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-700" onClick={navigateToRetailerRegister}>
          Retailer Registration Page
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700" onClick={navigateToDeliveryBoyRegister}>
          Delivery Boy Registration Page
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" onClick={navigateToAdminApproval}>
          Admin Approval Page
        </button>
        <button className="bg-lime-500 text-white py-2 px-4 rounded hover:bg-lime-700" onClick={navigateToAdminRetailernDelivery}>
          Manage Retailers and Delivery Boys
        </button>
      </div>
    </div>
  );
};

export default AdminPage;