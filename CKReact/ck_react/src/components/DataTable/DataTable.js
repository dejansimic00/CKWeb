import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function DataTable({
  columns,
  rows,
  onFilterModelChange,
  onRowSelectionModelChange,
}) {
  return (
    <div className="w-[100%] ">
      <DataGrid
        rows={rows}
        columns={columns}
        selection
        autoHeight={true}
        onFilterModelChange={onFilterModelChange}
        onRowSelectionModelChange={onRowSelectionModelChange}
        // slots={{
        //   toolbar: GridToolbar,
        // }}

        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 15, 100]}
      />
    </div>
  );
}
