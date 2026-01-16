export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export function logout() {
    localStorage.clear();
    window.location.href = '/login';
}

export function getRole() {
    return localStorage.getItem('role');
}

export function getName() {
    return localStorage.getItem('name');
}
