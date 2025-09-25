import slug from 'limax';
import Category from './category.model';
import Type from './type.model';
import logger from '../../util/logger';
// import { getNextSequence } from '../counter/counter.service';
// import { SEQUENCES } from '../../constants';

/**
 * Creat new category
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.definition
 * @param {string} data.score
 * @param {string} data.type
 * @returns {Promise<*>}
 */
export async function createCategory(data) {
    try {
        // const id = await getNextSequence(SEQUENCES.CATEGORY_ID);
        await Category.create({
            name: data.name,
            description: data.description,
            score: data.score,
            type: data.type,
            approver: data.approver
        });
    } catch (error) {
        logger.error(`CategoryService createCategory error: ${error}`);
        throw error;
    }
}

// /**
//  * Creat new category
//  * @param {object} data
//  * @param {string} data.name
//  * @param {string} data.approver
//  * @returns {Promise<*>}
//  */
// export async function createTypeCategory(data) {
//     try {
//         // const id = await getNextSequence(SEQUENCES.CATEGORY_ID);
//         console.log("== data===",data)
//         await Type.create({
//             type: data.type,
//             approver:data.approver
//         });
//     } catch (error) {
//         logger.error(`CategoryService createTypeCategory error: ${error}`);
//         throw error;
//     }
// }

/**
 * Update category
 * @param {number} categoryId
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.description
 * @param {number} [data.score]
 * @param {string} [data.type]
 * @returns {Promise<*>}
 */
export async function updateCategory(categoryId, data) {
    try {
        const [affectedRows] = await Category.update(
            {
                name: data.name,
                description: data.description,
                score: data.score,
                type: data.type,
                approver: data.approver
            },
            {
                where: { id: categoryId }, // Assuming "id" is the primary key
            }
        );

        if (affectedRows === 0) {
            throw new APIError(403, [
                {
                    msg: 'categoryId is not available',
                    param: 'idNotAvailable',
                },
            ]);
        }

        return {
            success: true,
            msg: "Success"
        };
    } catch (error) {
        console.error(`CategoryService updateCategory error: ${error}`);
        throw error;
    }
}

/**
 * Get categories
 * @returns {Promise<*>}
 */
export async function getCategories(params) {
    try {
        // const categories = await Category.find({});
        const offset = (params.pageNumber - 1) * params.pageSize;
        const limit = params.pageSize;
        // Lấy dữ liệu từ cơ sở dữ liệu với phân trang
        const { count, rows } = await Category.findAndCountAll({
            where: { isActive: true }, // Điều kiện where
            limit, // Số lượng bản ghi trả về
            offset, // Vị trí bắt đầu
            order: [['name', 'ASC']] // sap xep theo name tang dan
        });
        // Tính tổng số trang
        const totalPages = Math.ceil(count / params.pageSize);
        // console.log("====",rows)
        // let data = [];
        // for(let i = 0 ; i< rows.length;i++) {
        //     const approvers = await Type.findAll({where: { isActive:true, type:rows[i].type}});

        //     rows[i].dataValues.approvers = approvers.map(approver => {
        //         return {
        //             value:approver.dataValues.approver,
        //             name:approver.dataValues.approver
        //         }
        //     }); // Map dataValues for all results
        //     data.push(rows[i])
        // }
        return {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            totalItems: count,
            totalPages,
            data: rows,
        };
    } catch (error) {
        logger.error(`CategoryService getCategories error: ${error}`);
        throw error;
    }
}

/**
 * Get category by category query
 * @param {object} query The mongo query
 * @returns {Promise.<{id: *}>} Return category or an error
 */
export async function getCategory(query) {
    try {
        return await Category.findOne(query);
    } catch (error) {
        logger.error(`CategoryService getCategory error: ${error}`);
        throw error;
    }
}
