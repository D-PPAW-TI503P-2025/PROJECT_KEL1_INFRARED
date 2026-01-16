import { useEffect } from 'react';
import {
    loadChartData,
    loadUsers,
    checkAuth,
    getUserRole,
    showAddUserModal,
    handleAddUser,
    handleLogout
} from '../lib/app';

export default function Dashboard() {
    useEffect(() => {
        checkAuth();

        void loadChartData(); // ← FIX

        if (getUserRole() === 'admin') {
            const adminSection = document.getElementById('adminSection');
            if (adminSection) adminSection.classList.remove('hidden');
            void loadUsers(); // ← FIX
        }

        const addForm = document.getElementById('addUserForm') as HTMLFormElement | null;
        const submit = (e: Event) => void handleAddUser(e);
        if (addForm) addForm.addEventListener('submit', submit);

        const interval = setInterval(() => {
            void loadChartData(); // ← FIX
        }, 5000);

        return () => {
            if (addForm) addForm.removeEventListener('submit', submit);
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <header>
                <nav>
                    <div className="logo">IoT Monitor</div>
                    <div className="nav-links">
                        <button className="btn" onClick={() => toggleFullscreen()} style={{ marginRight: '1rem', padding: '.5rem' }}>⛶ Fullscreen</button>
                        <span id="userGreeting" style={{ marginRight: '1rem', color: '#ccc' }}></span>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}>
                            Logout
                        </a>
                    </div>
                </nav>
            </header>

            <main className="dashboard-container">
                <div className="card">
                    <h2>Busy Hour Analysis</h2>
                    <div className="chart-container">
                        <canvas id="busyHourChart"></canvas>
                    </div>
                    <button className="btn" onClick={() => loadChartData()} style={{ marginTop: '1rem' }}>Refresh Data</button>
                </div>

                <div id="adminSection" className="card hidden">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>User Management</h2>
                        <button className="btn" onClick={() => showAddUserModal()}>Add User</button>
                    </div>
                    <div className="table-container">
                        <table id="usersTable">
                            <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Created At</th><th>Actions</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </main>

            <div id="addUserModal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}>
                <div style={{ background: 'white', margin: '10% auto', padding: '2rem', width: 300, borderRadius: 8 }}>
                    <h3>Add New User</h3>
                    <form id="addUserForm">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" id="newUserName" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" id="newUserEmail" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" id="newUserPassword" required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select id="newUserRole" style={{ width: '100%', padding: '.5rem', border: '1px solid #d1d5db' }}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn">Create</button>
                        <button type="button" className="btn btn-danger" onClick={() => {
                            const modal = document.getElementById('addUserModal');
                            if (modal) modal.style.display = 'none';
                        }}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// small helper used in Dashboard markup
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        void document.exitFullscreen();
    }
}
