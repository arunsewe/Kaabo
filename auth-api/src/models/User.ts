import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";


interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  role?: string;
}

// For creating new users (id auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}


class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes 
{
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public role!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


User.init(
  {
    id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
},
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize, // passing the connection instance
    tableName: "users",
    modelName: "User",
    timestamps: true,
  }
);

export default User;

