import {
	Sequelize,
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import { User } from "../../../modules/user/model";

export class PasswordResetToken extends Model<
	InferAttributes<PasswordResetToken>,
	InferCreationAttributes<PasswordResetToken>
> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User["userId"]>;
	declare token: string;
	declare expiresAt: Date;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

export function initializePasswordResetToken(sequelize: Sequelize) {
	PasswordResetToken.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			expiresAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			underscored: true,
			tableName: "password_reset_tokens",
			sequelize,
			indexes: [
				{ name: "u_password_reset_tokens_token_idx", fields: ["token"], unique: true },
				{ name: "u_password_reset_tokens_user_id_idx", fields: ["user_id"] },
				{ name: "u_password_reset_tokens_expires_at_idx", fields: ["expires_at"] },
			],
		}
	);
}

export function establishRelationsPasswordResetToken() {
	PasswordResetToken.belongsTo(User, {
		foreignKey: "userId",
		as: "user",
	});
}