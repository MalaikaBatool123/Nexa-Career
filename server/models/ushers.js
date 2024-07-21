module.exports = (sequelize, DataTypes) => {
    const Usher = sequelize.define('Usher', {
      regno: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      contact:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Usher.associate = models => {
        Usher.belongsTo(models.University, {
        foreignKey: 'university_id',
        as: 'university',
      });
      Usher.hasMany(models.Roomallocation, {
        foreignKey: 'usher_id',
        as: 'Usher',
      });
    };
  
    return Usher;
  };
  