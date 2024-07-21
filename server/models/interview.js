module.exports = (sequelize, DataTypes) => {
    const Interview = sequelize.define('Interview', {
        status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          
    });
   
    Interview.associate = models => {
     
        Interview.belongsTo(models.Student, {
          foreignKey: 'student_id',
          as: 'Eventroom',
        });
        Interview.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'Company',
          });
          Interview.belongsTo(models.Slots, {
            foreignKey: 'slot_id',
            as: 'Slots',
          });
    };
    return Interview;
};