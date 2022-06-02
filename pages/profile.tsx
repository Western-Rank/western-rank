import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return (
  <div>
      <h1>You must be logged in to view your profile.</h1>
  </div>
  );

  return (
    user && (
      <div>
        <a href="../">Back</a>
        <h1>PROFILE</h1>
        <img src={user.picture ?? ""} alt={user.name ?? ""} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}