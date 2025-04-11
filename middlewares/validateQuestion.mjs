

export const validateCreateQuestion = (req, res, next) => {

    const { title, description, category} = req.body;

    if(!title || typeof title !== "string") {
        return res.status(400).json({
            message: "title is required"
        });
    };

    if(!description || typeof description !== "string") {
        return res.status(400).json({
            message: "description is required"
        });
    };

    if(!category || typeof category !== "string") {
        return res.status(400).json({
            message: "category is required"
        });
    };

    next();

};
