export function notFoundMiddleware(_req, res) {
    res.status(404).json({ success: false, message: 'Route not found.' });
}
export function errorMiddleware(error, _req, res, _next) {
    if (res.headersSent)
        return;
    if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
        const typed = error;
        return res.status(typed.status ?? 500).json({ success: false, message: typed.message ?? 'Server error.' });
    }
    const message = error instanceof Error ? error.message : 'Server error.';
    return res.status(500).json({ success: false, message });
}
