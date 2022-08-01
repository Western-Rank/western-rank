import { AppBar, Toolbar, Typography, Stack, Box, Container } from '@mui/material';
import Link from 'next/link';
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
  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <Stack direction="row" width="1100px" justifyContent="space-between" margin="auto">
          <Box display="flex" justifyContent="center" flexBasis="10%">
            <Link href="/" >
              <img src="/logo.svg" alt="logo" className={styles.logo} style={{ width: "40px" }}/>
            </Link>
          </Box>
          <Box sx={{ flexBasis: "70%" }}>
            {searchBar && <Searchbar />}
          </Box>
          {!user && <MuiLink href="/api/auth/login" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Log in</MuiLink>}
          {user && (
            <Stack 
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              sx={{ flexBasis: "20%", flexShrink: 0 }}
            >
              <MuiLink href="/profile" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Profile</MuiLink>
              <MuiLink href="/api/auth/logout" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Log out</MuiLink>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar