import * as CategoryService from './category.service';

export async function createCategory(req, res, next) {
    try {
        const body = req.body;
        await CategoryService.createCategory({
            name: body.name,
            description: body.description,
            score: body.score,
            approver:body.approver,
            type:body.type
        });
        return res.json({
            success: true,
        });
    } catch (error) {
        return next(error);
    }
}

export async function createTypeCategory(req, res, next) {
    try {
        const body = req.body;
        await CategoryService.createTypeCategory({
            approver: body.approver,
            type:body.type
        });
        return res.json({
            success: true,
        });
    } catch (error) {
        return next(error);
    }
}

export async function updateCategory(req, res, next) {
    try {
        const body = req.body;
        const result = await CategoryService.updateCategory(req.params.id, {
            name: body.name,
            description: body.description,
            score: body.score,
            type:body.type
        });
        return res.json({
            ...result
        });
    } catch (error) {
        return next(error);
    }
}

export async function getCategories(req, res, next) {
    try {
        const pageNumber = parseInt(req.query.pagenumber) || 1; // Default là 1 nếu không được truyền
        const pageSize = parseInt(req.query.pagesize) || 100; 
        const categories = await CategoryService.getCategories({pageNumber,pageSize});
        return res.json({
            success: true,
            payload: categories,
        });
    } catch (error) {
        return next(error);
    }
}
