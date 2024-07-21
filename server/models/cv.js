// Assuming this is university.js

module.exports = (sequelize, DataTypes) => {
    const CV = sequelize.define('CV', {
      
      cv: {
        type: DataTypes.BLOB('long'),
        allowNull: false, // Allow null if you want to make it optional
      },
      
    });

    CV.associate = models => {
     
      CV.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'Student',
      });
  
    };
  
    return CV;
  };
  