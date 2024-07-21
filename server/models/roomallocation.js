
module.exports = (sequelize, DataTypes) => {
    const Roomallocation = sequelize.define('Roomallocation', {
      
        
    
    });
    Roomallocation.associate = models => {
     
        Roomallocation.belongsTo(models.Eventroom, {
          foreignKey: 'room_id',
          as: 'Eventroom',
        });
        Roomallocation.belongsTo(models.Eventregister, {
            foreignKey: 'eventregistration_id',
            as: 'Eventregister',
          });
        Roomallocation.belongsTo(models.Usher, {
            foreignKey: 'usher_id',
            as: 'Usher',
          });
    };
    return Roomallocation;
};