import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import styles from '../styles/Navbar.module.scss';
import Searchbar from './Searchbar';

type NavbarProps = {
    shadow?: boolean,
    searchBar?: boolean
}

const Navbar = ( {shadow, searchBar}: NavbarProps ) => {
    return (
        <AppBar component="nav" position="static">
            <Container maxWidth="lg" sx={{ padding: "6px" }}>
                <Toolbar sx={{ display: "flex", justifyContent: 'space-between' }}>
                    <Link href="/" >
                        <img src="/logo.svg" alt="logo" className={styles.logo}/>
                    </Link>
                    {searchBar && <Searchbar />}
                    <MuiLink href="/" color="secondary" underline="none" fontWeight={'fontWeightBold'}>Log in</MuiLink>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar