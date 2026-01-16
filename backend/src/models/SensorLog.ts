import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';

export class SensorLog extends Model<
    InferAttributes<SensorLog>,
    InferCreationAttributes<SensorLog>
> {
    declare id: CreationOptional<number>;
    declare sensor_id: string;
    declare value: number;
    declare created_at: CreationOptional<Date>;
}

SensorLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sensor_id: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.INTEGER,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'sensor_logs',
        timestamps: false,
    }
);
