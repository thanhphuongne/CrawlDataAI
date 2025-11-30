import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  USER_JWT_DEFAULT_EXPIRE_DURATION,
  USER_ROLES,
  USER_STATUS,
} from '../../constants';
import {
  UPLOAD_GET_HOST,
  USER_JWT_SECRET_KEY,
} from '../../config';

class User extends Model {
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  signJWT(expiresIn, secret = null) {
    // return `Bearer ${jwt.sign({
    return `${jwt.sign({
      _id: this.id,
    }, secret || USER_JWT_SECRET_KEY, {
      expiresIn: expiresIn || USER_JWT_DEFAULT_EXPIRE_DURATION,
    })}`;
  }

  toJSON() {
    const ret = { ...this.get() };
    const fileKeys = [ 'email'];
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
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  }
}

User.init({
  accountName:{ type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {type: DataTypes.ENUM(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR),
  defaultValue: USER_ROLES.USER},
  verifyCode: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  modelName: 'users',
  timestamps: true,
});

User.beforeSave((user, options) => {
  if (typeof user.email === 'string') {
    user.email = user.email.toLowerCase();
  }
});

User.beforeCreate((user, options) => {
  // Hash password before creating new user
  if (user.password && !user.password.startsWith('$2')) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
});

export default User;

