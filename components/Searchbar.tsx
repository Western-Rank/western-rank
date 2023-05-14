// import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material'
import styles from '../styles/Searchbar.module.scss'
import { useState, useEffect } from 'react';
import { debounce } from '../lib/debounce';
import { useQuery } from '@tanstack/react-query';

const Searchbar = () => {
  const router = useRouter();
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 15
  })

  const { data, isLoading, isError }= useQuery({
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Courses were not found');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    onSuccess(data) {
      data.sort();
    }
  });

  const onCourseSelect = (ev: React.SyntheticEvent, value: unknown) => {
    if (typeof(value) !== 'string' || value === null)
      return;

    // extract the course code from the full course name,
    // encoding it as a valid URI string
    // e.g. CALC 1000: Calculus I -> CALC%201000
    const courseCodeURI = encodeURIComponent(value?.split(':')[0]);
    router.push(`/course/${courseCodeURI}`);
  }

  return (
    <Autocomplete
      className={styles.searchbar}
      options={!isLoading && !isError ? data : []}
      renderInput={(params) => <TextField {...params}/>}
      onChange={onCourseSelect}
      filterOptions={filterOptions}
    />
  )
}

export default Searchbar