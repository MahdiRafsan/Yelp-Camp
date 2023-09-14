import { Pagination, Paper } from "@mui/material";
const CustomPagination = ({ count, page = 1, onPageChange }) => {
  return (
    <Paper sx={{ p: "8px" }}>
      <Pagination
        count={count}
        page={page}
        onChange={onPageChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Paper>
  );
};

export default CustomPagination;
