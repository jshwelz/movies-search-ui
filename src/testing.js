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
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import SearchBar from "material-ui-search-bar";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Movien Lens
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));


export default function Pricing() {
    const classes = useStyles();
    const [data, setData] = useState([])
    const [filterParams, updateFilterParams] = useState([])
    const [keyword, setKeyword] = useState("")
    const [RequestOptions, updateRequest] = useState({
        pagination: { page: 1, limit: 100 },
        sorted: [],
        pages: 0,
        filtered: []
    })

    useEffect(() => {
        axios.get("http://localhost:5000/movies?page=1&limit=100").then(res => {
            setData(res.data.data)
            updateRequest({
                pages: res.data.pageCount,
                loading: false
            });
        });
    }, [])

    const columns = [
        {
            Header: "User ID",
            accessor: "userId",
            style: {
                textAlign: "right"
            },
            width: 100,
            maxWidth: 100,
            minWidth: 100
        },
        {
            Header: "Movie ID",
            accessor: "movieId",
            style: {
                textAlign: "right"
            },
            width: 100,
            maxWidth: 100,
            minWidth: 100
        },
        {
            Header: "Title",
            accessor: "title",
        },
        {
            Header: "Tag",
            accessor: "tag",
        },
        {
            Header: "Rating",
            accessor: "rating",
            filterable: false,
            Cell: props => <div> <Rating name="read-only" value={props.value} readOnly /> </div>
        }
    ];
    const searchKeyword = (value) => {
        updateRequest({
            loading: true
        });
        let params = { "page": 1, "limit": 100, "key": value }
        axios.get("http://localhost:5000/movies", { params: params }).then(res => {
            setData(res.data.data)
            updateRequest({
                pages: res.data.pageCount,
                loading: false
            });
        });
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
                    // onChange={(newValue) => searchKeyword(newValue)}
                    onRequestSearch={(newValue) => searchKeyword(newValue)}
                />
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    <Grid item xs={12}>
                        <ReactTable
                            columns={columns}
                            data={data}
                            pages={RequestOptions.pages}
                            loading={RequestOptions.loading}
                            filterable
                            onPageChange={pageIndex => {
                                updateRequest({
                                    loading: true
                                });
                                let params = { "page": pageIndex + 1, "limit": 100 }
                                axios.get("http://localhost:5000/movies", { params: params }).then(res => {
                                    setData(res.data.data)
                                    updateRequest({
                                        pages: res.data.pageCount,
                                        loading: false
                                    });
                                });
                            }}
                            onPageSizeChange={(pageSize, page) => {
                                updateRequest({
                                    loading: true
                                });
                                let params = { "page": page, "limit": pageSize }
                                axios.get("http://localhost:5000/movies", { params: params }).then(res => {
                                    setData(res.data.data)
                                    updateRequest({
                                        pages: res.data.pageCount,
                                        loading: false
                                    });
                                });
                            }}
                            onFilteredChange={(filtered, column) => {
                                console.log(column.Header);
                                console.log(filtered);
                                // filter=userid,1

                                let params = []
                                let param = {}
                                for (var i = 0; i < filtered.length; i++) {
                                    param.filter = filtered[i].id + ',' + filtered[i].value
                                    // params.push(param)   
                                    updateFilterParams(params)
                                }
                                axios.get("http://localhost:5000/movies?page=1&limit=100", { params: params }).then(res => {
                                    setData(res.data.data)
                                    updateRequest({
                                        pages: res.data.pageCount,
                                        loading: false
                                    });
                                });
                            }}
                            defaultPageSize={100}
                            noDataText={"Loading..."}
                            manual // informs React Table that you'll be handling sorting and pagination server-side
                        />
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