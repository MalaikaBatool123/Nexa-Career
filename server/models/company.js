
module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specification:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comrepname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false
      },
    });
    Company.associate = models => {
    
      Company.hasMany(models.Eventregister, {
        foreignKey: 'company_id',
        as: 'eventregister',
      });
      Company.hasMany(models.Interview, {
        foreignKey: 'company_id',
        as: 'Interview',
      })
    }
    return Company;
};