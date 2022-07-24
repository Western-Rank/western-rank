// import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router';
import { Autocomplete, TextField } from '@mui/material'
import styles from '../styles/Searchbar.module.scss'

interface SearchbarProps {
  courses: string[]; // list of searchable course names, e.g. CALC 1000: Calculus I
}

const Searchbar = ({ courses }: SearchbarProps) => {
  // used to navigate to new course page when selected in the search menu
  const router = useRouter(); 
  const onCourseSelect = (ev: React.ChangeEvent, value: string) => {
    // extract the course code from the full course name,
    // encoding it as a valid URI string
    // e.g. CALC 1000: Calculus I -> CALC%201000
    const courseCodeURI = encodeURIComponent(value.split(':')[0]);
    router.push(`/course/${courseCodeURI}`);
  }

  return (
    <Autocomplete
      disablePortal
      className={styles.searchbar}
      options={courses}
      renderInput={(params) => <TextField {...params} />}
      onChange={onCourseSelect}
    />
  )
}

export default Searchbar