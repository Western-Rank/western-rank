// import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, TextField } from '@mui/material'
import styles from '../styles/Searchbar.module.scss'

interface SearchbarProps {
  courses: string[]; // list of searchable course names, e.g. CALC 1000: Calculus I
}

const Searchbar = ({ courses }: SearchbarProps) => {
  
  return (
    <Autocomplete
      disablePortal
      className={styles.searchbar}
      options={courses}
      renderInput={(params) => <TextField {...params} />}
    />
  )
}

export default Searchbar