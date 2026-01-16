// src/lib/app.ts
import Chart from 'chart.js/auto';

const API_URL = 'http://localhost:3000/api';

export function getToken() {
    return localStorage.getItem('token');
}
export function getUserRole() {
    return localStorage.getItem('role');
}
export function checkAuth(redirect = true) {
    const token = getToken();
    if (!token && redirect) {
        window.location.href = '/login';
        return false;
    }
    const name = localStorage.getItem('name');
    const el = document.getElementById('userGreeting');
    if (el && name) el.textContent = `Hello, ${name}`;
    return !!token;
}

export function handleLogout() {
    localStorage.clear();
    window.location.href = '/login';
}

export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Auth
export async function handleLogin(e: Event | React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('name', data.name);
            window.location.href = '/dashboard';
        } else {
            alert(data.error);
        }
    } catch (err: any) {
        alert('Login failed: ' + err.message);
    }
}

export async function handleRegister(e: Event | React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#name') as HTMLInputElement).value;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;
    const role = (form.querySelector('#role') as HTMLSelectElement).value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Registration successful! Please login.');
            window.location.href = '/login';
        } else {
            alert(data.error);
        }
    } catch (err: any) {
        alert('Registration failed: ' + err.message);
    }
}

// Chart
let busyHourChart: Chart | null = null;

export async function loadChartData() {
    try {
        const res = await fetch(`${API_URL}/analytics/busy-hours`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await res.json();

        if (res.ok) {
            const canvas = document.getElementById('busyHourChart') as HTMLCanvasElement | null;
            if (!canvas) return;
            const ctx = canvas.getContext('2d')!;
            const hours = data.map((d: any) => d.hour + ':00');
            const counts = data.map((d: any) => d.count);

            if (busyHourChart) busyHourChart.destroy();

            busyHourChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'Detected Objects (Busy Hours)',
                        data: counts,
                        // keep colors close to original
                        backgroundColor: 'rgba(37, 99, 235, 0.6)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 as any }
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Error loading chart:', err);
    }
}

// Users (Admin)
export async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        const users = await res.json();

        if (res.ok) {
            const tbody = document.querySelector('#usersTable tbody') as HTMLTableSectionElement | null;
            if (!tbody) return;
            tbody.innerHTML = '';
            users.forEach((user: any) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td><span style="background: ${user.role === 'admin' ? '#fee2e2' : '#dbeafe'}; padding: 2px 6px; borderRadius: 4px;">${user.role}</span></td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-danger" data-id="${user.id}" style="padding: 2px 6px; font-size: 0.8rem;">Delete</button>
          </td>
        `;
                tbody.appendChild(tr);
            });

            // attach delete listeners
            tbody.querySelectorAll('button[data-id]').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    const id = (ev.currentTarget as HTMLElement).getAttribute('data-id')!;
                    deleteUser(Number(id));
                });
            });
        }
    } catch (err) {
        console.error('Error loading users:', err);
    }
}

export function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.style.display = 'block';
}

export async function handleAddUser(e: Event | React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#newUserName') as HTMLInputElement).value;
    const email = (form.querySelector('#newUserEmail') as HTMLInputElement).value;
    const password = (form.querySelector('#newUserPassword') as HTMLInputElement).value;
    const role = (form.querySelector('#newUserRole') as HTMLSelectElement).value;

    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({ name, email, password, role })
        });

        if (res.ok) {
            alert('User created');
            const modal = document.getElementById('addUserModal');
            if (modal) modal.style.display = 'none';
            (document.getElementById('addUserForm') as HTMLFormElement).reset();
            loadUsers();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    } catch (err: any) {
        alert('Error: ' + err.message);
    }
}

export async function deleteUser(id: number) {
    if (!confirm('Are you sure?')) return;
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.ok) {
            loadUsers();
        } else {
            alert('Failed to delete user');
        }
    } catch (err: any) {
        alert('Error: ' + err.message);
    }
}
