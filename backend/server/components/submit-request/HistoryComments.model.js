import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  USER_JWT_DEFAULT_EXPIRE_DURATION,
  PROCESS_STATUS,
  USER_STATUS,
} from '../../constants';
import {
  UPLOAD_GET_HOST,
  USER_JWT_SECRET_KEY,
} from '../../config';
import Category from '../category/category.model';
class HistoryComments extends Model {

  toJSON() {
    const ret = { ...this.get() };
    const fileKeys = ['submitId', 'commentBy', 'descriptions', 'createdAt'];
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
    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  }
}

HistoryComments.init({
  submitId: { type: DataTypes.INTEGER, allowNull: false, references: {
    model: 'submitRequests', // Tên bảng tham chiếu
    key: 'id'       // Khoá chính trong bảng 'users'
  },
  onUpdate: 'CASCADE', // Cập nhật khi id của user thay đổi
  onDelete: 'SET NULL' },
  descriptions: { type: DataTypes.TEXT, allowNull: false },
  commentBy: {
    type: DataTypes.INTEGER, references: {
      model: 'users', // Tên bảng tham chiếu
      key: 'id'       // Khoá chính trong bảng 'users'
    },
    onUpdate: 'CASCADE', // Cập nhật khi id của user thay đổi
    onDelete: 'SET NULL'
  },
}, {
  sequelize,
  modelName: 'historyComments',
  timestamps: true,
  indexes: [
    {
      fields: ['submitId'], // Đánh index cho suppervisorApproved
    },
    {
      fields: ['commentBy'], // Đánh index cho approverApproved
    }
  ],
});

HistoryComments.beforeSave((user, options) => {
  if (typeof user.email === 'string') {
    user.email = user.email.toLowerCase();
  }
});

export default HistoryComments;

