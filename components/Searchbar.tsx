// import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router';
import { Autocomplete, TextField } from '@mui/material'
import styles from '../styles/Searchbar.module.scss'
import React from 'react';
import { debounce } from '../lib/debounce';


const Searchbar = () => {
  const [courseOptions, setCourseOptions] = React.useState<string[]>([]);
  // used to navigate to new course page when selected in the search menu
  const router = useRouter();

  const onCourseSearch = debounce(async (ev: React.SyntheticEvent, value: string | null) => {
    if (value === null)
      return;
    value = value.trim();
    if (value.length === 0)
      return;
    const res = await fetch(`http://localhost:3000/api/courses?${new URLSearchParams({ search: value })}`);
    const courses = await res.json();
    setCourseOptions(courses);
  });

  const onCourseSelect = (ev: React.SyntheticEvent, value: string | null) => {
    if (value === null)
      return;
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
      options={courseOptions}
      renderInput={(params) => <TextField {...params} />}
      onChange={onCourseSelect}
      onInputChange={onCourseSearch}
      filterOptions={(x: any) => x} // override default filtering (we filter with onCourseSearch)
    />
  )
}

export default Searchbar