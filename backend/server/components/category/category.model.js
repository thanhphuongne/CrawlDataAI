import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';
import SubmitRequest from '../submit-request/submitRequest.model';
class CategorySchema extends Model {
    toJSON() {
        const ret = { ...this.get() };
        const fileKeys = ['name', 'description'];
        fileKeys.forEach((fileKey) => {
            const file = ret[fileKey];
            if (file && file.url) {
                file.url = `${UPLOAD_GET_HOST}/${file.url}`;
                delete file.fieldname;
                delete file.encoding;
                delete file.mimetype;
                delete file.destination;
                delete file.path;
                ret[fileKey] = file;
            }
        });
        delete ret.isActive;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
    }
}
CategorySchema.init({
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING},
    description: { type: DataTypes.TEXT, allowNull: false },
    approver: { type: DataTypes.STRING, allowNull: false }, 
    score: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize,
    modelName: 'categories',
    timestamps: true,
});

export default CategorySchema;