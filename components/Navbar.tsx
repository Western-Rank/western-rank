import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import styles from "../styles/Navbar.module.scss"
import Searchbar from "./Searchbar"

type NavbarProps = {
  searchBar?: boolean
}

const Navbar = ({ searchBar }: NavbarProps) => {
  const { data } = useSession()

  const router = useRouter()

  return (
    <AppBar component="nav" position="static">
      <Toolbar>
        <Stack
          direction="row"
          width="1100px"
          justifyContent="space-between"
          margin="auto"
        >
          <Box display="flex" justifyContent="center" flexBasis="10%">
            <Button onClick={() => router.push("/")}>
              <Image
                src="/logo.svg"
                alt="logo"
                className={styles.logo}
                width={40}
                height={40}
              />
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
            {data?.user ? (
              <>
                <Button href="/profile" color="secondary">
                  Profile
                </Button>
                <Button
                  color="secondary"
                  href="/api/auth/signout"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {/* TODO change to onclick with signout() */}
                  Log out
                </Button>
              </>
            ) : (
              <Button href="/api/auth/signin" color="secondary">
                {/* TODO change to onclick with signin() */}
                Log in
              </Button>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
