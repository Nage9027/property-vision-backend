export function slugify(value) {
    return value.toLowerCase().trim().replace(/\s+/g, '-');
}
