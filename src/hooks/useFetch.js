import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue, ){

    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState()
    const [fetchedData, setFetchedData] = useState(initialValue)
      useEffect(() => {
        async function getUserPlaces() {
          setIsFetching(true);
          try {
            const userPlaces = await fetchFn();
            setFetchedData(userPlaces);
          } catch (err) {
            setError({ message: err.message || 'Failed to Fetch Places...' });
          }
          setIsFetching(false);
        }
        getUserPlaces();
      }, [fetchFn]);

      return {
        isFetching,
        fetchedData,
        error,
        setFetchedData
      }
}