import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Bolt } from 'lucide-react';

type WeatherState = {
  temp: number;
  condition: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  location: string;
};

const weatherCodeMap: Record<number, { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  0: { label: 'Céu limpo', icon: Sun },
  1: { label: 'Principalmente ensolarado', icon: Sun },
  2: { label: 'Parcialmente nublado', icon: Cloud },
  3: { label: 'Nublado', icon: Cloud },
  45: { label: 'Neblina', icon: CloudRain },
  48: { label: 'Neblina gelada', icon: CloudRain },
  51: { label: 'Garoa leve', icon: CloudRain },
  53: { label: 'Garoa moderada', icon: CloudRain },
  55: { label: 'Garoa densa', icon: CloudRain },
  56: { label: 'Garoa congelante', icon: CloudRain },
  57: { label: 'Garoa congelante densa', icon: CloudRain },
  61: { label: 'Chuva leve', icon: CloudRain },
  63: { label: 'Chuva moderada', icon: CloudRain },
  65: { label: 'Chuva forte', icon: CloudRain },
  66: { label: 'Chuva congelante leve', icon: CloudRain },
  67: { label: 'Chuva congelante forte', icon: CloudRain },
  71: { label: 'Neve leve', icon: Bolt },
  73: { label: 'Neve moderada', icon: Bolt },
  75: { label: 'Neve forte', icon: Bolt },
  77: { label: 'Granizo', icon: Bolt },
  80: { label: 'Chuva de intensidade', icon: CloudRain },
  81: { label: 'Chuva intensa', icon: CloudRain },
  82: { label: 'Chuva muito intensa', icon: CloudRain },
  85: { label: 'Neve leve', icon: Bolt },
  86: { label: 'Neve forte', icon: Bolt },
  95: { label: 'Tempestade leve', icon: Bolt },
  96: { label: 'Tempestade com granizo', icon: Bolt },
  99: { label: 'Tempestade intensa com granizo', icon: Bolt }
};

const defaultLocation = { lat: -23.5505, lon: -46.6333, name: 'São Paulo, BR' };

const getCityNameFromCoords = async (lat:number, lon:number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    if (!response.ok) return 'Sua localização';
    const data = await response.json();
    const address = data.address || {};
    return (
      (address.city || address.town || address.village || address.county || 'Sua localização') +
      (address.state ? `, ${address.state}` : '')
    );
  } catch {
    return 'Sua localização';
  }
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState('');
  const [citySearchLoading, setCitySearchLoading] = useState(false);

  const getWeather = async (lat: number, lon: number, locationName: string) => {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
      if (!response.ok) throw new Error('Falha na API de clima');

      const data = await response.json();
      const current = data.current_weather;
      if (!current) throw new Error('Dados de clima não disponíveis');

      const weatherCode = current.weathercode as number;
      const weatherInfo = weatherCodeMap[weatherCode] || { label: 'Clima desconhecido', icon: Cloud };

      setWeather({
        temp: Math.round(current.temperature),
        condition: weatherInfo.label,
        icon: weatherInfo.icon,
        location: locationName
      });
    } catch {
      setError('Erro ao buscar clima. Mostrando valores padrão.');
      setWeather({
        temp: 24,
        condition: 'Parcialmente nublado',
        icon: Cloud,
        location: locationName
      });
    } finally {
      setLoading(false);
    }
  };

  const getCoordsFromCity = async (city: string) => {
    setCitySearchLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`
      );
      if (!response.ok) throw new Error('Erro ao obter coordenadas');
      const data = await response.json();
      if (!data || data.length === 0) throw new Error('Cidade não encontrada');

      const place = data[0];
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);
      const name = place.display_name ? `${place.display_name}` : city;
      await getWeather(lat, lon, name);
    } catch {
      setError('Não foi possível localizar cidade. Verifique o texto digitado.');
    } finally {
      setCitySearchLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      getWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.name);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationName = await getCityNameFromCoords(position.coords.latitude, position.coords.longitude);
        getWeather(position.coords.latitude, position.coords.longitude, locationName);
      },
      () => {
        getWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.name);
      },
      { timeout: 8000 }
    );
  }, []);

  const Icon = weather?.icon || Sun;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Clima</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">Atual</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Digite sua cidade (ex: Rio de Janeiro)"
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="button"
          onClick={() => getCoordsFromCity(cityInput)}
          disabled={!cityInput.trim() || citySearchLoading}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg transition-all"
        >
          {citySearchLoading ? 'Buscando...' : 'Usar cidade'}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Carregando...</p>
      ) : (
        <>
          {error && <p className="text-xs text-red-600 dark:text-red-300">{error}</p>}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon className="text-blue-600 dark:text-blue-300" size={32} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{weather?.temp ?? '--'}°C</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{weather?.condition ?? '---'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{weather?.location ?? '---'}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
