import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';
import SubmitRequest from '../submit-request/submitRequest.model';
class TypeSchema extends Model {
    toJSON() {
        const ret = { ...this.get() };
        const fileKeys = ['type', 'approver'];
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
TypeSchema.init({
    type: { type: DataTypes.STRING},
    approver: { type: DataTypes.STRING, allowNull: false },
    
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize,
    modelName: 'typeCategories',
    timestamps: true,
});

export default TypeSchema;