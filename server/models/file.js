// Assuming this is university.js

module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
      
      image: {
        type: DataTypes.BLOB('long'),
        allowNull: false, // Allow null if you want to make it optional
      },
      
    });
  
    
  
    return File;
  };
  