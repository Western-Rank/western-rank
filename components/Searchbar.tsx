import { Autocomplete, TextField, createFilterOptions } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { FullCourseName } from "../lib/courses"
import styles from "../styles/Searchbar.module.scss"

const Searchbar = () => {
  const router = useRouter()
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 15,
  })

  const { data, isLoading, isError } = useQuery(["courseNames"], {
    queryFn: async () => {
      const response = await fetch("/api/courses?format=names")
      if (!response.ok) throw new Error("Courses were not found")

      return response.json() as Promise<FullCourseName[]>
    },
    refetchOnWindowFocus: false,
    onSuccess(data) {
      data.sort()
    },
  })

  const onCourseSelect = (e: React.SyntheticEvent, value: unknown) => {
    if (typeof value !== "string" || value === null) return

    // e.g. CALC 1000: Calculus I -> CALC%201000
    const courseCodeURI = encodeURIComponent(value.split(":")[0])

    router.push(`/course/${courseCodeURI}`)
  }

  return (
    <Autocomplete
      className={styles.searchbar}
      options={!isLoading && !isError ? data : []}
      renderInput={(params) => <TextField {...params} />}
      onChange={onCourseSelect}
      filterOptions={filterOptions}
    />
  )
}

export default Searchbar
