import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable({ columns, rows, onSelectionModelChange }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        selection
        onRowSelectionModelChange={onSelectionModelChange}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}
