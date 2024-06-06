import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function DataTable({
  columns,
  rows,
  onFilterModelChange,
  onRowSelectionModelChange,
  initialState,

  onRowClick,
}) {
  return (
    <div className="w-[100%] ">
      <DataGrid
        rows={rows}
        columns={columns}
        selection
        autoHeight={true}
        onRowClick={onRowClick}
        onFilterModelChange={onFilterModelChange}
        onRowSelectionModelChange={onRowSelectionModelChange}
        // slots={{
        //   toolbar: GridToolbar,
        // }}

        initialState={{
          ...initialState,
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 15, 100]}
      />
    </div>
  );
}
