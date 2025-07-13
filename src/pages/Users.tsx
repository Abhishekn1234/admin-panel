import React, { useEffect, useState } from 'react';
import API from '../services/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Modal, Button, Form,Breadcrumb  } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';
import'./user.css';
export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err: any) {
      toast.error('Failed to fetch users');
    }
  };

  const handleView = (user: any) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this user?')) {
      try {
        await API.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (err: any) {
        toast.error('Delete failed');
      }
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser({ ...user });
    setProfileImage(null);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editingUser.name);
      formData.append('email', editingUser.email);
      formData.append('status', editingUser.status);
      formData.append('role', editingUser.role);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await API.put(`/users/${editingUser._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('User updated successfully');
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const downloadExcel = () => {
    const exportData = users.map(({ name, email, status, role, lastLogin }: any) => ({
      name,
      email,
      status,
      role,
      lastLogin: lastLogin ? new Date(lastLogin).toLocaleString() : 'N/A',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const file = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(file, 'users.xlsx');
    toast.success('Excel file downloaded');
  };

  const logout = async () => {
  try {
    await API.post('/logout'); // protected route
  } catch (err) {
    console.error('Logout tracking failed', err);
  } finally {
    localStorage.clear();
    toast.success('Logged out');
    window.location.href = '/login';
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px' }}>
      <div className="container bg-white p-4 rounded shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
  <div>
    <h2 className="mb-1">User List</h2>

 <Breadcrumb className="breadcrumb-no-underline" style={{ fontSize: '14px' }}>
  <Breadcrumb.Item href="#">Authentication</Breadcrumb.Item>
  <Breadcrumb.Item href="#">Pages</Breadcrumb.Item>
  <Breadcrumb.Item active>User List</Breadcrumb.Item>
</Breadcrumb>


  </div>

  <div>
    <button className="btn btn-outline-success me-2" onClick={downloadExcel}>
      <i className="bi bi-download"></i> Export
    </button>
    <button className="btn btn-outline-dark" onClick={logout}>
      <i className="bi bi-box-arrow-right"></i> Logout
    </button>
  </div>
</div>


        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>User</th>
             
              <th>Role</th>
              
              <th>Last Online</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
     <tbody>
          {users.map((u: any) => (
            <tr key={u._id}>
              <td className="d-flex align-items-center">
                {u.profileImage ? (
                  <img
                    src={u.profileImage}
                    alt="profile"
                    width="40"
                    height="40"
                    className="rounded-circle me-2"
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#dbeafe',
                      color: '#2563eb',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      userSelect: 'none',
                    }}
                  >
                    {u.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="d-flex flex-column">
                  <strong>{u.name}</strong>
                  <small className="text-muted">{u.email}</small>
                </div>
              </td>
              <td>
                <span className={`badge bg-${u.role === 'admin' ? 'primary' : 'info'}`}>{u.role}</span>
              </td>
              
                            <td>
                {u.lastLogin
                    ? new Date(u.lastLogin).toLocaleDateString('en-GB') // Format: dd/mm/yyyy
                    : '—'}
                </td>

              <td>
                <span className={`badge bg-${u.status === 'active' ? 'primary' : 'secondary'}`}>{u.status}</span>
              </td>
              <td className="text-center">
                <button className="btn btn-sm btn-outline-info me-2" title="View" onClick={() => handleView(u)}>
                  <i className="bi bi-eye"></i>
                </button>
                <button className="btn btn-sm btn-outline-primary me-2" title="Edit" onClick={() => handleEdit(u)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDelete(u._id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        </table>

        {/* View Modal */}
    <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>View User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {viewingUser ? (
      <div className="text-center">
        {/* Profile Image or Initials */}
        {viewingUser.profileImage ? (
          <img
            src={viewingUser.profileImage}
            alt="Profile"
            className="rounded-circle mb-3"
            width="100"
            height="100"
          />
        ) : (
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              fontSize: '32px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}
          >
            {viewingUser.name?.charAt(0)}
          </div>
        )}

        {/* User Details */}
        <p><strong>Name:</strong> {viewingUser.name}</p>
        <p><strong>Email:</strong> {viewingUser.email}</p>
        <p><strong>Status:</strong> {viewingUser.status}</p>
        <p><strong>Role:</strong> {viewingUser.role}</p>
        <p><strong>Last Login:</strong> {viewingUser.lastLogin ? new Date(viewingUser.lastLogin).toLocaleString() : 'Never'}</p>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>


        {/* Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUser?.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editingUser?.status || 'active'}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={editingUser?.role || 'user'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Profile Image</Form.Label>
               <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    setProfileImage(file || null);
                }}
                />

              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
