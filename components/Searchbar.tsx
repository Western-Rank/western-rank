// import SearchIcon from '@mui/icons-material/Search'
import { TextField } from '@mui/material'
import styles from '../styles/Searchbar.module.scss'

const Searchbar = ( {} ) => {
  return (
    <TextField className={styles.searchbar} variant='outlined' placeholder='Search for courses' />
  )
}

export default Searchbar