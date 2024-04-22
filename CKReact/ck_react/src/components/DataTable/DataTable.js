import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function DataTable({
  columns,
  rows,
  onFilterModelChange,
  onRowSelectionModelChange,
}) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        selection
        onFilterModelChange={onFilterModelChange}
        onRowSelectionModelChange={onRowSelectionModelChange}
        // slots={{
        //   toolbar: GridToolbar,
        // }}
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
