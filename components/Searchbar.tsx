// import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router';
import { Autocomplete, TextField } from '@mui/material'
import styles from '../styles/Searchbar.module.scss'
import { useState, useEffect } from 'react';
import { debounce } from '../lib/debounce';
const { Index } = require("flexsearch");

const course_index = Index({
  tokenize: 'full'
});

const Searchbar = () => {
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [allCourses, setAllCourses] = useState<string[]>([]);
  // used to navigate to new course page when selected in the search menu
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data);
        // populate the search index
        data.forEach((course: string, index: number) => {
          course_index.add(index, course);
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  const onCourseSearch = debounce(async (ev: React.SyntheticEvent, value: string | null) => {
    if (value !== null && value.trim().length !== 0) {
      const course_index_results = course_index.search(value, 20);
      const courses = course_index_results.map((index: number) => allCourses[index]);
      setCourseOptions(courses);
    } else {
      setCourseOptions(allCourses.slice(0,20));
    }
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
      freeSolo
      className={styles.searchbar}
      options={courseOptions}
      renderInput={(params) => <TextField {...params}/>}
      onChange={onCourseSelect}
      onInputChange={onCourseSearch}
      filterOptions={(x: any) => x} // override default filtering (we filter with onCourseSearch)
    />
  )
}

export default Searchbar