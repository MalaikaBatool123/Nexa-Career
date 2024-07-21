module.exports = (sequelize, DataTypes) => {
    const Slots = sequelize.define('Slots', {
        timeslot: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          
    });
    Slots.associate = models => {
    
        Slots.hasMany(models.Interview, {
          foreignKey: 'slot_id',
          as: 'Interview',
        });
        
      }
    
    return Slots;
};