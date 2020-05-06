import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hashMore, setHashMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: "GET",
      url: 'https://openlibrary.org/search.json',
      params: { q: 'test', page: pageNumber },
      cancelToken: axios.cancelToken
    }).then(res => {
      setBooks(prevBooks => {
        return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
      })
      setHashMore(res.data.docs.length > 0)
      setLoading(false)
      // console.log("data", res.data)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    // return () => cancel()
  }, [query, pageNumber])
  return { loading, error, books, hashMore }
}