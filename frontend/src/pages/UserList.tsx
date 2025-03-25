import React, { useEffect } from 'react';
import { Button, Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../Store/store';
import { fetchUsers } from '../Slice/userSlice';
import { RootState } from '../Store/store'; // Assurez-vous que RootState est bien exporté de ton store
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users); // Accéder aux utilisateurs dans le store
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUsers()); // Charger les utilisateurs au chargement du composant
  }, [dispatch]);

  const handleRegisterUserClick = () => {
    // Rediriger vers la page d'inscription
    navigate('/add-user');
  };

  // Vérifier si users est un tableau avant d'utiliser map
  const userList = Array.isArray(users) ? users : [];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Liste des Utilisateurs</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <List>
        {userList.map((user) => (
          <ListItem key={user._id}>
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleRegisterUserClick}
      >
        Ajouter un Utilisateur
      </Button>
    </Container>
  );
};

export default UserList;