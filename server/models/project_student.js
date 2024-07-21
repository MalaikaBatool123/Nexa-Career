// student.js
module.exports = (sequelize, DataTypes) => {
    const Project_student = sequelize.define('Project_student', {
      
      
    });
  
    Project_student.associate = models => {

      Project_student.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student',
      });

      Project_student.belongsTo(models.Projects, {
        foreignKey: 'project_id',
        as: 'project',
      });

    };

    
    return Project_student;
  };
  