export function getPagination(page = 1, limit = 10) {
    return { page, limit, offset: (page - 1) * limit };
}
