import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';

// Pages
import WelcomePage from './pages/WelcomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CustomizationPage from './pages/CustomizationPage';
import SuggestionsPage from './pages/SuggestionsPage';
import OrderTypePage from './pages/OrderTypePage';
import DeliveryForm from './components/DeliveryForm';
import PickupFormPage from './pages/PickupFormPage';
import TicketPage from './pages/TicketPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/customize" element={<CustomizationPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-type" element={<OrderTypePage />} />
          <Route path="/delivery-form" element={<DeliveryForm onBack={() => {}} />} />
          <Route path="/pickup-form" element={<PickupFormPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  );
}

export default App;