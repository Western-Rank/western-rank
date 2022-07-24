import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import styles from '../styles/Navbar.module.scss';
import Searchbar from './Searchbar';
import { useUser } from '@auth0/nextjs-auth0';

type NavbarProps = {
    shadow?: boolean,
    courses?: string[], // if passed, include a searchbar to search for these courses
}

const Navbar = ({ shadow, courses }: NavbarProps) => {
  const { user } = useUser();
  return (
    <AppBar component="nav" position="static">
      <Container maxWidth="lg" sx={{ padding: "6px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: 'space-between' }}>
          <Link href="/" >
            <img src="/logo.svg" alt="logo" className={styles.logo} />
          </Link>
          {courses && <Searchbar courses={courses} />}
          {!user && <MuiLink href="/api/auth/login" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Log in</MuiLink>}
          {user && (
            <div>
              <MuiLink href="/profile" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Profile</MuiLink>
              <MuiLink href="/api/auth/logout" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Log out</MuiLink>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar