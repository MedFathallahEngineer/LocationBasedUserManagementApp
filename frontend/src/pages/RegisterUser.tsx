import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Store/store';
import { addUser } from '../Slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, TextField, Container, Typography, Alert } from '@mui/material';


L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component for picking a location
const MapPicker = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const RegisterUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await dispatch(addUser(formData)).unwrap();
      setSuccess(true);
      setFormData({ name: '', email: '', latitude: 0, longitude: 0 });
      navigate('/');
    } catch (err: any) {
      setError(err || 'Error while adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Inscription Utilisateur</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Utilisateur ajouté avec succès !</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nom"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          margin="normal"
          required
        />

        <div style={{ height: '400px', width: '100%', margin: '20px 0' }}>
          <MapContainer center={[51.505, -0.09]} zoom={3} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapPicker
              onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
            />
            {formData.latitude !== 0 && formData.longitude !== 0 && (
              <Marker position={[formData.latitude, formData.longitude]} />
            )}
          </MapContainer>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Enregistrement...' : 'S\'inscrire'}
        </Button>
      </form>
    </Container>
  );
};

export default RegisterUser;
