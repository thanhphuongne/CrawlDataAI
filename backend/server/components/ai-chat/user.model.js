import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';

class AIUser extends Model {}

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

export default AIUser;