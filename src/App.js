// DataTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';


// const handleOpenEditDialog = (id) => {
//   setEditNurseId(id);
//   setOpenEditDialog(true);
//   const selectedNurse = rows.find((nurse) => nurse._id === id);
//   setFormData(selectedNurse);
// };
// const columns = [
//   { field: '_id', headerName: 'ID', width: 200 },
//   { field: 'name', headerName: 'Name', width: 150 },
//   { field: 'licenseNumber', headerName: 'License Number', width: 200 },
//   { field: 'dob', headerName: 'DOB', width: 150 },
//   { field: 'age', headerName: 'Age', width: 100 },
//   {
//     field: 'edit',
//     headerName: 'Edit',
//     width: 100,
//     renderCell: (params) => (
//       <Button
//         variant="outlined"
//         onClick={() => handleOpenEditDialog(params.row._id)}
//       >
//         Edit
//       </Button>
//     ),
//   },
// ];

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editNurseId, setEditNurseId] = useState(null);
  const [formData, setFormData] = useState({ name: '', licenseNumber: '', dob: '', age: '' });

  const handleOpenEditDialog = (id) => {
  setEditNurseId(id);
  setOpenEditDialog(true);
  const selectedNurse = rows.find((nurse) => nurse._id === id);
  setFormData(selectedNurse);
};
  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'licenseNumber', headerName: 'License Number', width: 200 },
    { field: 'dob', headerName: 'DOB', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpenEditDialog(params.row._id)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleDeleteNurse(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];
  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/nurses');
      const nursesWithId = response.data.map((nurse) => ({ ...nurse, id: nurse._id }));
      setRows(nursesWithId);
    } catch (error) {
      console.error('Error fetching nurses:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({ name: '', licenseNumber: '', dob: '', age: '' });
  };



  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditNurseId(null);
    setFormData({ name: '', licenseNumber: '', dob: '', age: '' });
  };

  const handleAddNurse = async () => {
    try {
      await axios.post('http://localhost:5000/api/nurses', formData);
      fetchNurses();
      handleCloseAddDialog();
      alert('Nurse added successfully!');
    } catch (error) {
      console.error('Error adding nurse:', error);
      alert('Error adding nurse. Please try again.');
    }
  };

  const handleEditNurse = async () => {
    try {
      await axios.put(`http://localhost:5000/api/nurses/${editNurseId}`, formData);
      fetchNurses();
      handleCloseEditDialog();
      alert('Nurse updated successfully!');
    } catch (error) {
      console.error('Error updating nurse:', error);
      alert('Error updating nurse. Please try again.');
    }
  };

  const handleDeleteNurse = async (editNurseId) => {
    try {
      if (editNurseId) {
        await axios.delete(`http://localhost:5000/api/nurses/${editNurseId}`);
        fetchNurses();
        alert('Nurse deleted successfully!');
      } else {
        alert('Please select a nurse to delete.');
      }
    } catch (error) {
      console.error('Error deleting nurse:', error);
      alert('Error deleting nurse. Please try again.');
    }
  };

  const handleDownloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nurses');
    XLSX.writeFile(workbook, 'nurses.xlsx');
  };

  const handleDownloadCSV = () => {
    return rows.map((nurse) => ({
      ID: nurse.id,
      Name: nurse.name,
      'License Number': nurse.licenseNumber,
      DOB: nurse.dob,
      Age: nurse.age,
    }));
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button variant="outlined" onClick={handleOpenAddDialog}>
        Add Nurse
      </Button>
      <Button variant="outlined" onClick={handleDownloadXLSX}>
        Download XLSX
      </Button>
      <CSVLink data={handleDownloadCSV()} filename="nurses.csv">
        <Button variant="outlined">Download CSV</Button>
      </CSVLink>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection);
          const selectedNurseId = newSelection.length > 0 ? newSelection[0] : null;
          setEditNurseId(selectedNurseId);
        }}
      />


      {/* Add Nurse Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Nurse</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          />
          <TextField
            label="DOB"
            name="dob"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <TextField
            label="Age"
            name="age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddNurse}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Nurse Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Nurse</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          />
          <TextField
            label="DOB"
            name="dob"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <TextField
            label="Age"
            name="age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditNurse}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTable;
