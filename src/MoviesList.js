import React, { Component, useState, useEffect } from "react";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import SearchBar from "material-ui-search-bar";
import useStyles from "./useStyles"
import MoviesTable from "./MoviesTable"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Josh
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function MoviesList() {
  const classes = useStyles();
  const [movies_data, setMovies] = useState([])
  const [filterParams, updateFilterParams] = useState([])
  const [keyword, setKeyword] = useState("")
  const [isGroup, updateGroup] = useState(false)
  const [RequestOptions, updateRequest] = useState({
    pagination: { page: 1, limit: 100 },
    pages: 0,
    filtered: []
  })

  useEffect(() => {
    generalSearch()
  }, [])

  const generalSearch = () => {
    let params = { "page": 1, "limit": 50 }
    axios.get("http://localhost:5000/movies", { params: params }).then(res => {
      console.log('I should be here onlyce once');
      console.log(res.data)
      setMovies(res.data);
    });
  }

  const searchKeyword = (value) => {
    updateRequest({
      loading: true
    });
    setKeyword(value)
    let params = { "page": 1, "limit": 50, "key": value }
    axios.get("http://localhost:5000/movies", { params: params }).then(res => {
      setMovies(res.data.data);
      updateGroup(true)
    });
  }

  const onFilterChange = (data, type) => {    
    if (type == "titles") {
      let newArr = [...movies_data];
      newArr[0] = { "titles": data }
      console.log(newArr)
      setMovies(newArr)
    } else if (type == "genres") {
      let newArr = [...movies_data];
      newArr[1] = { "genres": data }
      console.log(newArr)
      setMovies(newArr)
    } else if (type == "tags") {
      let newArr = [...movies_data];
      newArr[2] = { "tags": data }
      console.log(newArr)
      setMovies(newArr)
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Movie Lens Search
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Search a Movie
        </Typography>
        <SearchBar
          value={keyword}
          onRequestSearch={(newValue) => searchKeyword(newValue)}
          onCancelSearch={() => generalSearch()}
        />
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={12}>
            {isGroup ? (
              <Grid item xs={12}>
                <Typography variant="h5" color="inherit" noWrap >
                  Titles
              </Typography>
                <MoviesTable data={movies_data[0].titles} onFilterChangeCallBack={onFilterChange} type={"titles"} />
                <Typography variant="h5" color="inherit" noWrap >
                  Genres
              </Typography>
                <MoviesTable data={movies_data[1].genres} onFilterChangeCallBack={onFilterChange} type={"genres"} />
                <Typography variant="h5" color="inherit" noWrap >
                  Tags
                </Typography>
                <MoviesTable data={movies_data[2].tags} onFilterChangeCallBack={onFilterChange} type={"tags"} />
              </Grid>
            ) : (
                <MoviesTable data={movies_data} onFilterChangeCallBack={onFilterChange} />
              )}
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Container maxWidth="md" component="footer" className={classes.footer}>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

export default MoviesList;
