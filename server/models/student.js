// student.js
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
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
    domain:{
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

  Student.associate = models => {
    Student.belongsTo(models.University, {
      foreignKey: 'university_id',
      as: 'university',
    });

    Student.hasMany(models.Project_student, {
      foreignKey: 'student_id',
      as: 'project_students',
    });
    Student.hasMany(models.Interview, {
      foreignKey: 'student_id',
      as: 'Interview',
    });

    Student.hasMany(models.CV, {
      foreignKey: 'student_id',
      as: 'CV',
    });
  };


  return Student;
};
