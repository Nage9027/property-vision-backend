function validationError(res, error) {
    return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        error,
    });
}
export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success)
            return validationError(res, result.error.flatten());
        req.body = result.data;
        return next();
    };
}
export function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success)
            return validationError(res, result.error.flatten());
        req.params = result.data;
        return next();
    };
}
