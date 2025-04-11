


export const validateCreateAnswer = (req, res, next) => {

    const { content} = req.body;

    if(!content || typeof content !== "string") {
        return res.status(400).json({
            message: "content is required and must be a string."
        });
    }

    if (content.length > 300) {
        return res.status(400).json({
            message: "content must not exceed 300 characters."
        });
    }

    next();

};
