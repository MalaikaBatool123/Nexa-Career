module.exports = (sequelize, DataTypes) => {
    const Signup = sequelize.define('Signup', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          role: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    });
   
    
    return Signup;
};