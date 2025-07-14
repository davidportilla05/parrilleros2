import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, CheckCircle } from 'lucide-react';
import { locations } from '../data/locations';
import { Location } from '../types';
import TourButton from '../components/TourButton';
import { useDriverTour } from '../hooks/useDriverTour';

interface LocationSelectionPageProps {
  onLocationSelected: (location: Location) => void;
  onBack: () => void;
}

const locationSelectionTourSteps = [
  {
    element: '[data-tour="location-grid"]',
    popover: {
      title: '📍 Selecciona tu Sede',
      description: 'Elige la sede más cercana a tu ubicación para un mejor servicio de domicilio.',
      side: 'bottom'
    }
  },
  {
    element: '[data-tour="continue-button"]',
    popover: {
      title: '✅ Continuar',
      description: 'Una vez seleccionada tu sede, usa este botón para continuar con el formulario.',
      side: 'top'
    }
  }
];

const LocationSelectionPage: React.FC<LocationSelectionPageProps> = ({ 
  onLocationSelected, 
  onBack 
}) => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showTourButton, setShowTourButton] = useState(true);

  const { startTour } = useDriverTour({
    steps: locationSelectionTourSteps,
    onDestroyed: () => {
      setShowTourButton(false);
      setTimeout(() => {
        setShowTourButton(true);
      }, 30000);
    }
  });

  // Auto-start tour for first-time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('parrilleros-location-tour-seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        startTour();
        localStorage.setItem('parrilleros-location-tour-seen', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // Auto-continue after selection
    setTimeout(() => {
      onLocationSelected(location);
    }, 500);
  };

  const handleStartTour = () => {
    startTour();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={onBack}
              className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <MapPin size={28} className="mr-2 text-[#FF8C00]" />
                Selecciona tu Sede
              </h1>
              <p className="text-gray-600">Elige la sede más cercana a tu ubicación para un mejor servicio</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>🛵 Tiempo de entrega:</strong> 45-60 minutos aproximadamente<br/>
              <strong>📍 Cobertura:</strong> Cada sede tiene zonas específicas de entrega
            </p>
          </div>
        </div>

        {/* Location Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <Truck size={24} className="mr-2 text-[#FF8C00]" />
            Nuestras Sedes Disponibles
          </h2>
          
          <div className="grid grid-cols-1 gap-6" data-tour="location-grid">
            {locations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg transform hover:scale-[1.02] ${
                  selectedLocation?.id === location.id
                    ? 'border-[#FF8C00] bg-orange-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="font-bold text-xl text-gray-800 mr-3 font-heavyrust-primary">
                        {location.name}
                      </h3>
                      {selectedLocation?.id === location.id && (
                        <div className="flex items-center bg-[#FF8C00] text-white px-3 py-1 rounded-full text-sm font-medium">
                          <CheckCircle size={16} className="mr-1" />
                          Seleccionada
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-3 text-[#FF8C00] flex-shrink-0" />
                        <span className="text-base">{location.address}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-3 text-[#FF8C00] flex-shrink-0">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-base">{location.phone}</span>
                      </div>
                      
                      <div className="flex items-start text-gray-600">
                        <Truck size={18} className="mr-3 text-[#FF8C00] flex-shrink-0 mt-0.5" />
                        <div className="text-base">
                          <span className="font-medium text-gray-700">Zonas de entrega:</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {location.deliveryZones.map((zone, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  selectedLocation?.id === location.id
                                    ? 'bg-[#FF8C00] text-white'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {zone}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedLocation?.id === location.id && (
                    <div className="ml-6">
                      <div className="w-8 h-8 bg-[#FF8C00] rounded-full flex items-center justify-center">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center" data-tour="continue-button">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-blue-100 rounded-full p-3 mr-3">
              <span className="text-2xl">👆</span>
            </div>
            <h3 className="text-lg font-bold text-blue-800">¡Selecciona tu sede preferida!</h3>
          </div>
          <p className="text-blue-700">
            Haz clic en cualquiera de las sedes de arriba para continuar automáticamente
          </p>
        </div>

        {/* Tour Button - Pequeño en esquina inferior izquierda */}
        {showTourButton && (
          <TourButton 
            onStartTour={handleStartTour}
            variant="floating"
            size="sm"
            className="bottom-6 left-6"
          />
        )}
      </div>
    </div>
  );
};

export default LocationSelectionPage;