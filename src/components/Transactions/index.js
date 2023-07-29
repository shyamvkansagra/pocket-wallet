import React, { useCallback, useEffect, useState } from 'react';
import AppWrapper from '../AppWrapper/AppWrapper';
import axios from 'axios';
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
  Tooltip
 } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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

function EnhancedTableHead(props) {
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
function EnhancedTableToolbar(props) {
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
        <Tooltip title="Filter list">
          <IconButton>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>
  );
}

const Transactions = ({ walletId }) => {
  const rowsPerPage = 10;
	const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(rows.length);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    if (newPage > page && rows.length < rowCount) {
      fetchData(newPage*10, 10);
    }
    setPage(newPage);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [rows, order, orderBy, page, rowsPerPage],
  );
  
  const fetchData = useCallback((skip, limit) => {
    axios
        .get(`/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`)
        .then(response => {
          const { data } = response;
          setRows([...rows, ...data[0].totalData]);
          setRowCount(data[0].totalCount[0].count);
        });
  }, [rows, walletId]);

  useEffect(() => {
    if (!rows.length && walletId) {
      fetchData(0, 10);
    }
  }, [rows, fetchData, walletId, rowCount]);
	if (!walletId) {
		return (
			<AppWrapper walletId={walletId}>
				<div className="transactions-container">
					No wallet is set. Please setup your wallet first.
				</div>	
			</AppWrapper>
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
			</div>
		</AppWrapper>
	);
}

export default Transactions;