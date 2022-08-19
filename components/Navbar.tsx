import { AppBar, Toolbar, Typography, Stack, Box, Container, IconButton, Button } from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MuiLink from '@mui/material/Link';
import styles from '../styles/Navbar.module.scss';
import Searchbar from './Searchbar';
import { useUser } from '@auth0/nextjs-auth0';

type NavbarProps = {
    shadow?: boolean,
    searchBar?: boolean,
}

const Navbar = ({ shadow, searchBar }: NavbarProps) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <Stack direction="row" width="1100px" justifyContent="space-between" margin="auto">
          <Box display="flex" justifyContent="center" flexBasis="10%">
            <Button onClick={() => router.push('/')}>
              <img src="/logo.svg" alt="logo" className={styles.logo} style={{ width: "40px" }}/>
            </Button>
          </Box>
          <Box mb={-16} sx={{ flexBasis: "75%" }}>
            {searchBar && <Searchbar />}
          </Box>
          <Stack 
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            sx={{ flexBasis: "15%", flexShrink: 0 }}
          >
            {user
              ? <>
                <Button href="/profile" color="secondary">Profile</Button>
                <Button href="/api/auth/logout" color="secondary" sx={{ whiteSpace: 'nowrap' }} >Log out</Button>
              </>
              : <Button href="/api/auth/login" color="secondary">Log in</Button>
            }
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar