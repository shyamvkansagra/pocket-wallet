import React, { useCallback, useEffect, useState, useRef } from 'react';
import AppWrapper from '../AppWrapper/AppWrapper';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import "./transactions.css";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
 } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { visuallyHidden } from '@mui/utils';

const headCells = [
  {
    id: 'createdDate',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'transactionId',
    numeric: false,
    disablePadding: false,
    label: 'Transaction ID',
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Amount',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'balance',
    numeric: true,
    disablePadding: false,
    label: 'Balance',
  }
];

const Transactions = ({ walletId, endpoint }) => {
  const rowsPerPage = 10;
	const [order, setOrder] = React.useState('');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(rows.length);
  const [csvData, setCsvData] = useState([]);
  const [noData, setNoData] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const csvLinkEl = useRef(null);
  useEffect(() => {
    if (csvData.length > 0) {
      csvLinkEl.current.link.click();
    }
  }, [csvData])
  function EnhancedTableToolbar() {
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Transactions
        </Typography>
          <span disabled={!rows.length}>
            <Tooltip title="Download CSV">
              <IconButton onClick={fetchRawData}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </span>
          <CSVLink
            headers={[
              { label: "Date", key: "createdDate" },
              { label: "Description", key: "description" },
              { label: "Transaction ID", key: "transactionId" },
              { label: "Amount", key: "amount" },
              { label: "Type", key: "type" },
              { label: "Balance", key: "balance" }
            ]}
            filename="Pocket_Wallet_Statement.csv"
            data={csvData}
            ref={csvLinkEl}
          />
      </Toolbar>
    );
  }
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortOrder = isAsc ? -1 : 1;
    fetchData(0, 10, property, sortOrder);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    if (newPage > page && rows.length < rowCount) {
      fetchData(newPage*10, 10, orderBy, order === "asc" ? 1 : -1);
    }
    setPage(newPage);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [rows, page, rowsPerPage],
  );
  
  const fetchData = useCallback((skip, limit, sortBy, sortOrder) => {
    setShowLoading(true);
    axios
        .get(`${endpoint}/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}${sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ""}`)
        .then(response => {
          const { data } = response;
          if (skip === 0) {
            setRows(data[0]?.totalData);
          } else {
            setRows([...rows, ...data[0]?.totalData]);
          }
          setRowCount(data[0]?.totalCount[0]?.count || 0);
          setNoData(false);
          setShowLoading(false);
        })
        .catch(err => console.error(err.message));
  }, [rows, walletId, endpoint]);

  useEffect(() => {
    if (!rows.length && walletId && noData) {
      fetchData(0, 10);
    }
  }, [noData, rows, fetchData, walletId, rowCount]);

	if (!walletId) {
		return (
			<AppWrapper walletId={walletId}>
				<div className="transactions-container">
					No wallet is set. Please setup your wallet first. <Link className='unstyled-link' to="/"><Typography variant='h6'>Go to Home Page</Typography></Link>
				</div>	
			</AppWrapper>
		);
	}

  const fetchRawData = () => {
    setShowLoading(true);
    axios
      .get(`${endpoint}/transactions?walletId=${walletId}`)
      .then(res => {
        setCsvData(res.data);
        setShowLoading(false);
      })
  };

  const EnhancedTableHead = props => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {(headCell.id === "createdDate" || headCell.id === "amount") ?
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              : headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

	return (
		<AppWrapper walletId={walletId}>
			<div className="transactions-container">
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.transactionId}
                      >
                        <TableCell padding="checkbox">
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {new Date(row.createdDate).toLocaleDateString("en-UK")}
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.transactionId}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>{row.type.toUpperCase()}</TableCell>
                        <TableCell>{row.balance}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10]}
              component="div"
              count={rowCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </Paper>
        </Box>
        {showLoading && 
          <CircularProgress sx={{ margin: "0 auto", position: "absolute" }}/>
        }
			</div>
		</AppWrapper>
	);
}

export default Transactions;