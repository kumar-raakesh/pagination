// import React, { useState, useRef, useCallback } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import useBookSearch from "./useBookSearch"
// function App() {
//   const [query, setQuery] = useState('')
//   const [pageNumber, setPageNumber] = useState(1)
//   const {
//     loading,
//     error,
//     books,
//     hashMore
//   } = useBookSearch(query, pageNumber)
//   debugger
//   const observer = useRef()

//   const lastBookElementRef = useCallback(node => {
//     if (loading) return
//     if (observer.current) observer.current.disconnect()
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hashMore) {
//         console.log("visible")
//         setPageNumber(prevPageNumber => prevPageNumber + 1)
//       }

//     })
//     if (node) observer.current.observe(node)
//   }, [loading, hashMore])

//   function handleSearch(e) {
//     setQuery(e.target.value)
//     setPageNumber(1)
//   }

//   return (
//     <>
//       <input type="text" value={query} onChange={handleSearch}></input>
//       {books && books.map((book, index) => {
//         if (books.length === index + 1) {
//           return <div key={index} ref={lastBookElementRef}>{book} </div>
//         } else {
//           return <div key={index}>{book} </div>
//         }

//       })}
//       <div>{loading && 'Loading....'}</div>
//       <div>{error && 'Error....'}</div>

//     </>
//   );
// }

// export default App;




// Using package

import React from "react";
import axios from 'axios';

import InfiniteScroll from "react-infinite-scroll-component";

const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasMore: true,
      itemsArray: [],
      pageNumber: 1
    }
    this.apiCall = this.apiCall.bind(this)

  }


  fetchMoreData = () => {
    console.log("Reach end")
    // if (this.state.items.length >= 500) {
    //   this.setState({ hasMore: false });
    //   return;
    // }
    // // a fake async api call like which sends
    // // 20 more records in .5 secs
    // setTimeout(() => {
    //   this.setState({
    //     items: this.state.items.concat(Array.from({ length: 20 }))
    //   });
    // }, 500);
    this.setState({
      pageNumber: this.state.pageNumber + 1,
      // hasMore: false
    })
    this.apiCall()
  };

  componentDidMount() {
    this.apiCall()
  }

  apiCall() {
    axios({
      method: "GET",
      url: 'https://openlibrary.org/search.json',
      params: { q: 'test', page: this.state.pageNumber },
      cancelToken: axios.cancelToken
    }).then(res => {
      this.setState({
        itemsArray: [...this.state.itemsArray, ...res.data.docs.map(b => b.title)]
      })
      console.log("data", res.data)
    })
  }

  render() {
    console.log("itemsArray", this.state.itemsArray)
    return (
      <div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
        <InfiniteScroll
          dataLength={this.state.itemsArray.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >

          {this.state.itemsArray && this.state.itemsArray.map((item, index) => (
            <div style={style} key={index}>
              {item}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}

export default App;
