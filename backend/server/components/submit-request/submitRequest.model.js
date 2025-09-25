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
class SubmitRequest extends Model {

  toJSON() {
    const ret = { ...this.get() };
    const fileKeys = ['accountName', 'descriptions', 'supervisor', 'category', 'hasNotifyMail', 'createBy'];
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
    delete ret.password;
    // delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  }
}

SubmitRequest.init({
  accountName: { type: DataTypes.STRING, allowNull: false },
  descriptions: { type: DataTypes.TEXT, allowNull: false },
  supervisor: { type: DataTypes.INTEGER, allowNull: false, references: {
    model: 'users', // Tên bảng tham chiếu
    key: 'id'       // Khoá chính trong bảng 'users'
  },
  onUpdate: 'CASCADE', // Cập nhật khi id của user thay đổi
  onDelete: 'SET NULL' },
  approver: { type: DataTypes.STRING, allowNull: false},
  categoryId: { 
    type: DataTypes.INTEGER,
    allowNull: false, // Set to true if nullable
    references: {
        model: 'categories', // The referenced table name
        key: 'id',          // The primary key in the referenced table
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // Adjust based on your requirements
},
  hasNotifyMail: { type: DataTypes.BOOLEAN, defaultValue: false },
  suppervisorApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
  approverApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {type: DataTypes.ENUM(PROCESS_STATUS.WAITING, PROCESS_STATUS.APPROVED, PROCESS_STATUS.CONFIRMED,PROCESS_STATUS.REJECT,PROCESS_STATUS.CANCEL),defaultValue:PROCESS_STATUS.WAITING},
  createBy: {
    type: DataTypes.INTEGER, references: {
      model: 'users', // Tên bảng tham chiếu
      key: 'id'       // Khoá chính trong bảng 'users'
    },
    onUpdate: 'CASCADE', // Cập nhật khi id của user thay đổi
    onDelete: 'SET NULL'
  },
}, {
  sequelize,
  modelName: 'submitRequest',
  timestamps: true,
  indexes: [
    {
      fields: ['suppervisorApproved'], // Đánh index cho suppervisorApproved
    },
    {
      fields: ['approverApproved'], // Đánh index cho approverApproved
    },
    {
      fields: ['status'], // Đánh index cho approverApproved
    },
  ],
});

SubmitRequest.beforeSave((user, options) => {
  if (typeof user.email === 'string') {
    user.email = user.email.toLowerCase();
  }
});

export default SubmitRequest;

