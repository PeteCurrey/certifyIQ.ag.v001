'use client'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, ShieldAlert, KeyRound, Trash2, X, AlertTriangle } from 'lucide-react'
import styles from './users.module.css'

interface User {
  id: string
  created_at: string
  name: string
  email: string
  role: string
  status: string
  last_login_at: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Slide-over states
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Invite form state
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('office')
  const [inviteLoading, setInviteLoading] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [confirmEmailInput, setConfirmEmailInput] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const supabase = createClient()

  async function loadUsers() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/aos/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setUsers(data)
      } else {
        setErrorMsg(data.error || 'Failed to load users.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/aos/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole })
      })
      const data = await response.json()
      if (response.ok) {
        setIsInviteOpen(false)
        setInviteName('')
        setInviteEmail('')
        setInviteRole('office')
        loadUsers()
      } else {
        alert(data.error || 'Failed to send invite.')
      }
    } catch (err) {
      console.error(err)
      alert('Error occurred.')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditRole(user.role)
    setEditStatus(user.status)
    setIsEditOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setEditLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/aos/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id: selectedUser.id, name: editName, role: editRole, status: editStatus })
      })
      const data = await response.json()
      if (response.ok) {
        setIsEditOpen(false)
        loadUsers()
      } else {
        alert(data.error || 'Failed to save changes.')
      }
    } catch (err) {
      console.error(err)
      alert('Error occurred.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleResetPassword = async (user: User) => {
    const confirmReset = window.confirm(`Send password reset link to ${user.email}?`)
    if (!confirmReset) return
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/aos/accept-invite/reset`
      })
      if (error) {
        alert(error.message)
      } else {
        alert('Password reset link has been triggered.')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to send reset request.')
    }
  }

  const handleDeactivateToggle = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const confirmToggle = window.confirm(`Are you sure you want to set status to ${newStatus} for ${user.name}?`)
    if (!confirmToggle) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/aos/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id: user.id, name: user.name, role: user.role, status: newStatus })
      })
      if (response.ok) {
        loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to toggle status.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user)
    setConfirmEmailInput('')
    setIsDeleteOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    if (confirmEmailInput !== userToDelete.email) {
      alert('Email confirmation address does not match.')
      return
    }
    setDeleteLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/aos/users?id=${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setIsDeleteOpen(false)
        setUserToDelete(null)
        loadUsers()
      } else {
        alert(data.error || 'Failed to delete user.')
      }
    } catch (err) {
      console.error(err)
      alert('Error occurred.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}><LoadingSpinner size={40} /></div>
  if (errorMsg) return <div className={styles.error}>{errorMsg}</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Console Access Management</span>
          <h2>AOS User Registry</h2>
        </div>
        <button className={styles.inviteBtn} onClick={() => setIsInviteOpen(true)}>
          <Plus size={16} />
          <span>Invite New User</span>
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isSuper = u.role === 'super_admin'
                return (
                  <tr key={u.id} className={isSuper ? styles.lockedRow : ''}>
                    <td className={styles.userName}>
                      {u.name} {isSuper && <span className={styles.ownerTag}>Owner</span>}
                    </td>
                    <td className={styles.monoCell}>{u.email}</td>
                    <td className={styles.roleCell}>{u.role}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className={styles.monoCell}>
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-GB') : 'Never'}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        {isSuper ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Immutable</span>
                        ) : (
                          <>
                            <button className={styles.rowBtn} onClick={() => handleOpenEdit(u)} title="Edit User">
                              <Edit2 size={14} />
                            </button>
                            <button className={styles.rowBtn} onClick={() => handleDeactivateToggle(u)} title={u.status === 'active' ? 'Deactivate' : 'Activate'}>
                              <ShieldAlert size={14} style={{ color: u.status === 'active' ? '#ff5c5c' : '#aaff6b' }} />
                            </button>
                            <button className={styles.rowBtn} onClick={() => handleResetPassword(u)} title="Reset Password">
                              <KeyRound size={14} />
                            </button>
                            <button className={styles.rowBtn} onClick={() => handleOpenDelete(u)} title="Delete User">
                              <Trash2 size={14} style={{ color: '#ff5c5c' }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Slide-over */}
      {isInviteOpen && (
        <div className={styles.backdrop} onClick={() => setIsInviteOpen(false)}>
          <div className={styles.slideOver} onClick={e => e.stopPropagation()}>
            <div className={styles.slideHeader}>
              <h3>Invite New User</h3>
              <button onClick={() => setIsInviteOpen(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSendInvite} className={styles.slideForm}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" required value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Emma Watson" />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="e.g. emma@avorria.co.uk" />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option value="admin">admin</option>
                  <option value="assessor">assessor</option>
                  <option value="content_editor">content_editor</option>
                  <option value="office">office</option>
                </select>
              </div>
              <p className={styles.formNote}>
                An invitation email will be sent. The user sets their own password via the link. The link expires in 48 hours.
              </p>
              <button type="submit" className={styles.submitBtn} disabled={inviteLoading}>
                {inviteLoading ? 'Sending Invitation...' : 'Send Invite'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Slide-over */}
      {isEditOpen && selectedUser && (
        <div className={styles.backdrop} onClick={() => setIsEditOpen(false)}>
          <div className={styles.slideOver} onClick={e => e.stopPropagation()}>
            <div className={styles.slideHeader}>
              <h3>Edit User</h3>
              <button onClick={() => setIsEditOpen(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className={styles.slideForm}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="text" disabled value={selectedUser.email} style={{ opacity: 0.6 }} />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)}>
                  <option value="admin">admin</option>
                  <option value="assessor">assessor</option>
                  <option value="content_editor">content_editor</option>
                  <option value="office">office</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option value="invited">invited</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={editLoading}>
                {editLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteOpen && userToDelete && (
        <div className={styles.modalBackdrop} onClick={() => setIsDeleteOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff5c5c' }}>
                <AlertTriangle size={20} />
                <h3>Delete User Account?</h3>
              </div>
              <button onClick={() => setIsDeleteOpen(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p>This will permanently delete <strong>{userToDelete.name}</strong> ({userToDelete.email}).</p>
              <p style={{ color: 'var(--text-muted)' }}>
                All content associated with this user will be re-attributed to the Super Admin. This action cannot be undone.
              </p>
              <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                <label>Type <strong>{userToDelete.email}</strong> to confirm:</label>
                <input 
                  type="text" 
                  value={confirmEmailInput} 
                  onChange={e => setConfirmEmailInput(e.target.value)} 
                  placeholder={userToDelete.email} 
                />
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                <button 
                  className={styles.confirmDeleteBtn} 
                  disabled={confirmEmailInput !== userToDelete.email || deleteLoading}
                  onClick={handleDeleteUser}
                >
                  {deleteLoading ? 'Deleting User...' : 'Permanently Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
