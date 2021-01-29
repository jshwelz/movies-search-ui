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
import qs from 'qs';
import _, { debounce } from 'lodash';

function MoviesTable(props) {
    const classes = useStyles();
    const [data, setData] = useState({})
    const [filterParams, updateFilterParams] = useState([])
    const [keyword, setKeyword] = useState("")
    const [type, setType] = useState("")
    const [RequestOptions, updateRequest] = useState({
        pagination: { page: 1, limit: 50 },
        filtered: [],
    })

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
            Cell: props =>
                <div>
                    {props.value > 0 ? (
                        <div> <Rating name="read-only" value={props.value} readOnly /> </div>
                    ) : (
                            <div> Unrated</div>
                        )}
                </div>
        }
    ];

    const fetchApi = (params) =>{
        axios.get("http://localhost:5000/movies", {
            params: params,
            paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }).then(res => {
            props.onFilterChangeCallBack(res.data,props.type);
        });
    }

    const filtering = (filtered) => {
        const filter_params = filtered.map((item) => ([`${item.id},${item.value}`]));
        let params = { "page": RequestOptions.pagination.page, "limit": RequestOptions.pagination.limit, filter: filter_params }
        fetchApi(params)
    }

    const fetchDataDebounced = debounce(filtering, 1500);

    return (
        <React.Fragment>
            <ReactTable
                columns={columns}
                data={props.data.data}
                pages={props.data.pageCount}
                loading={RequestOptions.loading}
                filterable
                onPageChange={pageIndex => {
                    updateRequest({
                        loading: true,
                        pagination: { page: pageIndex + 1, limit: 50 }
                    });
                    let params = { "page": pageIndex + 1, "limit": 100 }
                    axios.get("http://localhost:5000/movies", { params: params }).then(res => {
                        props.onFilterChangeCallBack(res.data);
                        console.log(res.data)
                        updateRequest({
                            pagination: { page: pageIndex + 1, limit: res.data.count },                           
                            loading: false
                        });
                    });
                }}
                onPageSizeChange={(pageSize, page) => {
                    // updateRequest({
                    //     loading: true
                    // });
                    // let params = { "page": page, "limit": pageSize }
                    // axios.get("http://localhost:5000/movies", { params: params }).then(res => {
                    //     // console.log(res.data.data)
                    //     setData(res.data.data)
                    //     updateRequest({
                    //         pages: res.data.pageCount,
                    //         loading: false

                    //     });
                    // });
                }}
                onFilteredChange={fetchDataDebounced}                
                pageSize={props.data.count < props.data.total ? (props.data.count) : (props.data.total)}
                defaultPageSize={props.data.count < props.data.total ? (props.data.count) : (props.data.total)}
                noDataText={"Loading..."}
                manual
            />
        </React.Fragment>
    );
}

export default MoviesTable;
