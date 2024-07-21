// Assuming this is university.js

module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define('University', {
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
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
    unirepname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  University.associate = models => {
    
    University.hasMany(models.UniEvent, {
      foreignKey: 'university_id',
      as: 'unievents',
    });

    University.hasMany(models.Student, {
      foreignKey: 'university_id',
      as: 'students',
    });

    University.hasMany(models.Projects, {
      foreignKey: 'university_id',
      as: 'projects',
    });
    
  };
  
  

  return University;
};
