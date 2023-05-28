import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material"
import { useSession } from "next-auth/react"
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
                style={{ width: "40px" }}
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
                  href="/api/auth/logout"
                  color="secondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button href="/api/auth/login" color="secondary">
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
