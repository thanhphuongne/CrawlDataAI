import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/connection';
import AIUser from './user.model';

class Request extends Model {}

Request.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AIUser,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  requirement: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  export_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Request',
  tableName: 'requests',
  timestamps: false,
});

AIUser.hasMany(Request, { foreignKey: 'user_id' });
Request.belongsTo(AIUser, { foreignKey: 'user_id' });

export default Request;