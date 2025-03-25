import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../Store/store';
import { fetchUsers } from '../Slice/userSlice';
import { RootState } from '../Store/store';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users); // Access the users state
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([36, 10]); // Default map center coordinates

  // Fetch users when the component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Update map center when users change and there is a valid location
  useEffect(() => {
    if (users && users.length > 0 && users[0].latitude && users[0].longitude) {
      setMapCenter([users[0].latitude, users[0].longitude]);
    }
  }, [users]);
  
  const handleRegisterUserClick = () => {
    // Redirect to Add User Page
    navigate('/add-user');
  };


  const userList = Array.isArray(users) ? users : [];

  const isValidLocation = (user: any): boolean => {
    return typeof user.latitude === 'number' && typeof user.longitude === 'number'
      && !isNaN(user.latitude) && !isNaN(user.longitude);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column: User List & Button */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Liste des Utilisateurs
          </Typography>

          {error && (
            <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* User List */}
          <Box sx={{ flexGrow: 1, maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
            {userList.map((user) => (
              <Card key={user._id} sx={{ mb: 2, p: 1, boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Add User Button */}
          <Box mt={3} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" size="large" onClick={handleRegisterUserClick}>
              Ajouter un Utilisateur
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Map */}
        <Grid item xs={12} md={7}>
          <Box sx={{ width: '100%', height: 550, borderRadius: 2, overflow: 'hidden' }}>
            {userList.some(isValidLocation) ? (  //Conditionally render the map
              <MapContainer
                center={mapCenter}
                zoom={6}
                style={{ width: '100%', height: '100%', borderRadius: '12px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {userList.filter(isValidLocation).map((user) => (
                  <Marker key={user._id} position={[user.latitude, user.longitude] as LatLngExpression}>
                    <Popup>
                      <strong>{user.name}</strong>
                      <br />
                      {user.email}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <Typography textAlign="center">No user locations to display.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserList;
