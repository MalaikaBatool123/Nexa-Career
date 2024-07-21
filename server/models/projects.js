// student.js
module.exports = (sequelize, DataTypes) => {
    const Projects = sequelize.define('Projects', {
      
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domain:{
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  
    Projects.associate = models => {
        Projects.belongsTo(models.University, {
        foreignKey: 'university_id',
        as: 'university',
      });
      
      Projects.hasMany(models.Project_student, {
        foreignKey: 'project_id',
        as: 'project_students',
      });
    };
   
    
  
    return Projects;
  };
  