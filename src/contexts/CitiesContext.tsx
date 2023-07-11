import { createContext, useContext, useEffect, useState } from 'react';

interface ICity {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id?: number;
}

interface CitiesContextType {
  cities: ICity[];
  isLoading: boolean;
  currentCity: ICity;
  getCity: (id: number) => void;
  deleteCity: (id: number) => void;
  addCity: (city: ICity) => void;
}

const CitiesContext = createContext<CitiesContextType>({
  isLoading: false,
  cities: [],
  currentCity: {} as ICity,
  getCity: () => null,
  addCity: () => null,
  deleteCity: () => null,
});

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<ICity>(Object);
  const [error, setError] = useState('');

  useEffect(function () {
    async function getCities() {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:8000/cities');
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert('Something gone wrong');
      } finally {
        setIsLoading(false);
      }
    }

    getCities();
  }, []);

  async function getCity(id: number) {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      alert('Something gone wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function addCity(city: ICity) {
    try {
      setIsLoading(true);

      const res = await fetch('http://localhost:8000/cities/', {
        method: 'POST',
        body: JSON.stringify(city),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id: number) {
    try {
      setIsLoading(true);
      await fetch(`http://localhost:8000/cities/${id}/`, {
        method: 'DELETE',
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error('useCities must be used within a CitiesProvider');
  }
  return context;
}

export { CitiesProvider, CitiesContext, useCities };
