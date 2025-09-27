import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  USER_JWT_DEFAULT_EXPIRE_DURATION,
} from '../../constants';
import {
  USER_JWT_SECRET_KEY,
} from '../../config';

class AIUser extends Model {
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  signJWT(expiresIn, secret = null) {
    return jwt.sign({
      _id: this.id,
    }, secret || USER_JWT_SECRET_KEY, {
      expiresIn: expiresIn || USER_JWT_DEFAULT_EXPIRE_DURATION,
    });
  }

  toJSON() {
    const ret = { ...this.get() };
    delete ret.password;
    delete ret.created_at;
    delete ret.updated_at;
    delete ret.__v;
    return ret;
  }
}

AIUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'AIUser',
  tableName: 'ai_users',
  timestamps: false, // Since we have created_at manually
});

AIUser.beforeSave((user, options) => {
  if (typeof user.email === 'string') {
    user.email = user.email.toLowerCase();
  }
});

export default AIUser;